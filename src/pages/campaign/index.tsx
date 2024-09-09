import CampaignList from "@/components/layout/campaign/CampaignList";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { ApiResponse } from "@/lib/types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { getShopIdFromCookies } from "@/lib/helper";
import { fetchGetCampaignList } from "@/lib/campaign/apis";

// Fetches campaign data during server-side rendering
export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetchGetCampaignList(context);
  const shop_id = getShopIdFromCookies(context);

  console.log("GETSERVERSIDE API RESPONSE: ", response);
  console.log(" campaign GETSERVERSIDE API RESPONSE shop_id: ", shop_id);
  // if (!response || !shop_id) {
  //   return {
  //     redirect: {
  //       destination: "auth/login",
  //       permanent: false,
  //     },
  //   };
  // }
  return {
    props: {
      apiResponse: response,
    },
  };
};

// Campaign page component
const Campaign: React.FC<{ apiResponse: ApiResponse }> = ({ apiResponse }) => {
  const router = useRouter();

  // Table styles
  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";

  // Handle button click
  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "new_campaign") {
      router.push("campaign/new");
    }
  };

  // Ensure campaigns is an array
  const campaigns = Array.isArray(apiResponse) ? apiResponse : [];

  return (
    <DashboardContainer title="캠페인" onclick={handleButton} onclickText="새 캠페인 생성" buttonId="new_campaign">
      <div className="wrapper-container">
        <div className="contents-container w-full justify-center lg:space-x-4 sm:space-y-4">
          <ContentsContainer variant="dashboard">
            <CampaignList
              theadStyle={theadStyle}
              tbodyStyle={tbodyStyle}
              apiResponse={apiResponse}
              handleButton={handleButton}
            />
          </ContentsContainer>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Campaign;
