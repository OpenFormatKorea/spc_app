import { ApiResponse } from "@/lib/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface CampaignListProps {
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: ApiResponse;
  handleButton: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ theadStyle, tbodyStyle, apiResponse, handleButton }) => {
  const router = useRouter();
  function onlcickCampaignDetail(event: React.MouseEvent<HTMLElement>) {
    const { id } = event.currentTarget;
    router.replace(`/campaign/details?id=${id}`, undefined, { shallow: true, scroll: false });
  }
  // 더보기 버튼 표시 유무 확인
  const [isCampaignPage, setIsCampaignPage] = useState(false);
  useEffect(() => {
    setIsCampaignPage(router.pathname.includes("/campaign"));
  }, [router.pathname]);

  const campaigns = Array.isArray(apiResponse) ? apiResponse : [];

  return (
    <>
      <div className="font-bold text-xl flex w-full">
        <div className="w-[50%]">캠페인</div>
        {!isCampaignPage && (
          <div
            id="more_campaign"
            className="w-[50%] text-right text-sm pr-1 justify-center cursor-pointer text-blue-400"
            onClick={handleButton}
          >
            더보기
          </div>
        )}
      </div>
      <div>현재 사용중인 리퍼럴 목록입니다.</div>

      <div className="my-2 w-full">
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className={theadStyle}>캠페인 명</th>
              <th className={theadStyle}>타입</th>
              <th className={theadStyle}>활성화</th>
              <th className={theadStyle}>캠페인 생성일</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, i) => (
              <tr className=" cursor-pointer" key={i} id={campaign.id} onClick={onlcickCampaignDetail}>
                <td className={tbodyStyle}>{campaign.title}</td>
                <td className={tbodyStyle}>{campaign.period_type}</td>
                <td className={tbodyStyle}>{campaign.active ? "TRUE" : "FALSE"}</td>
                <td className={tbodyStyle}>
                  {campaign.start_date} ~ {campaign.end_date}
                </td>
              </tr>
            ))}
            {!campaigns.length && (
              <tr>
                <td className={tbodyStyle}></td>
                <td className={tbodyStyle}></td>
                <td className={tbodyStyle}></td>
                <td className={tbodyStyle}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default CampaignList;
