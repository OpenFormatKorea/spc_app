import { ApiResponse } from "@/lib/types";
import { useRouter } from "next/router";

interface ItemListProps {
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: ApiResponse;
  handleButton: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ItemList: React.FC<ItemListProps> = ({ theadStyle, tbodyStyle, apiResponse, handleButton }) => {
  const router = useRouter();
  const items = Array.isArray(apiResponse) ? apiResponse : [];

  const handleItemClick = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (router.pathname.includes("/campaign/details")) {
      router.replace(`/item/details?item_id=${id}`, undefined, { shallow: true, scroll: false });
      console.log(router.pathname);
    }
  };

  return (
    <div>
      <div className="flex w-full">
        <h1 className="font-bold text-base pb-2 border-b mb-5 w-full flex justify-between items-center">
          <div>
            <div className="text-xl">아이템</div>
            <div className="font-normal text-sm">현재 사용중인 아이템 목록입니다.</div>
          </div>
          <div
            id="create_item"
            className="bg-blue-400 text-white p-2 rounded-lg w-[90px] text-center"
            onClick={handleButton}
          >
            아이템 추가
          </div>
        </h1>
      </div>

      <div className="my-2 w-full">
        <table className="w-full bg-white border border-gray-200 rounded-lg text-sm text-center">
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
                <td className={tbodyStyle}>{item.item_type === "PRODUCT" ? "상품" : "프로모션"}</td>
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
