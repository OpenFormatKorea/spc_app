import { ApiResponse } from "@/lib/types";
import { useState, useEffect } from "react";
import { CouponListArgs, CouponsArgs } from "@/lib/item/types";
import Modal from "@/components/layout/base/Modal";
import InputTextBox from "@/components/base/InputText";
import { fetchSearchCoupon } from "@/lib/item/apis";
import { GetServerSidePropsContext } from "next";
import { theadStyle, tbodyStyle, labelClass } from "@/interfaces/tailwindCss";
import { useScrollPosition } from "@/lib/infinitescrollFunctions";
import { CircularProgress } from "@mui/material";
import { before } from "node:test";

interface CouponListProps {
  apiResponse: ApiResponse;
  page: number;
  page_size: number;
  currentCouponList: CouponsArgs[];
  newCouponList: CouponsArgs[];
  setNewCouponList: (value: CouponsArgs[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

enum searchType {
  N = "name",
  C = "cpnid",
}

const CouponList: React.FC<CouponListProps> = (
  {
    page,
    page_size,
    apiResponse,
    currentCouponList,
    newCouponList,
    setNewCouponList,
    isOpen,
    onClose,
  },
  context: GetServerSidePropsContext,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [newResponse, setNewResponse] = useState<ApiResponse>(apiResponse);

  const [pageNum, setPageNum] = useState<number>(page);
  const [searchOption, setSearchOption] = useState<searchType>(searchType.N);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [searchSort, setSearchSort] = useState("");
  // const [selectedItemList, setSelectedItemList] = useState<string[]>([]);

  const [beforeAddingCouponList, setBeforeAddingCouponList] =
    useState<CouponsArgs[]>(currentCouponList); // before update the coupons
  const [coupons, setCoupons] = useState<CouponListArgs[]>(
    newResponse.data?.content || [],
  );

  const { isBottom, scrollRef } = useScrollPosition(isOpen);
  const [getNextPage, setGetNextPage] = useState(
    !newResponse.data.last || false,
  );

  const fetchCoupons = async (reset = false) => {
    if (!getNextPage && !reset) return;
    setIsLoading(true);

    try {
      const currentPage = reset ? 1 : pageNum + (pageNum === 0 ? 2 : 1);
      const response = await fetchSearchCoupon(
        currentPage,
        page_size,
        searchKeyword,
        searchOption,
        searchSort,
        context,
      );

      if (response.data) {
        setNewResponse(response);
        setGetNextPage(!response.data.last);
        setCoupons((prev) =>
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
  const fetchforSearch = () => fetchCoupons(true); // 검색
  const fetchNextPage = () => fetchCoupons(); // 다음 무한 스크롤 페이지

  useEffect(() => {
    if (isBottom) fetchNextPage();
  }, [isBottom]);

  useEffect(() => {
    if (isOpen) {
      setBeforeAddingCouponList(currentCouponList);
    }
  }, [isOpen]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      const allProducts = coupons.map((coupon: CouponListArgs) => ({
        coupon_code: coupon.cpnId,
        coupon_name: coupon.name,
        coupon_title: coupon.name,
      }));
      setBeforeAddingCouponList(allProducts);
      // setSelectedItemList(
      //   coupons.map((coupon: CouponListArgs) => coupon.cpnId),
      // );
    } else {
      setBeforeAddingCouponList([]);

      // setSelectedItemList([]);
    }
    setSelectAll(isChecked);
  };

  const handleCheckboxChange =
    (couponCpnId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      const coupon = coupons.find((c) => c.cpnId === couponCpnId);
      if (!coupon) return;

      const couponData: CouponsArgs = {
        coupon_code: coupon.cpnId,
        coupon_name: coupon.name,
      };
      setBeforeAddingCouponList((prev) =>
        isChecked
          ? prev.some((item) => item.coupon_code === couponCpnId)
            ? prev
            : [...prev, couponData]
          : prev.filter((item) => item.coupon_code !== couponCpnId),
      );
    };

  const handleAction = () => {
    if (beforeAddingCouponList.length === 0) {
      alert("선택된 쿠폰이 없습니다. 쿠폰을 선택해 주세요. ");
      return;
    }
    if (confirm("해당 쿠폰을 선택 하시겠어요?")) {
      setNewCouponList(beforeAddingCouponList);
      setBeforeAddingCouponList([]);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="w-full pb-[5px] text-left text-[18px] font-bold">
          쿠폰 선택
        </h1>
        <div className="my-2 flex max-h-[550px] min-w-[350px] flex-col items-center lg:max-w-full">
          <div className="flex w-[380px] flex-col rounded-lg bg-white p-[10px]">
            <h1 className="w-full pb-[5px] text-left text-[13px] font-semibold text-gray-500">
              쿠폰을 선택해 주세요
            </h1>
            <div className="flex w-full justify-start gap-[10px] pb-[10px]">
              <select
                className="w-[100px] border-b border-b-gray-300 px-[10px] py-[5px] text-[14px] text-gray-600"
                name="coupon"
                id="coupon"
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value as searchType)}
              >
                <option value={searchType.C}>아이디</option>
                <option value={searchType.N}>이름</option>
              </select>
              <InputTextBox
                disabled={false}
                type="text"
                id="coupon_id"
                placeholder="검색어를 입력해주세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
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
              className="block h-[400px] w-full overflow-y-scroll border border-gray-100"
            >
              <table className="table w-full border border-gray-100 text-center">
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
                    <th
                      className={`${theadStyle} ${searchSort === "name" ? "font-bold" : "font-normal"}`}
                      id="name_sort"
                    >
                      쿠폰 ID
                    </th>
                    <th
                      className={`${theadStyle} ${searchSort === "cpn_id" ? "font-bold" : "font-normal"}`}
                      id="cpn_id_sort"
                    >
                      쿠폰 명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon: CouponListArgs) => (
                    <tr>
                      <td className={tbodyStyle}>
                        <input
                          type="checkbox"
                          id={`item_${coupon.cpnId}`}
                          name={`item_${coupon.cpnId}`}
                          checked={beforeAddingCouponList.some(
                            (item) => item.coupon_code === coupon.cpnId,
                          )}
                          onChange={handleCheckboxChange(coupon.cpnId)}
                        />
                      </td>
                      <td className={`${tbodyStyle} p-2`}>
                        {coupon.cpnId.toLocaleString()}
                      </td>
                      <td className={`${tbodyStyle} max-w-[200px] p-2`}>
                        {coupon.name}
                      </td>
                    </tr>
                  ))}
                  {!coupons.length && (
                    <tr>
                      <td className={tbodyStyle} colSpan={6}>
                        현재 등록가능한 쿠폰이 없어요.
                        {/* <button
                          className="w-[60px] rounded-lg bg-blue-500 p-2 text-white"
                          onClick={fetchforSearch}
                        >
                          페이지 추가
                        </button> */}
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
        <div className="flex h-fit w-[380px] flex-col items-center justify-center gap-[5px] lg:w-[450px]">
          <div className="flex w-full flex-col items-center gap-[5px]">
            <label className={labelClass + " flex w-full text-left"}>
              선택된 쿠폰
            </label>
            <div className="flex h-[80px] w-full flex-wrap justify-start overflow-y-auto break-words rounded-lg bg-white p-[8px] text-[14px]">
              {beforeAddingCouponList.length !== 0 ? (
                beforeAddingCouponList.map((item) => {
                  const coupon = coupons.find(
                    (coupon: CouponListArgs) =>
                      coupon.cpnId === item.coupon_code,
                  );
                  return (
                    coupon && (
                      <div
                        key={coupon.cpnId}
                        className="m-[2px] h-fit w-fit rounded-md bg-blue-300 p-[4px] text-[12px] text-white"
                      >
                        {coupon.cpnId} - {coupon.name}
                      </div>
                    )
                  );
                })
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center text-gray-600">
                    선택된 쿠폰이 없습니다.
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
          쿠폰 추가
        </button>
      </div>
    </Modal>
  );
};

export default CouponList;
