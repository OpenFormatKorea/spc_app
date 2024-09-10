import { fetchDeleteItems, fetchActivateItem } from "@/lib/item/apis";
import { ApiResponse } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ItemActiveButton from "@/components/layout/item/ItemActiveButton";
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
  const items = Array.isArray(apiResponse) ? apiResponse : [];

  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;

    if (id === "delete_items" && confirm("선택하신 아이템들을 삭제하시겠어요?")) {
      const item_ids = Object.keys(selectedItems).filter((key) => selectedItems[key]);
      const result = await fetchDeleteItems(item_ids, campaign_id, context);
      if (result.status === 200) {
        alert(result.message);
        window.location.reload();
      } else {
        alert("아이템 삭제를 실패 하였습니다. 상태 코드: " + result.status);
        console.error("아이템 삭제를 실패 하였습니다. 상태 코드:", result.status);
      }
    } else if (id.includes("activate_item_") && confirm("아이템 활성화 상태를 변경하시겠어요?")) {
      const item_id = id.replace("activate_item_", "");
      const result = await fetchActivateItem(item_id, campaign_id, context);
      if (result.status === 200) {
        alert("아이템 활성화 상태를 변경 하였습니다. ");
        window.location.reload();
      } else {
        alert("아이템 활성화 상태를 변경 실패 하였습니다. 상태 코드: " + result.status);
        console.error("아이템 활성화 상태를 변경 실패 하였습니다. 상태 코드: ", result.status);
      }
    }
  };

  const handleItemDelete = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;

    if (confirm("선택하신 아이템을 삭제하시겠어요?")) {
      const item_ids = [id];
      const result = await fetchDeleteItems(item_ids, campaign_id, context);
      if (result.status === 200) {
        alert(result.message);
        window.location.reload();
      } else {
        alert("아이템 삭제를 실패 하였습니다. 상태 코드: " + result.status);
        console.error("아이템 삭제를 실패 하였습니다. 상태 코드:", result.status);
      }
    }
  };

  const handleItemClick = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (router.pathname.includes("/campaign/details")) {
      router.replace(
        {
          pathname: "/item/details",
          query: { campaign_id: campaign_id, item_id: id },
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        }
      );
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    const newSelectedItems = items.reduce(
      (acc, item) => {
        acc[item.id] = checked;
        return acc;
      },
      {} as { [key: string]: boolean }
    );

    setSelectedItems(newSelectedItems);
  };

  const handleCheckboxChange = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectedItems((prevState) => {
      const newSelectedItems = {
        ...prevState,
        [id]: checked,
      };

      // Check if all items are selected
      const allSelected = items.every((item) => newSelectedItems[item.id]);
      setSelectAll(allSelected); // Update the selectAll state based on this check

      return newSelectedItems;
    });
  };
  return (
    <>
      <div>
        <div className="flex w-full">
          <h1 className="font-bold text-base pb-2 border-b mb-2 w-full flex justify-between items-center">
            <div>
              <div className="text-xl">아이템</div>
              <div className="font-normal text-sm text-gray-500 pt-2">현재 사용중인 아이템 목록이에요.</div>
            </div>
          </h1>
        </div>
        <div className="items-center justify-between hidden lg:flex">
          <button
            className="p-2 bg-red-500 text-white rounded-lg cursor-pointer"
            id="delete_items"
            onClick={handleSubmit}
          >
            선택삭제
          </button>
        </div>
        <div className="my-2 w-full">
          <table className="w-full bg-white border border-gray-200 rounded-lg text-center hidden lg:table">
            <thead>
              <tr className="bg-gray-200">
                <th className={theadStyle}>
                  <input
                    type="checkbox"
                    id={`item_all`}
                    name={`item_all`}
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
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
                <tr className="cursor-pointer" key={item.id} id={item.id} onClick={handleItemClick}>
                  <td className={`${tbodyStyle} px-2`} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      id={`item_${item.id}`}
                      name={`item_${item.id}`}
                      checked={selectedItems[item.id] || false}
                      onChange={handleCheckboxChange(item.id)}
                    />
                  </td>
                  <td className={tbodyStyle}>{item.title}</td>
                  <td className={tbodyStyle}>{item.item_type === "PRODUCT" ? "상품" : "프로모션"}</td>
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
                    <ItemActiveButton view="PC" item_id={item.id} campaign_id={campaign_id} active={item.active} />
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td className={tbodyStyle} colSpan={4}>
                    현재 사용중인 아이템이 없어요, 새로운 아이템을 등록해 주세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile-friendly layout */}
      <div className="block lg:hidden">
        {items.map((item, i) => (
          <div key={item.id || i} className=" bg-gray-100 p-4 mb-4 rounded-xl text-gray-600 space-y-1 ">
            <div
              className="font-bold mb-2 text-black w-full pb-1 border-b flex justify-between"
              onClick={(e) => e.stopPropagation()} // You stop propagation only for the title section
            >
              <div> {item.title}</div>
              <div>
                <ItemActiveButton view="MOBILE" item_id={item.id} campaign_id={campaign_id} active={item.active} />
              </div>
            </div>
            <div className="text-sm flex pr-2">
              <div className="w-[100px]">
                <strong>아이템 종류: </strong>
              </div>
              {item.item_type === "PRODUCT" ? "상품" : "프로모션"}
            </div>
            <div className="text-sm flex w-full pr-2">
              <div className="w-[100px]">
                <strong>생성일: </strong>
              </div>
              {new Date(item.created_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-sm flex pr-2">
              <div className="w-[100px]">
                <strong>캠페인 수정일: </strong>
              </div>

              {new Date(item.updated_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="w-full pt-2 flex justify-center space-x-2 text-white text-sm">
              <button
                className="w-[50%] p-2 cursor-pointer rounded-md  bg-red-500 "
                id={item.id}
                onClick={handleItemDelete}
              >
                삭제
              </button>
              <button
                className=" w-[50%] p-2 cursor-pointer rounded-md bg-blue-500"
                id={item.id}
                onClick={handleItemClick}
              >
                상세보기
              </button>
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="text-center text-gray-500">
            사용중인 아이템이 없습니다.
            <br />
            새로운 캠페인을 생성해보세요.
          </div>
        )}
      </div>
      <div
        id="create_item"
        className="bg-blue-500 flex w-full text-white mt-4 p-2 rounded-lg text-center justify-center cursor-pointer font-normal"
        onClick={handleButton}
      >
        <div className="pr-1 flex text-center items-center">
          <AddIcon fontSize="small" />
        </div>
        아이템 추가
      </div>
    </>
  );
};

export default ItemList;
