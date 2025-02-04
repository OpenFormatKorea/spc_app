import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { withAuth } from "@/hoc/withAuth";
import CampaignStats from "@/components/layout/campaign/stats/CampaignStats";
import { StatsApiResponse } from "@/lib/types";
import { fetchGetCampaignStats } from "@/lib/campaign/apis";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const today = new Date();
  const end_date = today.toISOString().split("T")[0];
  const start_date = new Date(today.setDate(today.getDate() - 30))
    .toISOString()
    .split("T")[0];
  const apiResponse = await fetchGetCampaignStats(
    start_date,
    end_date,
    "1",
    "10",
    context,
  );
  return {
    props: { apiResponse, start_date, end_date },
  };
};

const StatsCampaign = (
  {
    apiResponse,
    start_date,
    end_date,
  }: {
    apiResponse: StatsApiResponse;
    start_date: string;
    end_date: string;
  },
  context: GetServerSidePropsContext,
) => {
  const [newApiResponse, setNewApiResponse] =
    useState<StatsApiResponse>(apiResponse);

  const [period, setPeriod] = useState("30");
  const [startDate, setStartDate] = useState(start_date);
  const [endDate] = useState(end_date);
  const [pageNum, setPageNum] = useState("1");
  const pageSize = "10";

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const newStartDate = new Date();
    newStartDate.setDate(newStartDate.getDate() - Number(period));
    const formattedStartDate = newStartDate.toISOString().split("T")[0];

    setStartDate(formattedStartDate);
    setPageNum("1");
    console.log("startDate ", startDate);
    console.log("endDate ", endDate);
    const data = await fetchGetCampaignStats(
      startDate,
      endDate,
      pageNum,
      pageSize,
      context,
    );
    setNewApiResponse(data);
  };

  useEffect(() => {
    setLoading(true);

    try {
      fetchData();
    } catch (e) {
      console.error("error:", e);
    } finally {
      setLoading(false);
    }
  }, [period]);

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
            apiResponse={newApiResponse}
            pageNum={pageNum}
            setPageNum={setPageNum}
            startDate={startDate}
            endDate={endDate}
            pageSize={pageSize}
            setLoading={setLoading}
          />
          <div className="flex h-[40px] gap-2">
            <div className="pageOption flex w-fit items-center justify-center rounded-lg bg-gray-100 p-2">
              <div className="flex min-w-[70px] items-center gap-2 text-left text-sm">
                <label className="font-bold">내역기간</label>
              </div>
              <select
                className="font-sm"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
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

export default withAuth(StatsCampaign);
