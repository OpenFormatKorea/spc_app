import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { withAuth } from "@/hoc/withAuth";
import {
  fetchHourlySignUpGraph,
  fetchMyFunnelGraph,
  fetchReferralLeaderboardTable,
  fetchSignUpGraph,
} from "@/lib/campaign/reportapis";
import {
  HourlySignups,
  myFunnelResponse,
  referralLeaderboardTableResponse,
  SignUpResponse,
} from "@/lib/campaign/reporttypes";
import CampaignReport from "@/components/layout/campaign/stats/CampaignReport";
import { sortDirection } from "@/lib/campaign/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const end_date = yesterday.toISOString().split("T")[0];
    const start_date = new Date(yesterday.setDate(yesterday.getDate() - 30))
      .toISOString()
      .split("T")[0];
    const page_size = "10";
    const page = "1";
    const sort_field = "total_signup_count";
    const sort_direction = sortDirection.D;
    const user_id = "";
    const signUpApiResponse = await fetchSignUpGraph(
      start_date,
      end_date,
      context,
    );
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
    const RefferralLeaderBoardTableResponse =
      await fetchReferralLeaderboardTable(
        start_date,
        end_date,
        page,
        page_size,
        sort_field,
        sort_direction,
        user_id,
        context,
      );
    // Ensure the response is serializable
    return {
      props: {
        signUpApiResponse,
        hourlysignUpApiResponse,
        myFunnelApiResponse,
        RefferralLeaderBoardTableResponse,
        start_date,
        end_date,
        page,
        page_size,
        sort_field,
        sort_direction,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        error: "Failed to fetch data",
      },
    };
  }
};
const ReportCampaign = (
  {
    signUpApiResponse,
    hourlysignUpApiResponse,
    myFunnelApiResponse,
    RefferralLeaderBoardTableResponse,
    start_date,
    end_date,
    page,
    page_size,
    sort_field,
  }: {
    signUpApiResponse: SignUpResponse[];
    hourlysignUpApiResponse: HourlySignups;
    myFunnelApiResponse: myFunnelResponse;
    RefferralLeaderBoardTableResponse: referralLeaderboardTableResponse;
    start_date: string;
    end_date: string;
    page: string;
    page_size: string;
    sort_field: "total_signup_count" | "total_order_count";
  },
  context: GetServerSidePropsContext,
) => {
  const [newSignUpApiResponse, setNewSignUpApiResponse] =
    useState<SignUpResponse[]>(signUpApiResponse);
  const [newHourlysignUpApiResponse, setNewHourlySignUpApiResponse] =
    useState<HourlySignups>(hourlysignUpApiResponse);
  const [newMyFunnelApiResponse, setNewMyFunnelApiResponse] =
    useState<myFunnelResponse>(myFunnelApiResponse);
  const [
    newRefferralLeaderBoardTableResponse,
    setNewRefferralLeaderBoardTableResponse,
  ] = useState<referralLeaderboardTableResponse>(
    RefferralLeaderBoardTableResponse,
  );
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(start_date);
  const endDate = end_date;
  const [period, setPeriod] = useState("30");
  const [pageNum, setPageNum] = useState(page);
  const [direction, setDirection] = useState<sortDirection>(sortDirection.D);
  const [sortField, setSortField] = useState<
    "total_signup_count" | "total_order_count"
  >(sort_field);

  const fetchPeriodData = async (newPeriod: string) => {
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
      const signUpApiResponse = await fetchSignUpGraph(
        formattedStartDate,
        end_date,
        context,
      );
      const hourlysignUpApiResponse = await fetchHourlySignUpGraph(
        formattedStartDate,
        end_date,
        context,
      );
      const myFunnelApiResponse = await fetchMyFunnelGraph(
        formattedStartDate,
        end_date,
        context,
      );
      const referralLeaderboardTableResponse =
        await fetchReferralLeaderboardTable(
          formattedStartDate,
          end_date,
          page,
          page_size,
          sort_field,
          "desc",
          "",
          context,
        );
      setNewSignUpApiResponse(signUpApiResponse);
      setNewHourlySignUpApiResponse(hourlysignUpApiResponse);
      setNewMyFunnelApiResponse(myFunnelApiResponse);
      setNewRefferralLeaderBoardTableResponse(referralLeaderboardTableResponse);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSortData = async () => {
    setPageNum("1");
    setLoading(true);
    try {
      const referralLeaderboardTableResponse =
        await fetchReferralLeaderboardTable(
          start_date,
          end_date,
          pageNum,
          page_size,
          sort_field,
          direction,
          userId,
          context,
        );

      setNewRefferralLeaderBoardTableResponse(referralLeaderboardTableResponse);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodData(period);
  }, [period]);

  useEffect(() => {
    fetchSortData();
  }, [direction]);
  return (
    <>
      <DashboardContainer>
        <div className="mb-[8px] flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <span className="text-[24px] font-bold">캠페인 상세 리포트</span>
          </div>
        </div>

        <ContentsContainer variant="dashboard" size="full">
          <CampaignReport
            signUpApiResponse={newSignUpApiResponse}
            hourlysignUpApiResponse={newHourlysignUpApiResponse}
            myFunnelApiResponse={newMyFunnelApiResponse}
            RefferralLeaderBoardTableResponse={
              newRefferralLeaderBoardTableResponse
            }
            setNewRefferralLeaderBoardTableResponse={
              setNewRefferralLeaderBoardTableResponse
            }
            startDate={startDate}
            endDate={endDate}
            pageNum={pageNum}
            setPageNum={setPageNum}
            pageSize={page_size}
            direction={direction}
            setDirection={setDirection}
            sortField={sortField}
            setSortField={setSortField}
            period={period}
            setPeriod={setPeriod}
            userId={userId}
            setUserId={setUserId}
          />
        </ContentsContainer>
      </DashboardContainer>
    </>
  );
};

export default withAuth(ReportCampaign);
