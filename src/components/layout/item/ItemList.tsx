import { ApiResponse } from "@/lib/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ItemListProps {
  campaignTitle: string;
  campaignDesc: string;
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: ApiResponse;
  handleButton: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ItemList: React.FC<ItemListProps> = ({ theadStyle, tbodyStyle, apiResponse, handleButton }) => {
  const router = useRouter();
  function onlcickItemDetail(event: React.MouseEvent<HTMLElement>) {
    const { id } = event.currentTarget;
    router.replace(`/item/details?item_id=${id}`, undefined, { shallow: true, scroll: false });
  }
  // 더보기 버튼 표시 유무 확인
  const [isCampaignPage, setIsCampaignPage] = useState(false);
  useEffect(() => {
    setIsCampaignPage(router.pathname.includes("/campaign"));
  }, [router.pathname]);

  const items = Array.isArray(apiResponse) ? apiResponse : [];

  return (
    <>
      <div className=" flex w-full">
        <div className="font-bold text-xl inline-block w-full">
          <div className="w-[50%]">아이템</div>
          <div className="font-normal text-sm">현재 사용중인 아이템 목록입니다.</div>
        </div>
        <div className="w-[50%]] item-end justify-end text-center">
          <div
            id="create_item"
            className="border m-2 mt-4 p-2 bg-blue-500 text-white rounded-lg min-w-[92px] min-fit  cursor-pointer"
            onClick={handleButton}
          >
            아이템 추가
          </div>
        </div>
      </div>
      <div className="my-2 w-full">
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className={theadStyle}>아이템 명</th>
              <th className={theadStyle}>아이템 종류</th>
              <th className={theadStyle}>활성화 여부</th>
              <th className={theadStyle}>생성일</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr className=" cursor-pointer" key={i} id={item.id} onClick={onlcickItemDetail}>
                <td className={tbodyStyle}>{item.title}</td>
                <td className={tbodyStyle}>{item.period_type}</td>
                <td className={tbodyStyle}>{item.active ? "TRUE" : "FALSE"}</td>
                <td className={tbodyStyle}>
                  {item.start_date} ~ {item.end_date}
                </td>
              </tr>
            ))}
            {!items.length && (
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
export default ItemList;
