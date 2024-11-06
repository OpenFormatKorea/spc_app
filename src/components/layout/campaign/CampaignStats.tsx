import { ApiResponse, CamapaignStats } from "@/lib/types";
import { useRouter } from "next/router";

interface CampaignStatsProps {
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: ApiResponse;
}

const CampaignStats: React.FC<CampaignStatsProps> = ({
  theadStyle,
  tbodyStyle,
  apiResponse,
}) => {
  const router = useRouter();

  const handleCampaignClick = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    router.replace(`/item/stats?campaign_id=${id}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  // const campaigns = Array.isArray(apiResponse?.result)
  //   ? apiResponse.result
  //   : [];

  // Handle the case where apiResponse.result is null
  if (!apiResponse || !Array.isArray(apiResponse.result)) {
    return (
      <>
        <div className="mb-2 w-full pb-2">
          <div className="mb-2 flex w-full items-center border-b-[1px] pb-2">
            <div className="w-[80%]">
              <div className="text-lg font-bold">캠페인 지표</div>
              <div className="text-sm font-normal text-gray-500">
                현재 사용중인 캠페인 지표에요.
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
              <tr>
                <td className={tbodyStyle} colSpan={9}>
                  캠페인 데이터가 없어요.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }

  const campaigns = apiResponse.result;

  return (
    <>
      <div className="mb-2 w-full pb-2">
        <div className="mb-2 flex w-full items-center border-b-[1px] pb-2">
          <div className="w-[80%]">
            <div className="text-lg font-bold">캠페인 지표</div>
            <div className="text-sm font-normal text-gray-500">
              현재 사용중인 캠페인 지표에요.
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
            {campaigns.length > 0 ? (
              campaigns.map((campaign: CamapaignStats) => (
                <tr
                  className={`cursor-pointer ${
                    campaign.period_type === "UNLIMITED"
                      ? "bg-green-50"
                      : "bg-white"
                  }`}
                  key={campaign.campaign_id}
                  id={campaign.campaign_id}
                  onClick={handleCampaignClick}
                >
                  <td className={tbodyStyle}>{campaign.item_type}</td>
                  <td className={tbodyStyle}>{campaign.item_title}</td>
                  <td className={tbodyStyle}>{campaign.start_date}</td>
                  <td className={tbodyStyle}>{campaign.end_date || "N/A"}</td>
                  <td className={tbodyStyle}>
                    {campaign.share_attempts_click_count}
                  </td>
                  <td className={tbodyStyle}>
                    {campaign.kakao_message_share_count}
                  </td>
                  <td className={tbodyStyle}>{campaign.accepted_shares}</td>
                  <td className={tbodyStyle}>
                    {campaign.new_referee_user_count}
                  </td>
                  <td className={tbodyStyle}>
                    {campaign.referee_order_complete_count}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={tbodyStyle} colSpan={9}>
                  캠페인 데이터가 없어요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CampaignStats;
