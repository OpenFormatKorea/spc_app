import { referralLeaderboardTableResponse } from "@/lib/campaign/reporttypes";
import { sortDirection } from "@/lib/campaign/types";
import { useScrollPosition } from "@/lib/infinitescrollFunctions";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Tooltip, CardActions, CircularProgress } from "@mui/material";
import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
export default function ReferralLeaderboardTable({
  data,
  isLoading,
  direction,
  sortField,
  setDirection,
  setSortField,
}: {
  data: referralLeaderboardTableResponse;
  isLoading?: boolean;

  direction: sortDirection;
  sortField:
    | "first_time_signup_count"
    | "pickup_order_count"
    | "pre_order_count";
  setDirection: (value: sortDirection) => void;
  setSortField: (
    value: "first_time_signup_count" | "pickup_order_count" | "pre_order_count",
  ) => void;
}) {
  // Handle CSV Download
  const handleDownload = () => {
    const chartData = data || {};
    const csvHeader = "추천인 ID,가입, 총 주문 수,총 주문 금액";
    const csvRows = chartData.result
      .map((resultRow) => {
        return `${resultRow.referrer_id},${resultRow.base_user_id},${resultRow.total_order_count},${resultRow.total_signup_count}`;
      })
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "최다 가입자 유치 추천인 순위.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";
  const { isBottom, scrollRef } = useScrollPosition(true);

  return (
    <div className="h-full max-h-[400px] w-full rounded-2xl bg-white p-[16px]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col text-left">
          <p className="text-[20px] font-semibold text-[#6c757d]">
            최다 가입자 유치 추천인 순위
          </p>
          <span className="text-[12px] text-[#6c757d]">
            추천인을 통한 총 주문 건수 및 주문 금액
          </span>
        </div>
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
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
            <CircularProgress />
          </div>
        )}
        {/* Chart */}
        <div className="h-[320px] w-full p-[10px]">
          <div ref={scrollRef} className="h-full w-full overflow-y-auto py-2">
            <table className="w-full border border-gray-100 text-center lg:table">
              <thead>
                <tr className="bg-gray-100">
                  <th className={theadStyle}>
                    <div className="flex h-full w-full items-center justify-center gap-[5px]">
                      <input type="checkbox" id="all" />
                    </div>
                  </th>
                  <th className={theadStyle}>
                    <div className="flex w-full items-center justify-center gap-[5px]">
                      <span>추천인 ID</span>
                    </div>
                  </th>
                  <th className={theadStyle}>
                    <div className="flex w-full items-center justify-center gap-[5px]">
                      <span>총 주문 수</span>
                      {direction === "asc" &&
                      sortField === "pickup_order_count" ? (
                        <div
                          className="cursor-pointer font-semibold"
                          onClick={(e) => {
                            setDirection(sortDirection.D);
                            setSortField("pickup_order_count");
                          }}
                        >
                          <ArrowDropUpIcon />
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer font-semibold"
                          onClick={(e) => {
                            setDirection(sortDirection.A);
                            setSortField("pickup_order_count");
                          }}
                        >
                          <ArrowDropDownIcon />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className={theadStyle}>총 주문 금액</th>
                </tr>
              </thead>
              <tbody>
                {data.result.map((resultRow, index) => (
                  <tr className={tbodyStyle}>
                    <td>
                      <input type="checkbox" id={index.toString()} />
                    </td>
                    <td className={tbodyStyle} id={resultRow.referrer_id}>
                      {resultRow.base_user_id}
                    </td>
                    <td className={tbodyStyle}>
                      {resultRow.total_order_count}
                    </td>
                    <td className={tbodyStyle}>
                      {resultRow.total_signup_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
