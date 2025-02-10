import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import CampaignList from "@/components/layout/campaign/CampaignList";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import React, { useEffect, useState } from "react";
import { CampaignListApiResponse } from "@/lib/campaign/types";
import { fetchGetCampaignList } from "@/lib/campaign/apis";
import AddIcon from "@mui/icons-material/Add";
import { GetServerSideProps } from "next";
import { withAuth } from "@/hoc/withAuth";
import { useRouter } from "next/router";

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

const Campaign: React.FC<{
  apiResponse: CampaignListApiResponse;
  page: string;
  page_size: string;
}> = ({ apiResponse, page, page_size }) => {
  const [pageNum, setPageNum] = useState(page);
  const pageSize = page_size;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";
  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "new_campaign") {
      router.push("campaign/new");
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
        <div className="mb-[8px] flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <span className="text-2xl font-bold">캠페인</span>
          </div>
        </div>
        <div className="wrapper-container">
          <div className="contents-container w-full justify-center sm:space-y-4 lg:space-x-4">
            <ContentsContainer variant="dashboard">
              <CampaignList
                theadStyle={theadStyle}
                tbodyStyle={tbodyStyle}
                apiResponse={apiResponse}
                pageNum={pageNum}
                pageSize={pageSize}
                handleButton={handleButton}
                setLoading={setLoading}
                setPageNum={setPageNum}
              />
              <div className="button-container flex w-full py-3 lg:justify-end">
                <button
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-blue-500 p-2 text-white lg:w-fit"
                  onClick={handleButton}
                  id="new_campaign"
                >
                  <div className="flex items-center pr-2">
                    <AddIcon fontSize="small" />
                  </div>
                  새 캠페인
                </button>
              </div>
            </ContentsContainer>
          </div>
        </div>
      </DashboardContainer>
    </>
  );
};

export default withAuth(Campaign);
