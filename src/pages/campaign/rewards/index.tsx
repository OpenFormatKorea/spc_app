import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from "react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { withAuth } from "@/hoc/withAuth";

import { fetchGetCampaignList } from "@/lib/campaign/apis";
import CampaignRewards from "@/components/layout/campaign/rewards/CampaignRewards";
import { CampaignListApiResponse } from "@/lib/campaign/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const today = new Date();
  const end_date = today.toISOString().split("T")[0];
  const start_date = new Date(today.setDate(today.getDate() - 30))
    .toISOString()
    .split("T")[0];

  const campaignListResponse = await fetchGetCampaignList("1", "25", context);
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

const RewardsCampaign = ({
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
}) => {
  const endDate = end_date;
  const [pageNum, setPageNum] = useState(page);
  const [loading, setLoading] = useState(false);
  const pageSize = page_size;
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
            <span className="text-[24px] font-bold">캠페인 리워드 내역</span>
          </div>
        </div>

        <ContentsContainer variant="dashboard" size="full">
          <CampaignRewards
            apiResponse={campaignListResponse}
            pageNum={pageNum}
            setPageNum={setPageNum}
            startDate={start_date}
            endDate={endDate}
            pageSize={pageSize}
            setLoading={setLoading}
          />
        </ContentsContainer>
      </DashboardContainer>
    </>
  );
};

export default withAuth(RewardsCampaign);
