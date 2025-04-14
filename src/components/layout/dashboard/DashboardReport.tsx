import React, { useEffect, useState } from "react";
import { HourlySignups, myFunnelResponse } from "@/lib/campaign/reporttypes";
import HourlySignupsBarChart from "@/components/layout/campaign/report/HourlySignupsBarChart";
import MyFunnelChart from "@/components/layout/campaign/report/MyfunnelChart";
import router from "next/router";

interface DashboardReportProps {
  hourlysignUpApiResponse: HourlySignups;
  myFunnelApiResponse: myFunnelResponse;
  startDate: string;
  endDate: string;
}

const DashboardReport: React.FC<DashboardReportProps> = ({
  startDate,
  endDate,
  hourlysignUpApiResponse,
  myFunnelApiResponse,
}) => {
  const [hourlyLoading, setHourlyLoading] = useState(true);
  const [funnelLoading, setFunnelLoading] = useState(true);
  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget.id === "more_campaign") {
      router.push("/campaign/report");
    }
  };

  useEffect(() => {
    if (
      hourlysignUpApiResponse &&
      Object.keys(hourlysignUpApiResponse).length > 0
    ) {
      setHourlyLoading(false);
    }
    if (myFunnelApiResponse && Object.keys(myFunnelApiResponse).length > 0) {
      setFunnelLoading(false);
    }
  }, [hourlysignUpApiResponse]);

  return (
    <>
      <div className="mb-[10px] flex w-full justify-between border-b-[1px]">
        <div className="w-[80%]">
          <div className="text-[25px] font-bold">
            최근 30일 간의 리포트 내역입니다.
          </div>{" "}
          <div className="itmes-end flex h-fit w-fit justify-end gap-[10px] text-gray-500">
            {/* <label className="h-fit text-[18px] font-semibold"></label> */}
            <label className="h-fit text-[14px]">
              ( 시작일: {startDate} 종료일: {endDate} )
            </label>
          </div>
        </div>
        <div>
          <div className="flex h-full w-[50px] items-center justify-center text-center text-[14px] font-normal text-gray-500">
            <div
              id="more_campaign"
              className="w-[50px] cursor-pointer text-right text-[14px] text-blue-400"
              onClick={handleButton}
            >
              더보기
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[400px] w-full gap-[20px] overflow-y-hidden">
        <div className="flex h-[400px] w-1/2 rounded-md border border-gray-200">
          <MyFunnelChart data={myFunnelApiResponse} isLoading={funnelLoading} />
        </div>
        <div className="flex h-[400px] w-1/2 rounded-md border border-gray-200">
          <HourlySignupsBarChart
            data={hourlysignUpApiResponse}
            isLoading={hourlyLoading}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardReport;
