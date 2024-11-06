import ItemTable from "@/components/layout/item/item/stats/ItemTable";
import { StatsApiResponse, StatsList } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface ItemStatsProps {
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: StatsApiResponse;
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
              <th className={theadStyle}>공유버튼 클릭 수</th>
              <th className={theadStyle}>카카오 공유 수</th>
              <th className={theadStyle}>친구추천 수락 수</th>
              <th className={theadStyle}>신규 가입자수</th>
              <th className={theadStyle}>주문완료 수</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: StatsList) => (
              <>
                <ItemTable item={item} tbodyStyle={tbodyStyle} />
                <ItemTable item={item} tbodyStyle={tbodyStyle} />
              </>
            ))}
            {!items.length && (
              <tr>
                <td
                  className="p-3 text-center text-sm text-gray-500"
                  colSpan={8}
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
