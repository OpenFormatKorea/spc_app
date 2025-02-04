import { ApiResponse } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { ProductListArgs, ProductsArgs } from "@/lib/item/types";
import Modal from "@/components/layout/base/Modal";

interface ProductListProps {
  apiResponse: ApiResponse;
  productInputs: ProductsArgs[];

  setProductInputs: (value: ProductsArgs[]) => void;
  setSelectedProductItems: (value: ProductsArgs[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
  apiResponse,
  productInputs,
  setProductInputs,
  setSelectedProductItems,
  isOpen,
  onClose,
}) => {
  const products = useMemo(
    () =>
      Array.isArray(apiResponse.data.content) ? apiResponse.data.content : [],
    [apiResponse],
  );
  const [selectedItemList, setSelectedItemList] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      const allProducts = products.map((product: ProductListArgs) => ({
        product_model_code: product.gid,
        product_model_name: product.name,
        images: [
          { posThumb: product.posThumb || "" },
          { thumb: product.thumb || "" },
        ],
      }));
      setProductInputs(allProducts);
      setSelectedItemList(
        products.map((product: ProductListArgs) => product.gid),
      );
    } else {
      setProductInputs([]);
      setSelectedItemList([]);
    }
  };

  const handleCheckboxChange =
    (productGid: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setSelectedItemList((prevSelected) => {
        let updatedSelectedItems;
        if (isChecked) {
          updatedSelectedItems = [...prevSelected, productGid];
        } else {
          updatedSelectedItems = prevSelected.filter(
            (gid) => gid !== productGid,
          );
        }
        const updatedProducts = products
          .filter((product: ProductListArgs) =>
            updatedSelectedItems.includes(product.gid),
          )
          .map((product: ProductListArgs) => ({
            product_model_code: product.gid,
            product_model_name: product.name,
            images: [
              { posThumb: product.posThumb || "" },
              { thumb: product.thumb || "" },
            ],
          }));
        setProductInputs(updatedProducts);
        setSelectAll(updatedSelectedItems.length === products.length);
        return updatedSelectedItems;
      });
    };

  const handleAction = async () => {
    if (confirm("해당 상품을 선택 하시겠어요?")) {
      setSelectedProductItems(productInputs);
      onClose();
    }
  };

  // useEffect(() => {
  //   if (selectedItemList.length === 0) {
  //     setSelectAll(false);
  //   }
  // }, [selectedItemList]);

  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 text-sm border-b border-gray-200 whitespace-normal break-words break-all text-center";
  const labelClass = "text-xs pt-4 text-gray-500";
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="w-full pb-2 text-left text-xl font-bold">상품 선택</h1>

        <div className="my-2 flex max-h-[550px] max-w-[370px] flex-col items-center overflow-y-scroll lg:max-w-full">
          <div className="flex w-full flex-col rounded-lg bg-white p-3">
            <h1 className="text-md w-full pb-2 text-left font-semibold text-gray-500">
              상품을 선택해 주세요
            </h1>

            <div className="block w-full py-3">
              <table className="table w-full border border-gray-100 text-center">
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
                    <th className={theadStyle}>상품 ID</th>

                    <th className={theadStyle}>POS 썸네일</th>
                    <th className={theadStyle}>상품명</th>
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
                          checked={selectedItemList.includes(product.gid)}
                          onChange={handleCheckboxChange(product.gid)}
                        />
                      </td>
                      <td className={tbodyStyle}>{product.gid}</td>

                      <td className={tbodyStyle}>
                        <div className="flex w-full items-center justify-center text-center">
                          <img
                            src={
                              product.thumb ||
                              "/images/kakao/kakaolink-no-logo-default.png"
                            }
                            className="h-[50px] w-[50px] lg:h-[70px] lg:w-[70px]"
                            alt="thumbnail"
                          />
                        </div>
                      </td>
                      <td className={tbodyStyle}>{product.name}</td>
                    </tr>
                  ))}
                  {!products.length && (
                    <tr>
                      <td className={tbodyStyle} colSpan={4}>
                        현재 추가가능한 상품이 없어요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex h-fit w-[350px] flex-col lg:w-[450px]">
          <div className="mb-2 flex w-full flex-col text-left">
            <label className={labelClass}>선택된 상품</label>
            <div className="mt-2 flex h-[85px] w-[350px] flex-wrap justify-center overflow-y-auto break-words rounded-xl bg-white p-2 pb-3 text-sm lg:w-full">
              {productInputs.length !== 0 ? (
                productInputs.map((inputProduct) => {
                  const product = products.find(
                    (product: ProductListArgs) =>
                      product.gid === inputProduct.product_model_code,
                  );
                  return (
                    product && (
                      <div
                        key={product.gid}
                        className="mr-1 mt-1 h-fit w-fit rounded-md bg-blue-300 p-1 text-sm text-white"
                      >
                        {product.name}
                      </div>
                    )
                  );
                })
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center text-gray-600">
                    선택된 상품이 없습니다.
                    <br />
                    상품을 선택해주세요.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          className="mt-4 w-full rounded-lg bg-blue-500 p-2 text-white"
          onClick={handleAction}
        >
          상품 추가
        </button>
      </div>
    </Modal>
  );
};

export default ProductList;
