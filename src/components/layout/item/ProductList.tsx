import { ApiResponse } from "@/lib/types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { getShopIdFromCookies } from "@/lib/helper";
import { ProductListArgs, RewardType } from "@/lib/item/types";

interface ProductListProps {
  campaign_id: string;
  apiResponse: ApiResponse;
}

// Fetches campaign data during server-side rendering
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

const ProductList: React.FC<ProductListProps> = ({ campaign_id, apiResponse }) => {
  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 text-sm border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";
  // const data = apiResponse.data;
  const data = apiResponse?.data;
  const products = useMemo(() => (Array.isArray(data.content) ? data.content : []), [data.content]);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);
  const handleAction = async (event: React.FormEvent, actionType: string, itemId: string) => {
    let result;
    if (actionType === "select_products" && confirm("해당 상품을 선택 하시겠어요?")) {
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    const updatedSelectedItems = products.reduce(
      (acc: Number, product: ProductListArgs) => ({ ...acc, [product.gid]: isChecked }),
      {} as { [key: string]: boolean }
    );
    setSelectedItems(updatedSelectedItems);
  };

  const handleCheckboxChange = (productsGid: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectedItems((prev) => {
      const updatedItems = { ...prev, [productsGid]: isChecked };
      setSelectAll(products.every((product: ProductListArgs) => updatedItems[products.gid]));
      return updatedItems;
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="w-full text-left text-xl font-bold pb-2">상품 선택</h1>

        <div className="flex flex-col items-center max-w-[370px] lg:max-w-full max-h-[550px] overflow-y-scroll my-2">
          <div className="flex flex-col bg-white p-3 rounded-lg">
            <div className="flex flex-col justify-center items-center w-full rounded-xl">
              <div className="flex flex-col w-full mb-2 text-left">
                <label className="font-gray-300 text-sm font-semibold mb-2">선택된 상품</label>
                <div className="max-w-[300px] break-words">
                  {Object.keys(selectedItems)
                    .filter((gid) => selectedItems[gid])
                    .map((gid, index, array) => {
                      const product = products.find((p: any) => p.gid === gid);
                      return product ? (
                        <a key={product.gid} className="pr-1 text-sm">
                          {product.gid}
                          {index < array.length - 1 && ","}
                        </a>
                      ) : null;
                    })}
                </div>
              </div>
            </div>
            <div className="w-full py-3 block">
              <table className="w-full border border-gray-100 text-center table">
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
                    <th className={theadStyle}>POS 썸네일</th>
                    <th className={theadStyle}>상품 ID</th>
                    <th className={theadStyle}>상품명</th>
                    {/* <th className={theadStyle}>일반 썸네일</th> */}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: ProductListArgs) => (
                    <tr key={product.gid}>
                      <td className={`${tbodyStyle} px-2`}>
                        <input
                          type="checkbox"
                          id={`item_${product.gid}`}
                          name={`item_${product.gid}`}
                          checked={selectedItems[product.gid] || false}
                          onChange={handleCheckboxChange(product.gid)}
                        />
                      </td>
                      <td className={tbodyStyle}>
                        <div className="w-full flex justify-center items-center text-center ">
                          <img
                            src={product.thumb || "/images/kakao/kakaolink-no-logo-default.png"}
                            className="w-[50px] h-[50px] lg:w-[85px] lg:h-[85px]"
                          />
                        </div>
                      </td>
                      <td className={tbodyStyle}>{product.gid}</td>
                      <td className={tbodyStyle}>{product.name}</td>
                    </tr>
                  ))}
                  {!products.length && (
                    <tr>
                      <td className={tbodyStyle} colSpan={6}>
                        현재 추가가능한 상품이 없어요.
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

export default ProductList;
