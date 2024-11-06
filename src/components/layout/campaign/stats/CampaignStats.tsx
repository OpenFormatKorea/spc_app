import React, { useEffect, useRef, useState } from "react";
import CampaignTable from "@/components/layout/campaign/stats/CampaignTable";
import { StatsApiResponse, StatsList } from "@/lib/types";

interface CampaignStatsProps {
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: StatsApiResponse;
  fetchCampaignStats: (
    start: string,
    end: string,
    pageSize: string,
    pageNum: string,
  ) => Promise<StatsApiResponse>;
  pageNum: string;
  setPageNum: React.Dispatch<React.SetStateAction<string>>;
  startDate: string;
  endDate: string;
  pageSize: string;
}

const CampaignStats: React.FC<CampaignStatsProps> = ({
  theadStyle,
  tbodyStyle,
  apiResponse,
  fetchCampaignStats,
  pageNum,
  setPageNum,
  startDate,
  endDate,
  pageSize,
}) => {
  const [campaigns, setCampaigns] = useState<StatsList[]>(
    apiResponse?.result ?? [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const loader = useRef<HTMLTableRowElement | null>(null);

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     if (entries[0].isIntersecting && !isLoading) {
  //       const nextPage = (parseInt(pageNum) + 1).toString();

  //       fetchCampaignStats(startDate, endDate, pageSize, 1).then((newData) => {
  //         setCampaigns((prev) => [...prev, ...(newData.result || [])]);
  //         setPageNum(nextPage);
  //       });
  //     }
  //   });

  //   if (loader.current) observer.observe(loader.current);

  //   return () => {
  //     if (loader.current) {
  //       observer.unobserve(loader.current);
  //     }
  //   };
  // }, [pageNum, fetchCampaignStats, setPageNum]);

  return (
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
          <tr ref={loader}>
            <td colSpan={9} className="py-4 text-center">
              {/* {isLoading
                ? "Loading more campaigns..."
                : "Scroll down to load more"} */}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CampaignStats;
