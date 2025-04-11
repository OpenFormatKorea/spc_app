import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { CampaignListApiResponse } from "@/lib/campaign/types";
import { fetchGetCampaignList } from "@/lib/campaign/apis";
import { useEffect, useState } from "react";
import { withAuth } from "@/hoc/withAuth";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import DashboardReport from "@/components/layout/dashboard/DashboardReport";
import { HourlySignups, myFunnelResponse } from "@/lib/campaign/reporttypes";
import {
  fetchHourlySignUpGraph,
  fetchMyFunnelGraph,
} from "@/lib/campaign/reportapis";
import DashboardCampaignList from "@/components/layout/dashboard/DashboardCampaignList";
interface DashboardProps {
  hourlysignUpApiResponse: HourlySignups;
  myFunnelApiResponse: myFunnelResponse;
  start_date: string;
  end_date: string;
  apiResponse: CampaignListApiResponse;
  page: string;
  page_size: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const campaignResponse = await fetchGetCampaignList("1", "10", context);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const end_date = yesterday.toISOString().split("T")[0];
  const start_date = new Date(yesterday.setDate(yesterday.getDate() - 30))
    .toISOString()
    .split("T")[0];
  const hourlysignUpApiResponse = await fetchHourlySignUpGraph(
    start_date,
    end_date,
    context,
  );
  const myFunnelApiResponse = await fetchMyFunnelGraph(
    start_date,
    end_date,
    context,
  );
  return {
    props: {
      hourlysignUpApiResponse,
      myFunnelApiResponse,
      apiResponse: campaignResponse,
      start_date,
      end_date,
    },
  };
};

const Dashboard: React.FC<DashboardProps> = ({
  hourlysignUpApiResponse,
  myFunnelApiResponse,
  start_date,
  end_date,
  apiResponse,
}) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget.id === "more_campaign") {
      router.push("/campaign");
    }
  };

  useEffect(() => {
    if (apiResponse) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
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
        <div className="mb-[8px] flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <span className="text-[24px] font-bold">대시보드</span>
          </div>
        </div>
        <div className="contents-container flex h-fit w-full flex-col justify-center gap-[20px]">
          <div className="flex h-fit w-full flex-col overflow-y-auto rounded-xl bg-white lg:p-[12px]">
            <DashboardReport
              hourlysignUpApiResponse={hourlysignUpApiResponse}
              myFunnelApiResponse={myFunnelApiResponse}
              startDate={start_date}
              endDate={end_date}
            />
          </div>
          <ContentsContainer variant="dashboard" size="half">
            <DashboardCampaignList
              apiResponse={apiResponse}
              handleButton={handleButton}
              setLoading={setLoading}
            />
          </ContentsContainer>
        </div>
      </DashboardContainer>
    </>
  );
};

export default withAuth(Dashboard);
