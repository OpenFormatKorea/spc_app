import React, { useEffect, useMemo, useRef, useState } from "react";
import CampaignTable from "@/components/layout/campaign/stats/CampaignTable";
import { StatsApiResponse, StatsList } from "@/lib/types";
import { fetchGetCampaignStats } from "@/lib/campaign/apis";
import { GetServerSidePropsContext } from "next";
import { useScrollPosition } from "@/lib/infinitescrollFunctions";

interface CampaignStatsProps {
  startDate: string;
  endDate: string;
  pageSize: string;
  pageNum: string;
  period: string;
  setPageNum: React.Dispatch<React.SetStateAction<string>>;
  setPeriod: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  apiResponse: StatsApiResponse;
}

const CampaignStats: React.FC<CampaignStatsProps> = (
  {
    startDate,
    endDate,
    pageSize,
    pageNum,
    period,
    setPageNum,
    setPeriod,
    setLoading,
    apiResponse,
  },
  context: GetServerSidePropsContext,
) => {
  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words text-center";

  const [campaigns, setCampaigns] = useState<StatsList[]>(
    apiResponse?.result ?? [],
  );

  // 무한 스크롤
  const { isBottom, scrollRef } = useScrollPosition(true);
  const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
  const [totalCount, setTotalCount] = useState(apiResponse.total_count || 0);
  const getNextPage = totalCount > stackedDataAmount;
  const [isLoading, setIsLoading] = useState(false);
  const fetchNextPage = async () => {
    console.log("totalCount", totalCount);
    console.log("stackedDataAmount", stackedDataAmount);
    console.log("getNextPage", getNextPage);
    console.log("isLoading", isLoading);
    if (!getNextPage || !scrollRef.current || isLoading) return;
    setIsLoading(true); // Track page-specific loading state
    const nextPage = (parseInt(pageNum) + 1).toString(); // Calculate next page number
    try {
      const response = await fetchGetCampaignStats(
        startDate,
        endDate,
        nextPage,
        pageSize,
        context,
      );
      if (response?.result) {
        setCampaigns((prev) => [...prev, ...response.result]);
        setPageNum(nextPage); // Immediately update pageNum to prevent race conditions
      }
    } catch (error) {
      console.error("Failed to fetch campaign stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isBottom) {
      fetchNextPage();
    }
  }, [isBottom]);

  useEffect(() => {
    setPageNum("1");
    setCampaigns([]);
    setLoading(true);
    const fetchNewData = async () => {
      try {
        const response = await fetchGetCampaignStats(
          startDate,
          endDate,
          "1",
          pageSize,
          context,
        );
        setCampaigns(response?.result || []);
        setTotalCount(response?.total_count || 0);
      } catch (error) {
        console.error("Error fetching new campaign stats:", error);
      } finally {
        console.log("camapigns", campaigns);
        setLoading(false);
      }
    };
    fetchNewData();
  }, [startDate]);

  return (
    <div style={{ maxHeight: "70vh" }}>
      <div className="mb-2 w-full pb-2">
        <div className="mb-2 flex w-full items-center border-b-[1px] pb-2">
          <div className="w-[80%]">
            <div className="text-xl">캠페인 통계</div>
            <div className="text-sm font-normal text-gray-500">
              현재 사용중인 캠페인 통계 내역이에요.
            </div>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        id="tableDiv"
        className="h-full max-h-[calc(100%-100px)] w-full overflow-y-auto overflow-x-hidden py-2"
      >
        <table className="h-full w-full border border-gray-100 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className={theadStyle}>캠페인 타입</th>
              <th className={theadStyle}>캠페인 명</th>
              <th className={theadStyle}>시작일</th>
              <th className={theadStyle}>종료일</th>
              <th className={theadStyle}>공유버튼 클릭 수</th>
              <th className={theadStyle}>카카오 공유 수</th>
              <th className={theadStyle}>친구추천 수락 수</th>
              <th className={theadStyle}>신규 가입자수</th>
              <th className={theadStyle}>주문완료 수</th>
            </tr>
          </thead>
          <tbody>
            <CampaignTable tbodyStyle={tbodyStyle} campaigns={campaigns} />
            {getNextPage ? (
              <tr>
                <td colSpan={9} className="py-4 text-center">
                  스크롤하면 더 많은 캠페인 통계를 보실 수 있습니다.
                </td>
              </tr>
            ) : (
              <></>
            )}
          </tbody>
        </table>
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

export default CampaignStats;
