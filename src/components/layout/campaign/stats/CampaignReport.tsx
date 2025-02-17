import React, { useEffect, useState } from "react";
import { ReportResponse } from "@/lib/campaign/reporttypes";
import HourlySignupsBarChart from "@/components/layout/campaign/report/HourlySignupsBarChart";
import ReferralHistoryChart from "@/components/layout/campaign/report/ReferralHistoryChart";

interface CampaignReportProps {
  startDate: string;
  endDate: string;
  period: string;
  signUpApiResponse: ReportResponse;
  hourlysignUpApiResponse: ReportResponse;
  setPeriod: (value: string) => void;
}

const CampaignReport: React.FC<CampaignReportProps> = ({
  period,
  startDate,
  endDate,
  signUpApiResponse,
  hourlysignUpApiResponse,
  setPeriod,
}) => {
  const [shopReportLoading, setShopReportLoading] = useState(true);
  const [hourlyLoading, setHourlyLoading] = useState(true);
  useEffect(() => {
    if (
      hourlysignUpApiResponse &&
      Object.keys(hourlysignUpApiResponse).length > 0
    ) {
      setHourlyLoading(false);
    }
    if (signUpApiResponse && Object.keys(signUpApiResponse).length > 0) {
      setShopReportLoading(false);
    }
  }, [hourlysignUpApiResponse]);
  return (
    <div style={{ maxHeight: "70vh" }}>
      <div className="mb-2 w-full pb-2">
        <div className="mb-2 flex w-full items-center border-b-[1px] pb-2">
          <div className="w-[80%]">
            <div className="text-xl">캠페인 상세 리포트</div>
            <div className="text-sm font-normal text-gray-500">
              캠페인 상세 리포트입니다.
            </div>
          </div>
        </div>
      </div>
      <div className="h-full max-h-[calc(100%-80px)] w-full overflow-x-hidden overflow-y-hidden py-2">
        <div className="h-full w-full gap-[20px] rounded-lg border border-gray-100 bg-gray-100 p-[10px] text-center">
          <div className="flex w-fit flex-col items-start gap-[10px] rounded-lg bg-white p-[5px] text-gray-500">
            <div className="flex w-fit gap-[10px] rounded-lg bg-white">
              <a className="text-[20px] font-semibold">리포트 기간</a>
            </div>
            <div className="flex w-fit gap-[10px] rounded-lg bg-white text-gray-500">
              <a className="text-[12px] font-semibold">시작일: {startDate}</a>
              <a className="text-[12px] font-semibold">종료일: {endDate}</a>
            </div>
          </div>
          <div className="mt-[10px] flex h-full w-full min-w-[50%] flex-col gap-[20px] overflow-y-auto">
            <div className="flex h-full max-h-[400px] w-full min-w-[50%] gap-[20px]">
              <ReferralHistoryChart
                report={signUpApiResponse}
                isLoading={shopReportLoading}
                start_date={startDate}
                end_date={endDate}
              />
              <HourlySignupsBarChart
                data={hourlysignUpApiResponse}
                isLoading={hourlyLoading}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[12px] flex h-fit w-full">
        <div className="pageOption flex w-fit items-center justify-center rounded-lg bg-gray-100 p-2">
          <div className="flex min-w-[70px] items-center gap-2 text-left text-sm">
            <label className="font-bold">내역기간</label>
          </div>
          <select
            className="font-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="30">30일 전</option>
            <option value="60">60일 전</option>
            <option value="90">90일 전</option>
            <option value="120">120일 전</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CampaignReport;
