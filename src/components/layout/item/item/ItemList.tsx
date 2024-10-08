import { fetchDeleteItems, fetchActivateItem } from "@/lib/item/apis";
import { ApiResponse } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ItemActiveButton from "@/components/layout/item/item/ItemActiveButton";

interface ItemListProps {
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: ApiResponse;
  campaign_id: string;
  handleButton: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ItemList: React.FC<ItemListProps> = (
  { theadStyle, tbodyStyle, apiResponse, handleButton, campaign_id },
  context: GetServerSidePropsContext
) => {
  const router = useRouter();
  const items = useMemo(() => (Array.isArray(apiResponse) ? apiResponse : []), [apiResponse]);
  const [selectedProductItems, setSelectedProductItems] = useState<{ [key: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [activeStatusMap, setActiveStatusMap] = useState<{ [key: string]: boolean }>({});
  const selectedItemIds = Object.keys(selectedProductItems).filter((key) => selectedProductItems[key]);

  useEffect(() => {
    const initialStatus = items.reduce(
      (acc, item) => {
        acc[item.id] = item.active;
        return acc;
      },
      {} as { [key: string]: boolean }
    );
    setActiveStatusMap(initialStatus);
  }, [items]);

  const handleAction = async (actionType: string, itemId?: string) => {
    let result;
    if (actionType === "delete" && confirm("선택하신 아이템을 삭제하시겠어요?")) {
      result = await fetchDeleteItems(itemId ? [itemId] : selectedItemIds, campaign_id, context);
    } else if (actionType === "activate" && confirm("아이템 활성화 상태를 변경하시겠어요?")) {
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
      {} as { [key: string]: boolean }
    );
    setSelectedProductItems(updatedSelectedItems);
  };

  const handleCheckboxChange = (itemId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <h1 className="font-bold text-base pb-2 border-b mb-2 w-full flex justify-between items-center">
          <div>
            <div className="text-xl">아이템</div>
            <div className="font-normal text-sm text-gray-500">현재 사용중인 아이템 목록이에요.</div>
          </div>
        </h1>
      </div>
      <div className="w-full py-3 hidden lg:block">
        <table className="w-full border border-gray-100 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className={theadStyle}>
                <input type="checkbox" id="item_all" name="item_all" checked={selectAll} onChange={handleSelectAll} />
              </th>
              <th className={theadStyle}>아이템 명</th>
              <th className={theadStyle}>아이템 종류</th>
              <th className={theadStyle}>생성일</th>
              <th className={theadStyle}>수정일</th>
              <th className={theadStyle}>활성화</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="cursor-pointer" onClick={() => handleItemClick(item.id)}>
                <td className={`${tbodyStyle} px-2`} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    id={`item_${item.id}`}
                    name={`item_${item.id}`}
                    checked={selectedProductItems[item.id] || false}
                    onChange={handleCheckboxChange(item.id)}
                  />
                </td>
                <td className={tbodyStyle}>{item.title}</td>
                <td className={tbodyStyle}>
                  <div className="w-full flex justify-center">
                    <div
                      className={`w-fit px-2 py-1 rounded-md font-semibold text-sm ${
                        item.item_type === "PRODUCT" ? "bg-blue-200 text-blue-600" : "bg-orange-200 text-orange-600"
                      }`}
                    >
                      {item.item_type === "PRODUCT" ? "상품" : "프로모션"}
                    </div>
                  </div>
                </td>
                <td className={tbodyStyle}>
                  {new Date(item.created_at).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className={tbodyStyle}>
                  {new Date(item.updated_at).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className={tbodyStyle} onClick={(e) => e.stopPropagation()}>
                  <ItemActiveButton
                    view="PC"
                    item_id={item.id}
                    campaign_id={campaign_id}
                    activeStatus={activeStatusMap[item.id]}
                    toggleItemActiveStatus={toggleItemActiveStatus}
                  />
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td className="text-center text-sm text-gray-500 p-3" colSpan={6}>
                  현재 사용중인 아이템이 없어요
                  <br />
                  새로운 아이템을 등록해 주세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="items-center justify-between hidden pt-4 lg:flex">
          {!items.length ? (
            ""
          ) : selectedItemIds.length ? (
            <button
              className="py-2 px-2 text-xs bg-red-500 text-white rounded-md cursor-pointer"
              id="delete_items"
              onClick={() => handleAction("delete")}
            >
              선택삭제
            </button>
          ) : (
            <button
              className="py-2 px-2 text-xs bg-gray-400 text-white rounded-md cursor-not-allowed"
              id="delete_items"
            >
              선택삭제
            </button>
          )}
        </div>
      </div>
      {/* Mobile-friendly layout */}
      <div className="block mt-2 lg:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className=" bg-gray-100 p-4 mb-4 rounded-xl text-gray-600 space-y-1 cursor-pointer"
            onClick={() => handleItemClick(item.id)}
          >
            <div
              className="font-bold mb-2 text-black w-full pb-1 border-b flex justify-between"
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
            <div className="text-sm flex pr-2 items-center">
              <div className="w-[100px]">
                <strong>아이템 종류: </strong>
              </div>
              <div
                className={`w-fit px-2 py-1 rounded-md font-semibold text-sm ${
                  item.item_type === "PRODUCT" ? "bg-blue-200 text-blue-600" : "bg-orange-200 text-orange-600"
                }`}
              >
                {item.item_type === "PRODUCT" ? "상품" : "프로모션"}
              </div>
            </div>
            <div className="text-sm flex pr-2 items-center">
              <div className="w-[100px]">
                <strong>생성일: </strong>
              </div>
              {new Date(item.created_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-sm flex pr-2 items-center">
              <div className="w-[100px]">
                <strong>캠페인 수정일: </strong>
              </div>
              {new Date(item.updated_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="w-full flex justify-end">
              <button
                className="w-[60px] p-2 rounded-md bg-red-500 text-white text-sm"
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
          <div className="text-center text-sm text-gray-500 p-3">
            현재 사용중인 아이템이 없어요
            <br />
            새로운 아이템을 등록해 주세요.
          </div>
        )}
      </div>
      <div className="flex w-full text-white text-center lg:justify-end pt-2">
        <div
          id="create_item"
          className="p-2 w-full lg:w-fit rounded-lg cursor-pointer flex items-center justify-center bg-blue-500"
          onClick={handleButton}
        >
          <AddIcon fontSize="small" />
          아이템 추가
        </div>
      </div>
    </>
  );
};

export default ItemList;
