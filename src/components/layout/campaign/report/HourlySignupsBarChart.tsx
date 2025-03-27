import React from "react";
import dynamic from "next/dynamic";
import { CardActions, Tooltip } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { CircularProgress } from "@mui/material";
import { HourlySignups } from "@/lib/campaign/reporttypes";
const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  {
    ssr: false,
  },
);
interface HourlySignupsBarChartProps {
  data: HourlySignups;
  isLoading: boolean;
}
const HourlySignupsBarChart = ({
  data,
  isLoading,
}: HourlySignupsBarChartProps) => {
  const barChartNewData: HourlySignups = data;
  const handleDownload = () => {
    const csvData = Object.entries(barChartNewData)
      .map(
        ([hour, { signup_count, new_user_count }]) =>
          `${hour},${signup_count},${new_user_count}`,
      )
      .join("\n");
    console.log("csvData", csvData);
    const csvHeader = "시간,유저_유입,신규가입자\n";
    const BOM = "\uFEFF";
    const csvContent = BOM + csvHeader + csvData;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "시간 별 유입자 수.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDefaultData = () => {
    return Array.from({ length: 24 }, (v, i) => ({
      hour_of_day: i,
      signup_count: 0,
      new_user_count: 0,
    }));
  };

  const chartData = Object.entries(barChartNewData || {}).map(
    ([hour, { signup_count, new_user_count }]) => {
      const adjustedSignUpCount = Math.max(
        Number(signup_count) - Number(new_user_count),
        0,
      );
      return {
        hour_of_day: hour.toString(),
        signup_count: adjustedSignUpCount,
        new_user_count: Number(new_user_count),
      };
    },
  );
  // Calculate max Y value from your chartData
  const maxY = Math.max(
    ...chartData.flatMap((d) => [d.signup_count, d.new_user_count]),
  );
  const maxTick = Math.ceil(maxY);
  const tickValues = Array.from({ length: maxTick + 1 }, (_, i) => i); // [0, 1, 2, ...]
  // console.log("barChartNewData", barChartNewData);
  // console.log("chartData", chartData);
  return (
    <>
      <div className="h-full w-full rounded-2xl bg-white p-[16px]">
        <div className="flex flex-row justify-between">
          <p className="text-[20px] font-semibold text-[#6c757d]">
            시간 별 유입자 수
          </p>
          <Tooltip title="CSV로 다운받기" className="w-fit">
            <CardActions>
              <FileDownloadOutlinedIcon
                onClick={handleDownload}
                sx={{
                  width: "25px",
                  "&:active": {
                    transform: "scale(0.75)",
                  },
                  "&:hover": {
                    // borderColor: 'rgba(255,240,10,0.8)',
                    color: "primary.light",
                    // transform: 'scale(1.1)',
                  },
                  transition: "transform 0.2s",
                  color: "primary.main",
                }}
              />
            </CardActions>
          </Tooltip>
        </div>
        <div className="relative h-full w-full">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
              <CircularProgress />
            </div>
          )}
          {data && (
            <>
              <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-xl">
                <div className="h-[350px] w-full">
                  <ResponsiveBar
                    data={chartData}
                    keys={["signup_count", "new_user_count"]}
                    indexBy="hour_of_day"
                    margin={{ top: 20, right: 20, bottom: 100, left: 60 }}
                    padding={0.3}
                    colors={["rgb(46, 134, 193)", "rgb(80, 200, 120)"]}
                    defs={[
                      {
                        id: "dots",
                        type: "patternDots",
                        background: "inherit",
                        color: "#38bcb2",
                        size: 4,
                        padding: 1,
                        stagger: true,
                      },
                      {
                        id: "lines",
                        type: "patternLines",
                        background: "inherit",
                        color: "#eed312",
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10,
                      },
                    ]}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 2,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "시각",
                      legendPosition: "middle",
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "유입 이용자 수",
                      legendPosition: "middle",
                      legendOffset: -40,
                      tickValues,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor="#ffffff"
                    animate={true}
                    gridYValues={tickValues}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HourlySignupsBarChart;
