// This line graph named "날짜 별 가입자 수" shows daily kakao message share and sign up stats.

import { generateLabels } from "@/lib/campaign/charts";
import { SignUpResponse } from "@/lib/campaign/reporttypes";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Tooltip, CardActions, CircularProgress } from "@mui/material";
import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Legend,
);
export default function ReferralHistoryChart({
  report,
  isLoading,
  start_date,
  end_date,
}: {
  report: SignUpResponse[];
  isLoading?: boolean;
  start_date: string;
  end_date: string;
}) {
  if (!report || !report) {
    return <p>No data available</p>;
  }

  const graphData: SignUpResponse[] = report || [
    {
      date: "",
      share_count: 0,
      signup_count: 0,
    },
  ];
  const shareCountArray = graphData.map(
    (item: SignUpResponse) => item.share_count,
  );
  const signUpArray = graphData.map(
    (item: SignUpResponse) => item.signup_count,
  );

  function prepareMessageSharesData() {
    const today = new Date();
    const startDate = start_date ? new Date(start_date) : new Date(today);
    const endDate = end_date ? new Date(end_date) : new Date(today);
    const labels = generateLabels(startDate, endDate);

    return {
      labels,
      datasets: [
        {
          label: "카톡 추천 횟수",
          data: shareCountArray,
          borderColor: "rgb(15, 116, 237)", // Line color
          backgroundColor: "rgb(15, 116, 237)", // Fill color under the line
          borderWidth: 1.5, //line width
          pointStyle: "circle",
          pointRadius: 2.5,
          pointBorderColor: "rgba(30, 144, 255, 1)",
          pointBackgroundColor: "rgb(15, 116, 237",
        },
        {
          label: "추천 통해 가입",
          data: signUpArray,
          borderColor: "rgb(248, 113, 113)",
          borderWidth: 1.5,
          backgroundColor: "rgb(248, 113, 113)",
          pointRadius: 2.5,
          pointBorderColor: "rgb(248, 113, 113)",
          pointBackgroundColor: "rgb(248, 113, 113)", //point fill color
        },
      ],
    };
  }
  // Handle CSV Download
  const handleDownload = () => {
    const chartData = prepareMessageSharesData();
    const csvHeader = "Date,Kakao messages sent,가입\n";
    const csvRows = chartData.labels
      .map((label, index) => {
        return `${label},${chartData.datasets[0].data[index]},${chartData.datasets[1].data[index]}`;
      })
      .join("\n");

    const BOM = "\uFEFF";
    const csvContent = BOM + csvHeader + "\n" + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "날짜 별 가입자 수.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full w-full rounded-2xl bg-white p-[16px]">
      <div className="flex flex-row justify-between">
        <p className="text-[20px] font-semibold text-[#6c757d]">
          날짜 별 가입자 수
        </p>
        <Tooltip title="CSV로 다운받기">
          <CardActions>
            <FileDownloadOutlinedIcon
              onClick={handleDownload}
              sx={{
                width: "25px",
                "&:active": {
                  transform: "scale(0.75)",
                },
                "&:hover": {
                  color: "primary.light",
                },
                transition: "transform 0.2s",
                color: "primary.main",
              }}
            />
          </CardActions>
        </Tooltip>
      </div>

      <div className="relative h-full w-full">
        {/* Loading State */}
        {(isLoading || !report) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
            <CircularProgress />
          </div>
        )}
        {/* Chart */}
        {report && (
          <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-xl">
            <div className="h-[320px] w-full p-[10px]">
              <Line options={lineOptions()} data={prepareMessageSharesData()} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function lineOptions() {
  return {
    indexAxis: "x" as const,
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to stretch and shrink as needed

    plugins: {
      title: {
        display: false,
        color: "#4A4A4A",
        text: "추천 활동 고객 수",
        position: "top" as const,
        align: "center" as const,
        font: {
          size: 18,
          weight: "bold" as "bold", // Ensure proper weight type
        },
      },
      legend: {
        display: true,
        labels: {
          color: "#888",
          font: {
            size: 15,
          },
        },
        position: "top" as const,
        align: "end" as const,
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#f5f5f5",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "#dadada",
        borderWidth: 1,
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 12,
          weight: "bold" as "bold",
        },
        cornerRadius: 4,
        mode: "index" as const,
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        grid: {
          display: true,
          color: "#EAEAEA",
        },
        min: 0, // Ensure it's a number
        ticks: {
          beginAtZero: true,
          callback: function (tickValue: string | number) {
            if (typeof tickValue === "number" && tickValue % 1 === 0) {
              return tickValue;
            }
            return null;
          },
        },
      },
      x: {
        type: "category" as const,
        grid: {
          display: false,
        },
        ticks: {
          color: "#9E9E9E",
        },
      },
    },
  };
}
