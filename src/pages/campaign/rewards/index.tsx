import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { withAuth } from "@/hoc/withAuth";

import {
  fetchGetCampaignList,
  fetchGetCampaignStats,
} from "@/lib/campaign/apis";
import CampaignRewards from "@/components/layout/campaign/rewards/CampaignRewards";
import { CampaignListApiResponse } from "@/lib/campaign/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const today = new Date();
  const end_date = today.toISOString().split("T")[0];
  const start_date = new Date(today.setDate(today.getDate() - 30))
    .toISOString()
    .split("T")[0];

  const campaignListResponse = await fetchGetCampaignList("1", "25", context);
  console.log("campaign LIST Response", campaignListResponse);
  return {
    props: {
      campaignListResponse,
      start_date,
      end_date,
      page: "1",
      page_size: "25",
    },
  };
};

const RewardsCampaign = (
  {
    campaignListResponse,
    start_date,
    end_date,
    page,
    page_size,
  }: {
    campaignListResponse: CampaignListApiResponse;
    start_date: string;
    end_date: string;
    page: string;
    page_size: string;
  },
  context: GetServerSidePropsContext,
) => {
  const [newApiResponse, setNewApiResponse] =
    useState<CampaignListApiResponse>(campaignListResponse);
  const [period, setPeriod] = useState("30");
  //const [period, setPeriod] = useState("13");
  const [startDate, setStartDate] = useState(start_date);
  const endDate = end_date;
  const [pageNum, setPageNum] = useState(page);
  const [loading, setLoading] = useState(false);
  const pageSize = page_size;

  const fetchData = async (newPeriod: string) => {
    const newStartDate = new Date();
    newStartDate.setDate(newStartDate.getDate() - Number(newPeriod));

    const year = newStartDate.getFullYear();
    const month = String(newStartDate.getMonth() + 1).padStart(2, "0");
    const day = String(newStartDate.getDate()).padStart(2, "0");

    const formattedStartDate = `${year}-${month}-${day}`;
    setStartDate(formattedStartDate);
    setPageNum("1");
    setLoading(true);
    try {
      const data = await fetchGetCampaignStats(
        formattedStartDate,
        end_date,
        "1",
        pageSize,
        context,
      );
      setNewApiResponse(data);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(period);
  }, [period]);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <LoadingSpinner />
        </div>
      )}
      <DashboardContainer>
        <div className="mb-[8px] flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <span className="text-2xl font-bold">캠페인 리워드 내역</span>
          </div>
        </div>

        <ContentsContainer variant="dashboard">
          <CampaignRewards
            apiResponse={campaignListResponse}
            pageNum={pageNum}
            setPageNum={setPageNum}
            startDate={startDate}
            endDate={endDate}
            pageSize={pageSize}
            period={period}
            setLoading={setLoading}
            setPeriod={setPeriod}
          />
        </ContentsContainer>
      </DashboardContainer>
    </>
  );
};

export default withAuth(RewardsCampaign);
