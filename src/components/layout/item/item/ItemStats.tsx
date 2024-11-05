import { fetchDeleteItems, fetchActivateItem } from "@/lib/item/apis";
import { ApiResponse } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import ItemActiveButton from "@/components/layout/item/item/ItemActiveButton";

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
  console.log("item stats api", apiResponse);
  const router = useRouter();
  const items = useMemo(
    () => (Array.isArray(apiResponse) ? apiResponse : []),
    [apiResponse],
  );
  const [selectedProductItems, setSelectedProductItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [activeStatusMap, setActiveStatusMap] = useState<{
    [key: string]: boolean;
  }>({});
  const selectedItemIds = Object.keys(selectedProductItems).filter(
    (key) => selectedProductItems[key],
  );

  useEffect(() => {
    const initialStatus = items.reduce(
      (acc, item) => {
        acc[item.id] = item.active;
        return acc;
      },
      {} as { [key: string]: boolean },
    );
    setActiveStatusMap(initialStatus);
  }, [items]);

  const handleAction = async (actionType: string, itemId?: string) => {
    let result;
    if (
      actionType === "delete" &&
      confirm("선택하신 아이템을 삭제하시겠어요?")
    ) {
      result = await fetchDeleteItems(
        itemId ? [itemId] : selectedItemIds,
        campaign_id,
        context,
      );
    } else if (
      actionType === "activate" &&
      confirm("아이템 활성화 상태를 변경하시겠어요?")
    ) {
      result = await fetchActivateItem(itemId!, campaign_id, context);
    }

    if (result?.status === 200) {
      alert(result.message);
      window.location.reload();
    } else if (result) {
      alert(`오류 발생: ${result.status}`);
      console.error(`오류 발생: ${result.status}`);
    }
  };

  const toggleItemActiveStatus = (itemId: string, newStatus: boolean) => {
    setActiveStatusMap((prevState) => ({
      ...prevState,
      [itemId]: newStatus,
    }));
  };

  const handleItemClick = (itemId: string) => {
    if (router.pathname.includes("/campaign/details")) {
      router.replace({
        pathname: "/item/details",
        query: { campaign_id, item_id: itemId },
      });
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    const updatedSelectedItems = items.reduce(
      (acc, item) => ({ ...acc, [item.id]: isChecked }),
      {} as { [key: string]: boolean },
    );
    setSelectedProductItems(updatedSelectedItems);
  };

  const handleCheckboxChange =
    (itemId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setSelectedProductItems((prev) => {
        const updatedItems = { ...prev, [itemId]: isChecked };
        setSelectAll(items.every((item) => updatedItems[item.id]));
        return updatedItems;
      });
    };

  return (
    <>
      <div className="flex w-full">
        <h1 className="mb-2 flex w-full items-center justify-between border-b pb-2 text-base font-bold">
          <div>
            <div className="text-xl">아이템 통계</div>
            <div className="text-sm font-normal text-gray-500">
              현재 사용중인 아이템 통계 내역이에요.
            </div>
          </div>
        </h1>
      </div>
      <div className="hidden w-full py-3 lg:block">
        <table className="w-full border border-gray-100 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className={theadStyle}>
                <input
                  type="checkbox"
                  id="item_all"
                  name="item_all"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
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
            {items.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer"
                onClick={() => handleItemClick(item.id)}
              >
                <td
                  className={`${tbodyStyle} px-2`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    id={`item_${item.id}`}
                    name={`item_${item.id}`}
                    checked={selectedProductItems[item.id] || false}
                    onChange={handleCheckboxChange(item.id)}
                  />
                </td>
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
                  {item.end_date != null || ""
                    ? new Date(item.end_date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
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
                  colSpan={6}
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
      {/* Mobile-friendly layout */}
      <div className="mt-2 block lg:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="mb-4 cursor-pointer space-y-1 rounded-xl bg-gray-100 p-4 text-gray-600"
            onClick={() => handleItemClick(item.id)}
          >
            <div
              className="mb-2 flex w-full justify-between border-b pb-1 font-bold text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full">{item.title}</div>
              <ItemActiveButton
                view="MOBILE"
                item_id={item.id}
                campaign_id={campaign_id}
                activeStatus={activeStatusMap[item.id]}
                toggleItemActiveStatus={toggleItemActiveStatus}
              />
            </div>
            <div className="flex items-center pr-2 text-sm">
              <div className="w-[100px]">
                <strong>아이템 종류: </strong>
              </div>
              <div
                className={`w-fit rounded-md px-2 py-1 text-sm font-semibold ${
                  item.item_type === "PRODUCT"
                    ? "bg-blue-200 text-blue-600"
                    : "bg-orange-200 text-orange-600"
                }`}
              >
                {item.item_type === "PRODUCT" ? "상품" : "프로모션"}
              </div>
            </div>
            <div className="flex items-center pr-2 text-sm">
              <div className="w-[100px]">
                <strong>생성일: </strong>
              </div>
              {new Date(item.created_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center pr-2 text-sm">
              <div className="w-[100px]">
                <strong>캠페인 수정일: </strong>
              </div>
              {new Date(item.updated_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex w-full justify-end">
              <button
                className="w-[60px] rounded-md bg-red-500 p-2 text-sm text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("delete", item.id);
                }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="p-3 text-center text-sm text-gray-500">
            현재 사용중인 아이템이 없어요
            <br />
            새로운 아이템을 등록해 주세요.
          </div>
        )}
      </div>
    </>
  );
};

export default ItemStats;
