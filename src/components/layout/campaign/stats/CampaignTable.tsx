import { StatsList } from "@/lib/types";
import { useRouter } from "next/router";

interface CampaignTableProps {
  tbodyStyle: string;
  campaigns: StatsList[];
}

const CampaignTable: React.FC<CampaignTableProps> = ({
  tbodyStyle,
  campaigns,
}) => {
  const router = useRouter();

  const handleCampaignClick = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    router.replace(`/item/stats?campaign_id=${id}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  return (
    <>
      {campaigns.length > 0 ? (
        campaigns.map((campaign: StatsList) => (
          <tr
            className={`cursor-pointer ${
              campaign.period_type === "UNLIMITED" ? "bg-green-50" : "bg-white"
            }`}
            key={campaign.campaign_id}
            id={campaign.campaign_id}
            onClick={handleCampaignClick}
          >
            <td className={tbodyStyle}>{campaign.item_type}</td>
            <td className={tbodyStyle}>{campaign.item_title}</td>
            <td className={tbodyStyle}>
              {campaign.start_date
                ? new Date(campaign.start_date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </td>
            <td className={tbodyStyle}>
              {campaign.end_date
                ? new Date(campaign.end_date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </td>
            <td className={tbodyStyle}>
              {campaign.share_attempts_click_count}
            </td>
            <td className={tbodyStyle}>{campaign.kakao_message_share_count}</td>
            <td className={tbodyStyle}>{campaign.accepted_shares}</td>
            <td className={tbodyStyle}>{campaign.new_referee_user_count}</td>
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
    </>
  );
};

export default CampaignTable;
