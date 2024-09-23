import { ApiResponse, ProductListArgs } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import item from "@/pages/item";
import ItemActiveButton from "@/components/layout/item/ItemActiveButton";

interface ProductListProps {
  apiResponse: ApiResponse;
  campaign_id: string;
  handleButton: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ProductList: React.FC<ProductListProps> = (
  { apiResponse, handleButton, campaign_id },
  context: GetServerSidePropsContext
) => {
  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";
  const router = useRouter();
  const data = apiResponse.data;
  const products = useMemo(() => (Array.isArray(data.content) ? data.content : []), [data.content]);

  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);

  const handleAction = async (event: React.FormEvent, actionType: string, itemId: string) => {
    let result;
    if (actionType === "select_products" && confirm("해당 상품을 선택 하시겠어요?")) {
    }
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
    const updatedSelectedItems = products.reduce(
      (acc: Number, product: ProductListArgs) => ({ ...acc, [products.gid]: isChecked }),
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
      <div className="w-full py-3 hidden lg:block">
        <table className="w-full border border-gray-100 text-center hidden lg:table">
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
              <th className={theadStyle}>프로덕트 ID</th>
              <th className={theadStyle}>프로덕트 명</th>
              <th className={theadStyle}>POS 썸네일</th>
              {/* <th className={theadStyle}>일반 썸네일</th> */}
            </tr>
          </thead>
          <tbody>
            {products.map((product: ProductListArgs) => (
              <tr key={product.gid} className="cursor-pointer" onClick={() => handleItemClick(item.id)}>
                <td className={`${tbodyStyle} px-2`} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    id={`item_${product.gid}`}
                    name={`item_${product.gid}`}
                    checked={selectedItems[product.gid] || false}
                    onChange={handleCheckboxChange(product.gid)}
                  />
                </td>
                <td className={tbodyStyle}>{product.gid}</td>
                <td className={tbodyStyle}>{product.name}</td>
                <td className={tbodyStyle}>
                  <img src={products.posThumb} className="max-w-[100px] max-h-[100px]" />
                </td>
                {/* <td className={tbodyStyle}>
                  <img src={items.thumb} className="max-w-[100px] max-h-[100px]" />
                </td> */}
              </tr>
            ))}
            {!products.length && (
              <tr>
                <td className={tbodyStyle} colSpan={6}>
                  현재 사용중인 아이템이 없어요,
                  <br />
                  새로운 아이템을 등록해 주세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="items-center justify-between hidden pt-4 lg:flex">
          <button
            className="py-2 px-2 text-xs bg-red-500 text-white rounded-md cursor-pointer"
            id="delete_items"
            onClick={(e) => handleAction(e, "delete", "")}
          >
            선택삭제
          </button>
        </div>
      </div>
      {/* Mobile-friendly layout */}
      <div className="block mt-2 lg:hidden">
        {products.map((product: ProductListArgs, i: Number) => (
          <div
            key={products.gid || i}
            className=" bg-gray-100 p-4 mb-4 rounded-xl text-gray-600 space-y-1 cursor-pointer"
            onClick={() => handleItemClick(product.gid)}
          >
            <div
              className="font-bold mb-2 text-black w-full pb-1 border-b flex  justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full items-end">{products.title}</div>
            </div>
            <div className="text-sm flex pr-2 items-center">
              <div className="w-[100px]">
                <strong>프로덕트 ID: </strong>
              </div>

              {product.gid}
            </div>
            <div className="text-sm flex pr-2 items-center">
              <div className="w-[100px]">
                <strong>프로덕트 명: </strong>
              </div>
              {product.name}
            </div>
            <div className="text-sm flex pr-2 items-center">
              <div className="w-[100px]">
                <strong>썸네일: </strong>
              </div>
            </div>
            <div>
              <img src={product.thumb || ""} className="w-[100px] h-[100px] bg-blue-500" />
            </div>
            <div className="w-full flex justify-end ">
              <div className="w-[50%] pt-2 flex justify-end space-x-2 text-white text-sm">
                <button
                  className="w-[60px] p-2 cursor-pointer rounded-md bg-red-500"
                  onClick={(e) => handleAction(e, "delete", product.gid)}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
        {!products.length && (
          <div className="text-center text-gray-500 p-3">
            현재 사용중인 아이템이 없어요,
            <br />
            새로운 아이템을 등록해 주세요.
          </div>
        )}
      </div>
      <div className="flex w-full text-white text-center lg:justify-end pt-2">
        <div
          id="create_item"
          className="p-2 w-full lg:w-fit text-white rounded-lg cursor-pointer flex items-center justify-center bg-blue-500"
          onClick={handleButton}
        >
          <AddIcon fontSize="small" />
          <div className="flex text-center items-center"></div>
          아이템 추가
        </div>
      </div>
    </>
  );
};

export default ProductList;
