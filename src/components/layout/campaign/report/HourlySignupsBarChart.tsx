import React from "react";
import dynamic from "next/dynamic";
import { CardActions, Tooltip } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { CircularProgress } from "@mui/material";
import { HourlySignups, ReportResponse } from "@/lib/campaign/reporttypes";
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
  const barChartData: HourlySignups = data;
  const handleDownload = () => {
    const csvData = Object.entries(barChartData)
      .map(([hour, signup_count]) => `${hour},${signup_count}`)
      .join("\n");
    const csvHeader = "hour_of_day,signup_count\n";
    const csvContent = csvHeader + csvData;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "시간 별 가입자 수.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDefaultData = () => {
    return Array.from({ length: 24 }, (v, i) => ({
      hour_of_day: i,
      signup_count: 0,
    }));
  };

  const chartData = Object.entries(barChartData || {}).map(
    ([hour, signup_count]) => ({
      hour_of_day: hour.toString(),
      signup_count: Number(signup_count),
    }),
  );

  return (
    <>
      <div className="h-full w-full rounded-2xl bg-white p-[16px]">
        <div className="flex flex-row justify-between">
          <p className="text-[20px] font-semibold text-[#6c757d]">
            시간 별 가입자 수
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
                    keys={["signup_count"]}
                    indexBy="hour_of_day"
                    margin={{ top: 20, right: 20, bottom: 100, left: 60 }}
                    padding={0.3}
                    colors={["rgb(15, 116, 237)"]}
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
                      legend: "시간",
                      legendPosition: "middle",
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "가입자",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                      from: "color",
                      modifiers: [["brighter", 2.6]],
                    }}
                    animate={true}
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
