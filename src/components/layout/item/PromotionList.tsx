import { ApiResponse } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { PromotionListArgs } from "@/lib/item/types";
import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSideProps } from "next";

interface PromotionListProps {
  campaign_id: string;
  apiResponse: ApiResponse;
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const shop_id = getShopIdFromCookies(context);
  if (!shop_id) {
    return {
      redirect: {
        destination: "auth/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
const PromotionList: React.FC<PromotionListProps> = ({ campaign_id, apiResponse }) => {
  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";

  // const data = apiResponse.data;
  const data = apiResponse?.data;
  const promotions = useMemo(() => (Array.isArray(data.content) ? data.content : []), [data.content]);
  const [selectedProductItems, setSelectedProductItems] = useState<{ [key: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);
  const handleAction = async (event: React.FormEvent, actionType: string, itemId: string) => {
    let result;
    if (actionType === "select_promotions" && confirm("해당 프로모션을 선택 하시겠어요?")) {
    }
  };
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    const updatedSelectedItems = promotions.reduce(
      (acc: Number, promotion: PromotionListArgs) => ({ ...acc, [promotion.cpnId]: isChecked }),
      {} as { [key: string]: boolean }
    );
    setSelectedProductItems(updatedSelectedItems);
  };

  const handleCheckboxChange = (promotionCpnId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectedProductItems((prev) => {
      const updatedItems = { ...prev, [promotionCpnId]: isChecked };
      setSelectAll(promotions.every((promotion: PromotionListArgs) => updatedItems[promotion.cpnId]));
      return updatedItems;
    });
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="w-full text-left text-xl font-bold pb-2">프로모션 선택</h1>

        <div className="flex flex-col items-center max-w-[370px] lg:max-w-full max-h-[550px] overflow-y-scroll my-2">
          <div className="flex flex-col bg-white p-3 rounded-lg">
            <div className="flex flex-col justify-center items-center w-full rounded-xl">
              <div className="flex flex-col w-full mb-2 text-left">
                <label className="font-gray-300 text-sm font-semibold mb-2">선택된 프로모션</label>
                <div className="max-w-[380px] break-words">
                  {Object.keys(selectedProductItems)
                    .filter((cpnId) => selectedProductItems[cpnId])
                    .map((cpnId, index, array) => {
                      const promotion = promotions.find((p: any) => p.cpnId === cpnId);
                      return promotion ? (
                        <a key={promotion.cpnId} className="pr-1 text-sm">
                          {promotion.cpnId}
                          {index < array.length - 1 && ","}
                        </a>
                      ) : null;
                    })}
                </div>
              </div>
            </div>
            <div className="w-full py-3">
              <table className="w-full border border-gray-100 text-center table">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={theadStyle}>
                      <input
                        type="checkbox"
                        id={`item_all`}
                        name={`item_all`}
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className={theadStyle}>프로모션 ID</th>
                    <th className={theadStyle}>프로모션 명</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion: PromotionListArgs) => (
                    <tr key={promotion.cpnId}>
                      <td className={`${tbodyStyle} px-2`}>
                        <input
                          type="checkbox"
                          id={`item_${promotion.cpnId}`}
                          name={`item_${promotion.cpnId}`}
                          checked={selectedProductItems[promotion.cpnId] || false}
                          onChange={handleCheckboxChange(promotion.cpnId)}
                        />
                      </td>
                      <td className={tbodyStyle}>{promotion.cpnId}</td>
                      <td className={tbodyStyle}>{promotion.name}</td>
                    </tr>
                  ))}
                  {!promotions.length && (
                    <tr>
                      <td className={tbodyStyle} colSpan={6}>
                        현재 등록가능한 프로모션이 없어요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <button className="bg-blue-500 text-white rounded-lg p-2 w-full mt-4">상품 추가</button>
      </div>
    </>
  );
};

export default PromotionList;
