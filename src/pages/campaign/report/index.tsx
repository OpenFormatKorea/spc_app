import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from "react";
import { withAuth } from "@/hoc/withAuth";
import {
  fetchHourlySignUpGraph,
  fetchSignUpGraph,
} from "@/lib/campaign/reportapis";
import { ReportResponse } from "@/lib/campaign/reporttypes";
import CampaignReport from "@/components/layout/campaign/stats/CampaignReport";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const today = new Date();
    const end_date = today.toISOString().split("T")[0];
    const start_date = new Date(today.setDate(today.getDate() - 30))
      .toISOString()
      .split("T")[0];

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
    // Ensure the response is serializable
    return {
      props: {
        signUpApiResponse,
        hourlysignUpApiResponse,
        start_date,
        end_date,
      },
    };
  } catch (error) {
    console.error("Error fetching campaign report:", error);

    return {
      props: {
        signUpApiResponse: {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error", // Convert Error object to string
        },
        hourlysignUpApiResponse: {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error", // Convert Error object to string
        },
        start_date: null,
        end_date: null,
      },
    };
  }
};

const ReportCampaign = ({
  signUpApiResponse,
  hourlysignUpApiResponse,
  start_date,
  end_date,
}: {
  signUpApiResponse: ReportResponse;
  hourlysignUpApiResponse: ReportResponse;
  start_date: string;
  end_date: string;
}) => {
  const [newSignUpApiResponse, setNewSignUpApiResponse] =
    useState<ReportResponse>(signUpApiResponse);
  console.log("newSignUpApiResponse", newSignUpApiResponse);
  const [newHourlysignUpApiResponse, setNewHourlySignUpApiResponse] =
    useState<ReportResponse>(hourlysignUpApiResponse);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(start_date);
  const [endDate, setEndDate] = useState(end_date);
  const [period, setPeriod] = useState("30");

  return (
    <>
      <DashboardContainer>
        <div className="mb-[8px] flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <span className="text-2xl font-bold">캠페인 상세 리포트</span>
          </div>
        </div>

        <ContentsContainer variant="dashboard">
          <CampaignReport
            signUpApiResponse={newSignUpApiResponse}
            hourlysignUpApiResponse={newHourlysignUpApiResponse}
            startDate={startDate}
            endDate={endDate}
            period={period}
            setPeriod={setPeriod}
          />
        </ContentsContainer>
      </DashboardContainer>
    </>
  );
};

export default withAuth(ReportCampaign);
