import CampaignList from "@/components/layout/campaign/CampaignList";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";

import { ApiResponse } from "@/lib/types";
import { fetchGetCampaignList } from "@/pages/campaign/lib/apis";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetchGetCampaignList(context);
  console.log("GETSERVERSIDE API RESPONSE: ", response);
  return {
    props: {
      apiResponse: response,
    },
  };
};

export const Campaign = ({ apiResponse }: { apiResponse: ApiResponse }) => {
  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700";
  const tbodyStyle = "px-6 py-4 border-b border-gray-200";
  const router = useRouter();
  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "new_campaign") {
      router.push("campaign/new");
    }
  };

  useEffect(() => {
    console.log("Received API Response:", apiResponse);
  }, [apiResponse]);
  // Ensure apiResponse is an array before mapping

  const campaigns = Array.isArray(apiResponse) ? apiResponse : [];
  return (
    <DashboardContainer title={"캠페인"} onclick={handleButton} onclickText="새 캠페인 생성" buttonId="new_campaign">
      <div className="wrapper-container">
        <div className="contents-container w-full justify-center">
          <ContentsContainer variant="dashboard">
            <CampaignList
              theadStyle={theadStyle}
              tbodyStyle={tbodyStyle}
              apiResponse={apiResponse}
              handleButton={handleButton}
            ></CampaignList>
          </ContentsContainer>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Campaign;
