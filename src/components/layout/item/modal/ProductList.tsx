import { ProductListArgs, ProductsArgs } from "@/lib/item/types";
import { theadStyle, tbodyStyle } from "@/interfaces/tailwindCss";
import { useScrollPosition } from "@/lib/infinitescrollFunctions";
import { fetchGetProductCodeList } from "@/lib/item/apis";
import InputTextBox from "@/components/base/InputText";
import Modal from "@/components/layout/base/Modal";
import { GetServerSidePropsContext } from "next";
import { CircularProgress } from "@mui/material";
import { PBApiResponse } from "@/lib/types";
import { useEffect, useState } from "react";

interface ProductListProps {
  page: number;
  page_size: number;
  apiResponse: PBApiResponse;
  currentProductItemList: ProductsArgs[];
  newProductItemList: ProductsArgs[];
  setNewProductItemList: React.Dispatch<React.SetStateAction<ProductsArgs[]>>;
  isOpen: boolean;
  onClose: () => void;
}

enum searchType {
  N = "name",
  G = "gid",
}

const ProductList: React.FC<ProductListProps> = (
  {
    page,
    page_size,
    apiResponse,
    currentProductItemList,
    newProductItemList,
    setNewProductItemList,
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

  const [beforeAddingItemList, setBeforeAddingItemList] = useState<
    ProductsArgs[]
  >(currentProductItemList); // before update the products
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

  useEffect(() => {
    if (isOpen) {
      setBeforeAddingItemList(currentProductItemList);
    }
  }, [isOpen]);

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
      setBeforeAddingItemList((prev) => [...prev, ...allProducts]);
    } else {
      setBeforeAddingItemList([]);
    }
  };

  const handleCheckboxChange =
    (productGid: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      const product = products.find((p) => p.gid === productGid);
      if (!product) return;

      const productData: ProductsArgs = {
        product_model_code: product.gid,
        product_model_name: product.name,
        images: [
          { posThumb: product.posThumb || "" },
          { thumb: product.thumb || "" },
        ],
      };

      setBeforeAddingItemList((prev) =>
        isChecked
          ? prev.some((item) => item.product_model_code === productGid)
            ? prev
            : [...prev, productData]
          : prev.filter((item) => item.product_model_code !== productGid),
      );
    };

  const handleAction = () => {
    if (confirm("해당 상품을 선택 하시겠어요?")) {
      setNewProductItemList(beforeAddingItemList);
      setBeforeAddingItemList([]);
      onClose();
    }
  };

  useEffect(() => {
    if (
      !Array.isArray(currentProductItemList) ||
      !Array.isArray(newProductItemList)
    )
      return;

    const combinedItems = [...currentProductItemList];
    const uniqueItemsMap = new Map<string, ProductsArgs>();
    combinedItems.forEach((item) => {
      uniqueItemsMap.set(item.product_model_code, item);
    });

    const mergedUniqueItems = Array.from(uniqueItemsMap.values());

    setBeforeAddingItemList(mergedUniqueItems);
  }, [newProductItemList]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="w-full pb-[5px] text-left text-[18px] font-bold">
          상품 선택
        </h1>
        <div className="my-2 flex max-h-[550px] min-w-[350px] flex-col items-center lg:max-w-full">
          <div className="flex w-[380px] flex-col rounded-lg bg-white p-[10px]">
            <h1 className="w-full pb-[5px] text-left text-[13px] font-semibold text-gray-500">
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
              <InputTextBox
                disabled={false}
                type="text"
                id="coupon_id"
                placeholder="검색어를 입력해주세요"
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
                className="w-[70px] rounded-lg bg-blue-500 px-2 py-1 text-center text-white hover:bg-blue-600"
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
                            checked={beforeAddingItemList.some(
                              (item) => item.product_model_code === product.gid,
                            )}
                            onChange={handleCheckboxChange(product.gid)}
                          />
                        </td>
                        <td className={tbodyStyle + " w-[75px]"}>
                          {product.gid}
                        </td>
                        <td className={tbodyStyle + " w-[85px]"}>
                          <div className="flex w-full items-center justify-center text-center">
                            <img
                              src={
                                product.thumb ||
                                "/images/kakao/kakaolink-no-logo-default.png"
                              }
                              className="h-[45px] w-[45px] lg:h-[60px] lg:w-[60px]"
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
        <div className="w-full gap-[5px] text-left">
          <p className="text-[12px]">
            최종 선택된 상품
            <div className="mb-1 text-[11px] text-gray-600">
              <span className="inline-block rounded-md bg-blue-200 px-1">
                이전 선택
              </span>
              {"   "}
              <span className="inline-block rounded-md bg-green-200 px-1">
                신규 선택
              </span>
            </div>
          </p>
          <div className="flex h-[100px] w-[380px] flex-wrap gap-[5px] overflow-y-auto rounded-lg border border-gray-400 bg-gray-100 p-[5px]">
            {beforeAddingItemList.map((item) => {
              const isFromCurrent = currentProductItemList.some(
                (curr) => curr.product_model_code === item.product_model_code,
              );

              return (
                <div
                  key={item.product_model_code}
                  className={`flex h-fit items-center justify-center gap-[5px] rounded-lg border p-[5px] text-[10px] ${
                    isFromCurrent ? "bg-blue-200" : "bg-green-200"
                  }`}
                >
                  <p>{item.product_model_code}</p>
                  <button
                    onClick={() =>
                      setBeforeAddingItemList((prev) =>
                        prev.filter(
                          (product) =>
                            product.product_model_code !==
                            item.product_model_code,
                        ),
                      )
                    }
                    className="flex h-[15px] w-[15px] items-center justify-center rounded bg-blue-400 text-center text-white"
                  >
                    <p>X</p>
                  </button>
                </div>
              );
            })}
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
