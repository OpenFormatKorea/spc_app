// The margin and paddings in this component are defied to fit certain specifications.
// TODO: generalize tailwind styling.
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; //this component needs dynamic imports.
import { CircularProgress } from "@mui/material";
import {
  myFunnelCount,
  myFunnelRate,
  myFunnelResponse,
} from "@/lib/campaign/reporttypes";

const ResponsiveFunnel = dynamic(
  () => import("@nivo/funnel").then((m) => m.ResponsiveFunnel),
  {
    ssr: false,
  },
);
interface CampaignReportProps {
  data: myFunnelResponse;
  isLoading: boolean;
}
const MyFunnelChart = ({ data, isLoading }: CampaignReportProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  console.log("data", data);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth(); // Set initial width

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const isSmallScreen = windowWidth < 768;
  const marginSettings = isSmallScreen
    ? { top: 10, right: 10, bottom: 40, left: 10 }
    : { top: 20, right: 20, bottom: 80, left: 20 };

  const borderWidth = isSmallScreen ? 10 : 20;
  const currentPartSizeExtension = isSmallScreen ? 10 : 20;
  const currentBorderWidth = isSmallScreen ? 20 : 40;
  const [funnelCount, setFunnelCount] = useState<myFunnelCount>(
    data.count || {
      total_share_click_count: 0,
      total_kakao_share_count: 0,
      total_new_registration_user_count: 0,
      total_pickup_complete_count: 0,
      total_accepted_share_count: 0,
    },
  );
  const [FunnelRate, setFunnelRate] = useState<myFunnelRate>(
    data.rate || {
      share_click_to_kakao_share: 0,
      kakao_share_to_registration: 0,
      registration_to_new_user: 0,
      registration_to_pickup_complete: 0,
    },
  );

  const funnel_data = [
    {
      id: "total_share_click_count",
      value: funnelCount.total_share_click_count,
      label: "총 공유 클릭 수",
    },
    {
      id: "total_kakao_share_count",
      value: funnelCount.total_kakao_share_count,
      label: "총 카카오 공유 횟수",
    },
    // {
    //   id: "referral_attempt",
    //   value: funnelCount.total_new_registration_user_count,
    //   label: "총 회원가입 횟수",
    // },
    {
      id: "referral_attempt",
      value: funnelCount.total_new_registration_user_count,
      label: `총 가입 횟수 (신규유입: ${funnelCount.total_accepted_share_count})`,
    },
    {
      id: "total_pickup_complete_count",
      value: funnelCount.total_pickup_complete_count,
      label: "총 픽업 완료 횟수",
    },
  ];

  const registration_to_new_user_rate = (
    FunnelRate.registration_to_new_user * 100
  ).toFixed(2);
  const percentage_aggregates = [
    (FunnelRate.share_click_to_kakao_share * 100).toFixed(2),
    (FunnelRate.kakao_share_to_registration * 100).toFixed(2),
    (FunnelRate.registration_to_pickup_complete * 100).toFixed(2),
  ].filter((value) => value !== null);
  function calculatePercentages(funnelData: any) {
    const percentages = [];

    for (let i = 0; i < funnelData.length - 1; i++) {
      const currentStage = funnelData[i];
      const nextStage = funnelData[i + 1];

      const currentValue = currentStage.value || 0;
      const nextValue = nextStage.value || 0;

      const percentage =
        currentValue > 0 ? (nextValue / currentValue) * 100 : 0;

      percentages.push(percentage.toFixed(1));
    }

    return percentages;
  }
  const percentages = calculatePercentages(funnel_data);
  console.log("percentages", percentages);

  return (
    <div className="h-full max-h-[400px] w-full rounded-2xl bg-white p-[16px]">
      <div className="flex flex-col items-start justify-start">
        <p className="text-[20px] font-semibold text-[#6c757d]">
          리퍼럴 유저 고객 여정
        </p>
        <p className="py-1 text-[12px] text-[#6c757d]">
          *각 섹션 위로 마우스를 올려 보세요.
        </p>
      </div>

      <div className="flex h-full w-full">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
            <CircularProgress />
          </div>
        )}
        <div className="mt-8 flex w-[22%] flex-col text-[12px] text-[#6c757d]">
          {funnel_data.map((item, index) => (
            <p key={index} className="min-h-[19%] pt-[15%] lg:min-h-[22%]">
              {item.label}
            </p>
          ))}
        </div>
        <div className="h-[300px] w-full md:h-[380px]">
          <ResponsiveFunnel
            data={funnel_data}
            margin={marginSettings}
            spacing={isSmallScreen ? 0.5 : 1}
            borderWidth={borderWidth}
            currentPartSizeExtension={currentPartSizeExtension}
            currentBorderWidth={currentBorderWidth}
            valueFormat=" >-1,.2d"
            labelColor="black"
            colors={{ scheme: "blues" }}
            beforeSeparatorLength={0}
            beforeSeparatorOffset={20}
            afterSeparatorLength={0}
            afterSeparatorOffset={20}
            enableBeforeSeparators={true}
            enableAfterSeparators={true}
            motionConfig="wobbly"
          />
        </div>
        <div className="mt-[12px] flex w-[15%] flex-col text-[12px]">
          <p className="stext-[14px] ml-1 min-h-[17%] text-[#6c757d] lg:min-h-[19%]"></p>
          {percentages.map((stage, index) =>
            index != 1 ? (
              <p
                key={index}
                className={`ml-1 min-h-[17%] lg:min-h-[19%] ${
                  parseFloat(stage) > parseFloat(percentage_aggregates[index])
                    ? "text-green-500"
                    : parseFloat(stage) <
                        parseFloat(percentage_aggregates[index])
                      ? "text-red-500"
                      : "text-gray-500"
                }`}
              >
                {stage}%
              </p>
            ) : (
              <p
                key={1}
                className={`ml-1 min-h-[17%] lg:min-h-[19%] ${
                  parseFloat(stage) > parseFloat(percentage_aggregates[1])
                    ? "text-green-500"
                    : parseFloat(stage) <
                        parseFloat(percentage_aggregates[index])
                      ? "text-red-500"
                      : "text-gray-500"
                }`}
              >
                {stage}%
                <br /> (신규유입%: {registration_to_new_user_rate}%)
              </p>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFunnelChart;
