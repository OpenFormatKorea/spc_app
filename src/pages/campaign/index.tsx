import CampaignList from "@/components/layout/campaign/CampaignList";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { ApiResponse } from "@/lib/types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { getShopIdFromCookies } from "@/lib/helper";
import { fetchGetCampaignList } from "@/lib/campaign/apis";
import AddIcon from "@mui/icons-material/Add";
import { getCookie } from "cookies-next";

// Fetches campaign data during server-side rendering
export const getServerSideProps: GetServerSideProps = async (context) => {
  const shop_id = getShopIdFromCookies(context);
  const response = await fetchGetCampaignList(context);
  if (!shop_id) {
    return {
      redirect: {
        destination: "auth/login",
        permanent: false,
      },
    };
  }
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
    <DashboardContainer>
      <div className="flex w-full justify-between items-center mb-3 h-[42px]">
        <div className="subject-container flex w-full">
          <a className="text-2xl font-bold">캠페인</a>
        </div>
      </div>
      <div className="wrapper-container">
        <div className="contents-container w-full justify-center lg:space-x-4 sm:space-y-4">
          <ContentsContainer variant="dashboard">
            <CampaignList
              theadStyle={theadStyle}
              tbodyStyle={tbodyStyle}
              apiResponse={apiResponse}
              handleButton={handleButton}
            />
            <div className="button-container w-full flex lg:justify-end py-3">
              <button
                className="border p-2 w-full lg:w-fit text-white rounded-lg cursor-pointer flex items-center justify-center bg-blue-500"
                onClick={handleButton}
                id="new_campaign"
              >
                <div className="pr-2 flex items-center">
                  <AddIcon fontSize="small" />
                </div>
                새 캠페인
              </button>
            </div>
          </ContentsContainer>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Campaign;
