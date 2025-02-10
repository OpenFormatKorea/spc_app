import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { withAuth } from "@/hoc/withAuth";
import { StatsApiResponse } from "@/lib/types";
import { fetchGetItemStats } from "@/lib/item/apis";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemStats from "@/components/layout/item/item/stats/ItemStats";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const campaign_id = context.query.campaign_id?.toString() || "";
  const today = new Date();
  const end_date = today.toISOString().split("T")[0];
  const start_date = new Date(today.setDate(today.getDate() - 30))
    .toISOString()
    .split("T")[0];

  const apiResponse = await fetchGetItemStats(
    start_date,
    end_date,
    "1",
    "25",
    campaign_id,
    context,
  );

  if (!apiResponse) {
    return {
      redirect: {
        destination: "/campaign/stats",
        permanent: false,
      },
    };
  }

  return {
    props: {
      apiResponse,
      campaign_id,
      start_date,
      end_date,
      page: "1",
      page_size: "25",
    },
  };
};

const StatsItem = (
  {
    apiResponse,
    campaign_id,
    start_date,
    end_date,
    page,
    page_size,
  }: {
    apiResponse: StatsApiResponse;
    campaign_id: string;
    start_date: string;
    end_date: string;
    page: string;
    page_size: string;
  },
  context: GetServerSidePropsContext,
) => {
  const [newApiResponse, setNewApiResponse] =
    useState<StatsApiResponse>(apiResponse);
  const [period, setPeriod] = useState("30");
  const [startDate, setStartDate] = useState(start_date);
  const endDate = end_date;
  const [pageNum, setPageNum] = useState(page);
  const [loading, setLoading] = useState(false);
  const pageSize = page_size;

  const fetchData = async (newPeriod: string) => {
    const newStartDate = new Date();
    newStartDate.setDate(newStartDate.getDate() - Number(newPeriod));

    const year = newStartDate.getFullYear();
    const month = String(newStartDate.getMonth() + 1).padStart(2, "0");
    const day = String(newStartDate.getDate()).padStart(2, "0");

    const formattedStartDate = `${year}-${month}-${day}`;
    setStartDate(formattedStartDate);
    setPageNum("1");
    setLoading(true);
    try {
      const data = await fetchGetItemStats(
        formattedStartDate,
        endDate,
        pageNum,
        pageSize,
        campaign_id,
        context,
      );
      setNewApiResponse(data);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words text-center";

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
            <span className="text-2xl font-bold">아이템 지표</span>
          </div>
        </div>
        <ContentsContainer variant="dashboard">
          <ItemStats
            theadStyle={theadStyle}
            tbodyStyle={tbodyStyle}
            apiResponse={newApiResponse}
            campaign_id={campaign_id}
            pageNum={pageNum}
            setPageNum={setPageNum}
            startDate={startDate}
            endDate={endDate}
            pageSize={pageSize}
            period={period}
            setLoading={setLoading}
            setPeriod={setPeriod}
          />
        </ContentsContainer>
      </DashboardContainer>
    </>
  );
};

export default withAuth(StatsItem);
