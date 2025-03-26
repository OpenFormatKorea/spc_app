import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import CampaignList from "@/components/layout/campaign/CampaignList";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { CampaignListApiResponse } from "@/lib/campaign/types";
import { fetchGetCampaignList } from "@/lib/campaign/apis";
import { useEffect, useState } from "react";
import { withAuth } from "@/hoc/withAuth";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
interface DashboardProps {
  apiResponse: CampaignListApiResponse;
  page: string;
  page_size: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const campaignResponse = await fetchGetCampaignList("1", "25", context);
  return {
    props: {
      apiResponse: campaignResponse,
      page: "1",
      page_size: "25",
    },
  };
};

const Dashboard: React.FC<DashboardProps> = ({
  apiResponse,
  page,
  page_size,
}) => {
  const [pageNum, setPageNum] = useState(page);
  const pageSize = page_size;
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
        <div className="contents-container w-full justify-center">
          <ContentsContainer variant="dashboard">
            <CampaignList
              apiResponse={apiResponse}
              pageNum={pageNum}
              pageSize={pageSize}
              handleButton={handleButton}
              setLoading={setLoading}
              setPageNum={setPageNum}
            />
          </ContentsContainer>
        </div>
      </DashboardContainer>
    </>
  );
};

export default withAuth(Dashboard);
