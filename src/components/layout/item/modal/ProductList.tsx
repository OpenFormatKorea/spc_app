import { PBApiResponse } from "@/lib/types";
import { useEffect, useState } from "react";
import { ProductListArgs, ProductsArgs } from "@/lib/item/types";
import Modal from "@/components/layout/base/Modal";
import { theadStyle, tbodyStyle } from "@/interfaces/tailwindCss";
import { useScrollPosition } from "@/lib/infinitescrollFunctions";
import { fetchGetProductCodeList } from "@/lib/item/apis";
import { GetServerSidePropsContext } from "next";
import { CircularProgress } from "@mui/material";

interface ProductListProps {
  apiResponse: PBApiResponse;
  page: number;
  page_size: number;
  productInputs: ProductsArgs[];
  selectedProductItems: ProductsArgs[];
  setProductInputs: (value: ProductsArgs[]) => void;
  setSelectedProductItems: (value: ProductsArgs[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

enum searchType {
  N = "name",
  G = "gid",
}

const ProductList: React.FC<ProductListProps> = (
  {
    apiResponse,
    page,
    page_size,
    productInputs,
    setProductInputs,
    selectedProductItems,
    setSelectedProductItems,
    isOpen,
    onClose,
  },
  context: GetServerSidePropsContext,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [newResponse, setNewResponse] = useState<PBApiResponse>(apiResponse);

  const [pageNum, setPageNum] = useState<number>(page);
  const [searchOption, setSearchOption] = useState<searchType>(searchType.G);
  const [search, setSearch] = useState("");
  const [selectedItemList, setSelectedItemList] = useState<string[]>([]); // before update the products

  const [products, setProducts] = useState<ProductListArgs[]>(
    newResponse.data?.content || [],
  );

  // infinite scroll + search
  const { isBottom, scrollRef } = useScrollPosition(isOpen);
  const [getNextPage, setGetNextPage] = useState(
    !newResponse.data.last || false,
  );

  const fetchProducts = async (reset = false) => {
    if (!getNextPage && !reset) return;
    setIsLoading(true);

    try {
      const currentPage = reset ? 1 : pageNum + (pageNum === 0 ? 2 : 1);
      const response = await fetchGetProductCodeList(
        currentPage,
        page_size,
        searchOption,
        search,
        context,
      );

      if (response.data) {
        setNewResponse(response);
        setGetNextPage(!response.data.last);
        setProducts((prev) =>
          reset ? response.data.content : [...prev, ...response.data.content],
        );
        setPageNum(currentPage);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchforSearch = () => fetchProducts(true); // 검색
  const fetchNextPage = () => fetchProducts(); // 다음 무한 스크롤 페이지

  useEffect(() => {
    if (isBottom) fetchNextPage();
  }, [isBottom]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allProducts: ProductsArgs[] = products.map((product) => ({
        product_model_code: product.gid,
        product_model_name: product.name,
        images: [
          { posThumb: product.posThumb || "" },
          { thumb: product.thumb || "" },
        ],
      }));
      setProductInputs(allProducts);
      setSelectedItemList(products.map((product) => product.gid));
    } else {
      setProductInputs([]);
      setSelectedItemList([]);
    }
  };

  const handleCheckboxChange =
    (productGid: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;

      setSelectedItemList((prevSelected) => {
        // Ensure `selectedProductItems` is always an array before using `.some()`
        const isAlreadySelected =
          Array.isArray(selectedProductItems) &&
          selectedProductItems.some(
            (item) => item.product_model_code === productGid,
          );

        // Ensure that the product is added only if it's checked and NOT already in selectedProductItems
        const shouldAdd = isChecked && !isAlreadySelected;

        const updatedSelectedItems = shouldAdd
          ? [...prevSelected, productGid] // Add only the GID
          : prevSelected.filter((gid) => gid !== productGid);

        const updatedProducts: ProductsArgs[] = products
          .filter((product) => updatedSelectedItems.includes(product.gid))
          .map((product) => ({
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

  const handleAction = () => {
    if (confirm("해당 상품을 선택 하시겠어요?")) {
      setSelectedProductItems(productInputs);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="w-full pb-2 text-left text-xl font-bold">상품 선택</h1>

        <div className="my-2 flex max-h-[550px] w-full flex-col items-center lg:max-w-full">
          <div className="flex w-full flex-col rounded-lg bg-white p-[10px]">
            <h1 className="text-md w-full pb-2 text-left font-semibold text-gray-500">
              상품을 선택해 주세요
            </h1>

            <div className="items-bottom flex w-full justify-start gap-[10px] pb-[10px]">
              <select
                className="w-[100px] border-b border-b-gray-300 px-[10px] py-[5px] text-[14px] text-gray-600"
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value as searchType)}
              >
                <option value={searchType.G}>상품코드</option>
                <option value={searchType.N}>상품명</option>
              </select>
              <input
                className="w-[50%] border-b border-b-gray-300 px-[10px] py-[5px] text-[14px]"
                placeholder="코드 또는 상품명을 검색해주세요"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchforSearch();
                  }
                }}
              />
              <button
                onClick={fetchforSearch}
                className="rounded-lg bg-blue-500 px-2 py-1 text-center text-white hover:bg-blue-600"
              >
                검색
              </button>
            </div>

            <div
              ref={scrollRef}
              className="block h-[400px] w-full overflow-y-scroll"
            >
              <table className="table w-full border border-gray-100 text-center">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={theadStyle}>
                      <input
                        type="checkbox"
                        id="item_all"
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
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.gid}>
                        <td className={`${tbodyStyle} px-2`}>
                          <input
                            type="checkbox"
                            id={`item_${product.gid}`}
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
                    ))
                  ) : (
                    <tr>
                      <td className={tbodyStyle} colSpan={4}>
                        현재 추가가능한 상품이 없어요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-10">
                  <CircularProgress />
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
