import LoadingSpinner from "@/components/base/LoadingSpinner";
import UserDetailsModal from "@/components/layout/admin/usersearch/stat/UserDetailsModal";
import UserSearchComponent from "@/components/layout/admin/usersearch/UserSearchComponent";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import { withAuth } from "@/hoc/withAuth";
import { fetchGetUserDetail, fetchGetUserSearch } from "@/lib/admin/apis";
import {
  RewardEligibilityType,
  UserDataApiResponse,
  UserSearchList,
} from "@/lib/admin/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetchGetUserSearch("", "1", "25", context);
  return {
    props: { apiResponse: response },
  };
};

const UserSearch = (
  { apiResponse }: { apiResponse: UserDataApiResponse },
  context: GetServerSidePropsContext,
) => {
  const [newApiResponse, setNewApiResponse] =
    useState<UserDataApiResponse>(apiResponse);
  const [userDetailsResponse, setUserDetailsResponse] =
    useState<UserSearchList>({
      id: "",
      user_id: "",
      shop: "",
      status: "",
      reward_eligibility: RewardEligibilityType.ALL,
    });

  const [userId, setUserId] = useState<string>("");
  const [pageNum, setPageNum] = useState<string>("1");
  const pageSize = "25";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await fetchGetUserSearch(userId, pageNum, pageSize, context);
      setNewApiResponse(data as UserDataApiResponse);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserDetail = async (user_id: string) => {
    setLoading(true);
    try {
      const data = await fetchGetUserDetail(user_id, context);
      setUserDetailsResponse(data);
      setIsModalOpen(true);
      return data;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSearch = async (
    userId: string,
    pageNum: string,
    pageSize: string,
  ): Promise<UserDataApiResponse> => {
    setLoading(true);
    try {
      const data = await fetchGetUserSearch(userId, pageNum, pageSize, context);
      return data;
    } catch (error) {
      console.error("Failed to fetch campaign stats:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setPageNum("1");
    const data = await fetchGetUserSearch(userId, "1", pageSize, context);
    setNewApiResponse(data);
  };

  useEffect(() => {
    try {
      fetchData();
    } catch (e) {
      console.error("error:", e);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <LoadingSpinner />
        </div>
      )}
      <DashboardContainer>
        <div className="mb-3 flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <div className="text-2xl font-bold">유저 검색</div>
          </div>
        </div>
        <div className="flex w-full flex-col justify-center sm:flex-row md:flex-row md:space-x-4 lg:space-x-4">
          <ContentsContainer variant="dashboard">
            <UserSearchComponent
              handleSearch={handleSearch}
              handleUserDetail={handleUserDetail}
              apiResponse={newApiResponse}
              userId={userId}
              setUserId={setUserId}
              pageNum={pageNum}
              setPageNum={setPageNum}
              pageSize={pageSize}
              setLoading={setLoading}
              fetchUserSearch={fetchUserSearch}
            />
            <div className="mt-4 flex gap-2"></div>
          </ContentsContainer>
        </div>
      </DashboardContainer>
      <UserDetailsModal
        apiResponse={userDetailsResponse}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default withAuth(UserSearch);
