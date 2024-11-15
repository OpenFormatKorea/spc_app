import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from "react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { withAuth } from "@/hoc/withAuth";
import { StatsApiResponse } from "@/lib/types";
import { fetchGetItemStats } from "@/lib/item/apis";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemStats from "@/components/layout/item/item/stats/ItemStats";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const campaign_id = context.query.campaign_id?.toString() || "";
  const today = new Date();
  const end_date = today.toISOString().split("T")[0];
  const start_date = new Date(today.setDate(today.getDate() - 30))
    .toISOString()
    .split("T")[0];

  const apiResponse = await fetchGetItemStats(
    start_date,
    end_date,
    "1",
    "10",
    campaign_id,
    context,
  );

  if (!apiResponse) {
    return {
      redirect: {
        destination: "/campaign/stats",
        permanent: false,
      },
    };
  }

  return {
    props: {
      apiResponse,
      campaign_id,
      start_date,
      end_date,
      page: "1",
      page_size: "25",
    },
  };
};

const StatsItem = (
  {
    apiResponse,
    campaign_id,
    start_date,
    end_date,
    page,
  }: {
    apiResponse: StatsApiResponse;
    campaign_id: string;
    start_date: string;
    end_date: string;
    page: string;
  },
  context: GetServerSidePropsContext,
) => {
  const [startDate, setStartDate] = useState(start_date);
  const [endDate] = useState(end_date);
  const [pageNum, setPageNum] = useState(page);
  const pageSize = "25";
  const [period, setPeriod] = useState("30");
  const [newApiResponse, setNewApiResponse] =
    useState<StatsApiResponse>(apiResponse);
  const [loading, setLoading] = useState(false);

  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words text-center";

  const fetchItemsStats = async (
    start: string,
    end: string,
    pageSize: string,
    pageNum: string,
  ): Promise<StatsApiResponse> => {
    setLoading(true);
    try {
      const response = await fetchGetItemStats(
        start,
        end,
        pageNum,
        pageSize,
        campaign_id,
        context,
      );
      setNewApiResponse(response);
      return response;
    } catch (error) {
      console.error("Failed to fetch item stats:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = event.target.value;
    setPeriod(newPeriod);
    const newStartDate = new Date();
    newStartDate.setDate(newStartDate.getDate() - Number(newPeriod));
    const formattedStartDate = newStartDate.toISOString().split("T")[0];
    setStartDate(formattedStartDate);
    setPageNum("1");
    setNewApiResponse({ ...newApiResponse, result: [] });
    fetchItemsStats(formattedStartDate, endDate, pageSize, "1");
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
            <span className="text-2xl font-bold">아이템 지표</span>
          </div>
        </div>
        <ContentsContainer variant="dashboard">
          <ItemStats
            theadStyle={theadStyle}
            tbodyStyle={tbodyStyle}
            apiResponse={newApiResponse}
            fetchItemsStats={fetchItemsStats}
            pageNum={pageNum}
            setPageNum={setPageNum}
            startDate={startDate}
            endDate={endDate}
            pageSize={pageSize}
            setLoading={setLoading}
          />
          <div className="flex gap-2">
            <div className="pageOption flex w-fit items-center justify-center rounded-lg bg-gray-100 p-2">
              <div className="w-[70px]">내역기간</div>
              <select
                className="w-[80px]"
                value={period}
                onChange={handlePeriodChange}
              >
                <option value="30">30일 전</option>
                <option value="60">60일 전</option>
                <option value="90">90일 전</option>
                <option value="120">120일 전</option>
              </select>
            </div>
          </div>
        </ContentsContainer>
      </DashboardContainer>
    </>
  );
};

export default withAuth(StatsItem);
