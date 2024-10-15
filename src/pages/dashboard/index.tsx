// src/pages/dashboard.tsx
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import CampaignList from "@/components/layout/campaign/CampaignList";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { fetchGetCampaignList } from "@/lib/campaign/apis";
import { useEffect, useState } from "react";
import { withAuth } from "@/hoc/withAuth";
import { ApiResponse } from "@/lib/types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const campaignResponse = await fetchGetCampaignList(context);
  return {
    props: {
      apiResponse: campaignResponse,
    },
  };
};

const Dashboard: React.FC<{ apiResponse: ApiResponse }> = ({ apiResponse }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";

  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "more_campaign") {
      router.push("/campaign");
    }
  };

  useEffect(() => {
    if (apiResponse) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
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
        <div className="mb-3 flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <a className="text-2xl font-bold">대시보드</a>
          </div>
        </div>
        <div className="contents-container w-full justify-center">
          <ContentsContainer variant="dashboard">
            <CampaignList
              theadStyle={theadStyle}
              tbodyStyle={tbodyStyle}
              apiResponse={apiResponse}
              handleButton={handleButton}
            />
          </ContentsContainer>
        </div>
      </DashboardContainer>
    </>
  );
};

export default withAuth(Dashboard);
