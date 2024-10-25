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
            <span className="text-2xl font-bold">대시보드</span>
          </div>
        </div>
        <div className="contents-container w-full justify-center">
          <ContentsContainer variant="dashboard">
            <div className="DashboardTop mb-2">
              <div className="mb-2 text-2xl font-semibold">
                test22님, 환영합니다.
              </div>
              <div className="w-full text-end text-xs text-gray-400">
                2024년 10월 24일 오전 10:10 기준
              </div>
            </div>
            <div className="h-fit flex-col items-center justify-center rounded-xl border bg-gray-50 px-6 pb-6 pt-3">
              <div className="mb-2 text-xl font-semibold text-gray-500">
                Summary
              </div>
              <div className="flex gap-6">
                <div className="h-[175px] w-[25%] rounded-xl border bg-white p-6">
                  <div className="mb-10 text-xl font-semibold">예제제목</div>
                  <div className="mb-10 w-full text-end text-4xl">
                    {(131222111).toLocaleString()} 원{" "}
                  </div>
                </div>
                <div className="h-[175px] w-[25%] rounded-xl border bg-white p-6">
                  <div className="mb-10 text-xl font-semibold">예제제목</div>
                  <div className="mb-10 w-full text-end text-4xl">
                    {(131222111).toLocaleString()} 원
                  </div>
                </div>
                <div className="h-[175px] w-[25%] rounded-xl border bg-white p-6">
                  <div className="mb-10 text-xl font-semibold">예제제목</div>
                  <div className="mb-10 w-full text-end text-4xl">
                    {(131222111).toLocaleString()} 원{" "}
                  </div>
                </div>
                <div className="h-[175px] w-[25%] rounded-xl border bg-white p-6">
                  <div className="mb-10 text-xl font-semibold">예제제목</div>
                  <div className="mb-10 w-full text-end text-4xl">
                    {(131222111).toLocaleString()} 원{" "}
                  </div>
                </div>
              </div>
            </div>
          </ContentsContainer>
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
