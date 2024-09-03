import { ApiResponse } from "@/lib/types";
import campaign from "@/pages/campaign";
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
    <>
      <div>
        <div className="flex w-full">
          <h1 className="font-bold text-base pb-2 border-b mb-5 w-full flex justify-between items-center">
            <div>
              <div className="text-xl">아이템</div>
              <div className="font-normal text-sm">현재 사용중인 아이템 목록이에요.</div>
            </div>
            <div
              id="create_item"
              className="bg-blue-500 text-white p-2 rounded-lg  text-center cursor-pointer font-normal"
              onClick={handleButton}
            >
              아이템 추가
            </div>
          </h1>
        </div>

        <div className="my-2 w-full">
          <table className="w-full bg-white border border-gray-200 hidden lg:table">
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
                    현재 사용중인 아이템이 없어요, 새로운 아이템을 등록해 보세요.
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
          <div key={item.id || i} className=" bg-gray-100 p-4 mb-4 rounded-xl text-gray-600 space-y-1">
            <div className="font-bold mb-2 text-black w-full pb-1 border-b">{item.title}</div>
            <div className="text-sm">
              <strong>아이템 종류: </strong>
              {item.item_type === "PRODUCT" ? "상품" : "프로모션"}
            </div>
            <div className="text-sm">
              <strong>생성일: </strong>
              {item.created_at}
            </div>
            <div className="text-sm">
              <strong>캠페인 수정일: </strong>
              {item.updated_at}
            </div>
            <div
              className="text-blue-400 cursor-pointer text-right font-semibold"
              id={item.id}
              onClick={handleItemClick}
            >
              상세보기
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="text-center text-gray-500">사용중인 아이템이 없습니다. 새로운 캠페인을 생성해보세요.</div>
        )}
      </div>
    </>
  );
};

export default ItemList;
