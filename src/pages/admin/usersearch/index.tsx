import LoadingSpinner from "@/components/base/LoadingSpinner";
import UserSearchComponent from "@/components/layout/admin/usersearch/UserSearchComponent";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import { withAuth } from "@/hoc/withAuth";
import { fetchUserSearch } from "@/lib/admin/apis";
import { StatsApiResponse } from "@/lib/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetchUserSearch("", "1", "10", context);
  return {
    props: {
      apiResponse: response,
    },
  };
};
const UserSearch = (
  apiResponse: StatsApiResponse,
  context: GetServerSidePropsContext,
) => {
  const [newApiResponse, setNewApiResponse] =
    useState<StatsApiResponse>(apiResponse);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [pageNum, setPageNum] = useState<string>("1");
  const [pageSize, setPageSize] = useState<string>("10");
  const handleSearch = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const data = await fetchUserSearch(userId, pageNum, pageSize, context);
      setNewApiResponse(data as StatsApiResponse);
      return data;
    } catch (error) {
      console.error("Error: ", error);
      return {
        status: 500,
        success: false,
        message: "검색어를 다시 확인 해 주세요",
        error: String(error),
      };
    }
  };
  useEffect(() => {
    if (apiResponse) {
      setLoading(false);
    }
  }, [apiResponse]);
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
            />
          </ContentsContainer>
        </div>
      </DashboardContainer>
    </>
  );
};
export default withAuth(UserSearch);
