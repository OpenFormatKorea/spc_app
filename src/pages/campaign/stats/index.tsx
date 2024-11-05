import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { withAuth } from "@/hoc/withAuth";
import CampaignStats from "@/components/layout/campaign/CampaignStats";
import { ApiResponse } from "@/lib/types";
import { fetchGetCampaignStats } from "@/lib/campaign/apis";
import { Modal } from "@mui/material";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const today: Date = new Date();
  const end_date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const thirtyDaysBefore: Date = new Date(today);
  thirtyDaysBefore.setDate(today.getDate() - 180);
  const start_date = `${thirtyDaysBefore.getFullYear()}-${String(thirtyDaysBefore.getMonth() + 1).padStart(2, "0")}-${String(thirtyDaysBefore.getDate()).padStart(2, "0")}`;
  const page = "1";
  const page_size = "10";
  const apiResponse = await fetchGetCampaignStats(
    start_date,
    end_date,
    page,
    page_size,
    context,
  );
  return {
    props: {
      apiResponse,
      start_date,
      end_date,
      page,
      page_size,
    },
  };
};

const StatsCampaign = (
  {
    apiResponse,
    start_date,
    end_date,
    page,
    page_size,
  }: {
    apiResponse: ApiResponse;
    start_date: string;
    end_date: string;
    page: string;
    page_size: string;
  },
  context: GetServerSidePropsContext,
) => {
  const [endDate, setEndDate] = useState(end_date);
  const [startDate, setStartDate] = useState(start_date);
  const [pageNum, setPageNum] = useState(page);
  const [pageSize, setPageSize] = useState(page_size);
  const [NewapiResponse, setNewApiResponse] =
    useState<ApiResponse>(apiResponse);
  const [loading, setLoading] = useState(false);

  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";

  const handlePageSizeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newPageSize = event.target.value;
    setPageSize(newPageSize);
    setPageNum("1");

    const fetchData = async () => {
      setLoading(true);
      try {
        const response: ApiResponse = await fetchGetCampaignStats(
          startDate,
          endDate,
          "1",
          newPageSize,
          context,
        );
        setNewApiResponse(response);
      } catch (error) {
        console.error("Failed to fetch campaign stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };
  useEffect(() => {}, [pageNum, pageSize]);
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
            <span className="text-2xl font-bold">캠페인 지표</span>
          </div>
        </div>
        <ContentsContainer variant="dashboard">
          <CampaignStats
            theadStyle={theadStyle}
            tbodyStyle={tbodyStyle}
            apiResponse={NewapiResponse}
          />
          <div className="pageOption flex w-fit items-center justify-center rounded-lg bg-gray-100 p-2">
            <div className="w-[70px]">아이템 수 </div>
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
        </ContentsContainer>
      </DashboardContainer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <></>
      </Modal>
    </>
  );
};

export default withAuth(StatsCampaign);
