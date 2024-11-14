import LoadingSpinner from "@/components/base/LoadingSpinner";
import UserSearchComponent from "@/components/layout/admin/usersearch/UserSearchComponent";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import { withAuth } from "@/hoc/withAuth";
import { fetchGetUserSearch } from "@/lib/admin/apis";
import { StatsApiResponse } from "@/lib/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetchGetUserSearch("", "1", "10", context);
  return {
    props: { apiResponse: response },
  };
};

const UserSearch = (
  { apiResponse }: { apiResponse: StatsApiResponse },
  context: GetServerSidePropsContext,
) => {
  const [newApiResponse, setNewApiResponse] =
    useState<StatsApiResponse>(apiResponse);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [pageNum, setPageNum] = useState<string>("1");
  const [pageSize, setPageSize] = useState<string>("10");

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await fetchGetUserSearch(userId, pageNum, pageSize, context);
      setNewApiResponse(data as StatsApiResponse);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSizeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPageSize(event.target.value);
    setPageNum("1");
    fetchGetUserSearch(userId, pageNum, pageSize, context);
  };

  const fetchUserSearch = async (
    userId: string,
    pageNum: string,
    pageSize: string,
  ): Promise<StatsApiResponse> => {
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
              apiResponse={newApiResponse}
              userId={userId}
              setUserId={setUserId}
              pageNum={pageNum}
              setPageNum={setPageNum}
              pageSize={pageSize}
              setLoading={setLoading}
              fetchUserSearch={fetchUserSearch}
            />
            <div className="mt-4 flex gap-2">
              <div className="pageOption flex w-fit items-center justify-center rounded-lg bg-gray-100 p-2">
                <div className="w-[70px]">아이템 수</div>
                <select
                  className="w-[50px]"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </ContentsContainer>
        </div>
      </DashboardContainer>
    </>
  );
};

export default withAuth(UserSearch);
