import ItemTable from "@/components/layout/item/item/stats/ItemTable";
import { StatsApiResponse } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface ItemStatsProps {
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: StatsApiResponse;
}

const ItemStats: React.FC<ItemStatsProps> = (
  { theadStyle, tbodyStyle, apiResponse },
  context: GetServerSidePropsContext,
) => {
  const router = useRouter();
  const items = useMemo(
    () => (Array.isArray(apiResponse.result) ? apiResponse.result : []),
    [apiResponse.result],
  );

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
            <ItemTable items={items} tbodyStyle={tbodyStyle} />
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ItemStats;
