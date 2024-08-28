import { ApiResponse } from "@/lib/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ItemListProps {
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: ApiResponse;
  handleButton: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ItemList: React.FC<ItemListProps> = ({ theadStyle, tbodyStyle, apiResponse, handleButton }) => {
  const router = useRouter();
  const [isItemPage, setIsItemPage] = useState(false);

  useEffect(() => {
    setIsItemPage(router.pathname.includes("/items"));
  }, [router.pathname]);

  const items = Array.isArray(apiResponse) ? apiResponse : [];

  const handleItemClick = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (!router.pathname.includes("/campaign/details")) {
      router.replace(`/item/details?item_id=${id}`, undefined, { shallow: true, scroll: false });
    }
  };

  return (
    <div>
      <div className="flex w-full">
        <div className="w-[50%]">
          <h1 className="font-bold text-xl pb-2 border-b-[1px]">아이템</h1>
          <div className="font-normal text-sm">현재 사용중인 아이템 목록입니다.</div>
        </div>
        <div
          id="create_item"
          className="border m-2 mt-4 p-2 bg-blue-500 text-white rounded-lg min-w-[92px] cursor-pointer"
          onClick={handleButton}
        >
          아이템 추가
        </div>
      </div>

      <div className="my-2 w-full">
        <table className="w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className={theadStyle}>아이템 명</th>
              <th className={theadStyle}>아이템 종류</th>
              <th className={theadStyle}>생성일</th>
              <th className={theadStyle}>수정일</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr className="cursor-pointer" key={item.id} id={item.id} onClick={handleItemClick}>
                <td className={tbodyStyle}>{item.title}</td>
                <td className={tbodyStyle}>{item.item_type}</td>
                <td className={tbodyStyle}>{item.created_at}</td>
                <td className={tbodyStyle}>{item.updated_at}</td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td className={tbodyStyle} colSpan={4}>
                  No items available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemList;
