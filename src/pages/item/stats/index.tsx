import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { withAuth } from "@/hoc/withAuth";
import { ApiResponse } from "@/lib/types";
import { fetchGetItemStats } from "@/lib/item/apis";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemStats from "@/components/layout/item/item/ItemStats";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const campaign_id = context.query.campaign_id?.toString() || "";

  const today: Date = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const thirtyDaysBefore: Date = new Date(today);
  thirtyDaysBefore.setDate(today.getDate() - 30);
  const thirtyDaysBeforeStr = `${thirtyDaysBefore.getFullYear()}-${String(thirtyDaysBefore.getMonth() + 1).padStart(2, "0")}-${String(thirtyDaysBefore.getDate()).padStart(2, "0")}`;

  const page = 1;
  const page_size = 10;
  const apiResponse = await fetchGetItemStats(
    thirtyDaysBeforeStr,
    todayStr,
    page,
    page_size,
    campaign_id,
    context,
  );
  return {
    props: {
      apiResponse,
      campaign_id,
    },
  };
};
const StatsItem = (
  {
    apiResponse,
    campaign_id,
  }: { apiResponse: ApiResponse; campaign_id: string },
  context: GetServerSidePropsContext,
) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";

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
            <span className="text-2xl font-bold">아이템 지표</span>
          </div>
          {/* 
          <div className="button-container flex w-full justify-end">
            <ArrowBackIosIcon fontSize="small" />
            <span className="hidden lg:ml-1 lg:block">뒤로가기</span>
          </div> */}
        </div>
        <ContentsContainer variant="dashboard">
          <ItemStats
            theadStyle={theadStyle}
            tbodyStyle={tbodyStyle}
            apiResponse={apiResponse}
            campaign_id={campaign_id}
          />
        </ContentsContainer>
      </DashboardContainer>
    </>
  );
};

export default withAuth(StatsItem);
