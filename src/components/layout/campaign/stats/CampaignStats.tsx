import React, { useEffect, useMemo, useRef, useState } from "react";
import CampaignTable from "@/components/layout/campaign/stats/CampaignTable";
import { StatsApiResponse, StatsList } from "@/lib/types";

interface CampaignStatsProps {
  theadStyle: string;
  tbodyStyle: string;
  startDate: string;
  endDate: string;
  pageSize: string;
  pageNum: string;
  setPageNum: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  apiResponse: StatsApiResponse;
  fetchCampaignStats: (
    start: string,
    end: string,
    pageSize: string,
    pageNum: string,
  ) => Promise<StatsApiResponse>;
}

const CampaignStats: React.FC<CampaignStatsProps> = ({
  theadStyle,
  tbodyStyle,
  startDate,
  endDate,
  pageSize,
  pageNum,
  setPageNum,
  setLoading,
  apiResponse,
  fetchCampaignStats,
}) => {
  const [campaigns, setCampaigns] = useState<StatsList[]>(
    apiResponse?.result ?? [],
  );

  const useScrollPosition = (elementId: string) => {
    const [isBottom, setIsBottom] = useState(false);
    useEffect(() => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const handleScroll = () => {
        const isAtBottom =
          element.scrollTop + element.clientHeight >= element.scrollHeight;
        setIsBottom(isAtBottom);
      };

      const viewportHeight = window.innerHeight;
      const elementHeight = element.scrollHeight;
      console.log("viewportHeight", viewportHeight);
      console.log("elementHeight", elementHeight);
      if (elementHeight <= viewportHeight) {
        setIsBottom(true);
      } else {
        element.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
          element.removeEventListener("scroll", handleScroll);
        };
      }
    }, []);

    return isBottom;
  };
  const scrollPosition = useScrollPosition("tableDiv");
  const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
  const totalCount = apiResponse.total_count || 0;
  const getNextPage = () => {
    if (totalCount >= stackedDataAmount) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const isNextPage = getNextPage();
    const nextPageNum = (parseInt(pageNum) + 1).toString();

    if (isNextPage && scrollPosition) {
      setLoading(true);
      try {
        fetchCampaignStats(startDate, endDate, pageSize, "1").then(
          (newData) => {
            setCampaigns((prev) => [...prev, ...(newData.result || [])]);
            setPageNum(nextPageNum);
          },
        );
      } finally {
        setLoading(false);
      }
    }
  }, [scrollPosition]);

  return (
    <div
      id="tableDiv"
      className="overflow-y-auto"
      style={{ maxHeight: "80vh" }}
    >
      {" "}
      <div className="mb-2 w-full pb-2">
        <div className="mb-2 flex w-full items-center border-b-[1px] pb-2">
          <div className="w-[80%]">
            <div className="text-xl">캠페인 통계</div>
            <div className="text-sm font-normal text-gray-500">
              현재 사용중인 아이템 통계 내역이에요.
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-2">
        <table className="w-full border border-gray-100 text-center">
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

            <tr>
              <td colSpan={9} className="py-4 text-center">
                {getNextPage()
                  ? "Scroll down to load more"
                  : "No more campaigns"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignStats;
