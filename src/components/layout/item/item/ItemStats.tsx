import { ApiResponse, CamapaignStats } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface ItemStatsProps {
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: ApiResponse;
  campaign_id: string;
}

const ItemStats: React.FC<ItemStatsProps> = (
  { theadStyle, tbodyStyle, apiResponse, campaign_id },
  context: GetServerSidePropsContext,
) => {
  const router = useRouter();
  const items = useMemo(
    () => (Array.isArray(apiResponse.result) ? apiResponse.result : []),
    [apiResponse.result],
  );

  const handleItemClick = (itemId: string) => {
    if (router.pathname.includes("/campaign/details")) {
      router.replace({
        pathname: "/item/details",
        query: { campaign_id, item_id: itemId },
      });
    }
  };

  return (
    <>
      <div className="mb-2 w-full pb-2">
        <div className="mb-2 flex w-full items-center border-b-[1px] pb-2">
          <div className="w-[80%]">
            <div className="text-xl">아이템 통계</div>
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
              <th className={theadStyle}>아이템 종류</th>
              <th className={theadStyle}>아이템 명</th>
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
            {items.map((item: CamapaignStats) => (
              <tr
                key={item.campaign_id}
                className="cursor-pointer"
                onClick={() => handleItemClick(item.campaign_id)}
              >
                <td className={tbodyStyle}>{item.item_type}</td>
                <td className={tbodyStyle}>{item.item_title}</td>
                <td className={tbodyStyle}>
                  {new Date(item.start_date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className={tbodyStyle}>
                  {item.end_date
                    ? new Date(item.end_date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className={tbodyStyle}>
                  {item.share_attempts_click_count}
                </td>
                <td className={tbodyStyle}>{item.kakao_message_share_count}</td>
                <td className={tbodyStyle}>{item.accepted_shares}</td>
                <td className={tbodyStyle}>{item.new_referee_user_count}</td>
                <td className={tbodyStyle}>
                  {item.referee_order_complete_count}
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td
                  className="p-3 text-center text-sm text-gray-500"
                  colSpan={10}
                >
                  현재 사용중인 아이템이 없어요
                  <br />
                  새로운 아이템을 등록해 주세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ItemStats;
