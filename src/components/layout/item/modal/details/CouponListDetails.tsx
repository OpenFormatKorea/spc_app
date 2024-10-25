import { ApiResponse } from "@/lib/types";
import { useMemo, useState, useEffect, useRef, KeyboardEvent } from "react";
import { CouponListArgs, CouponsArgs, RewardsArgs } from "@/lib/item/types";
import Modal from "@/components/layout/base/Modal";
import InputTextBox from "@/components/base/InputText";
import { fetchSearchCoupon } from "@/lib/item/apis";
import { GetServerSidePropsContext } from "next";

interface CouponListProps {
  apiResponse?: ApiResponse;
  couponInputs: CouponsArgs[];
  setCouponInputs: (value: CouponsArgs[]) => void;
  setSelectedCouponItems: (value: CouponsArgs[]) => void;
  isOpen: boolean;
  onClose: () => void;
  rewards: RewardsArgs[];
}

const CouponList: React.FC<CouponListProps> = (
  {
    apiResponse,
    couponInputs,
    setCouponInputs,
    setSelectedCouponItems,
    isOpen,
    onClose,
    rewards,
  },
  context: GetServerSidePropsContext,
) => {
  const [couponResponse, setCouponResponse] = useState<ApiResponse | undefined>(
    apiResponse,
  );
  const coupons = useMemo(() => {
    try {
      if (Array.isArray(couponResponse?.data.data.content)) {
        return couponResponse.data.data.content.filter(
          (coupon: CouponListArgs) =>
            !rewards.some(
              (reward: RewardsArgs) =>
                reward.coupon_code === coupon.cpnId.toString(),
            ),
        );
      }
      return [];
    } catch (error) {
      console.error("Error filtering coupons:", error);
      return [];
    }
  }, [couponResponse, rewards]);

  const [selectedItemList, setSelectedItemList] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchFilter, setSearchFilter] = useState("name");

  useEffect(() => {
    const matchedCoupons = coupons.filter((coupon: CouponListArgs) =>
      rewards.some(
        (reward: RewardsArgs) => reward.coupon_code === coupon.cpnId.toString(),
      ),
    );

    const matchedCouponIds = matchedCoupons.map(
      (coupon: CouponListArgs) => coupon.cpnId,
    );

    setSelectedItemList(matchedCouponIds);

    const selectedCouponInputs = matchedCoupons.map(
      (coupon: CouponListArgs) => ({
        coupon_code: coupon.cpnId,
        coupon_name: coupon.name,
      }),
    );

    setCouponInputs(selectedCouponInputs);
  }, [coupons, rewards, setCouponInputs]);

  useEffect(() => {
    setSelectAll(
      selectedItemList.length === coupons.length && coupons.length > 0,
    );
  }, [selectedItemList, coupons]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      const allProducts = coupons.map((coupon: CouponListArgs) => ({
        coupon_code: coupon.cpnId,
        coupon_name: coupon.name,
      }));
      setCouponInputs(allProducts);
      setSelectedItemList(
        coupons.map((coupon: CouponListArgs) => coupon.cpnId),
      );
    } else {
      setCouponInputs([]);
      setSelectedItemList([]);
    }
  };

  const handleCheckboxChange =
    (couponCpnId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setSelectedItemList((prevSelected: string[]) => {
        let updatedSelectedItems: string[];
        if (isChecked) {
          updatedSelectedItems = [...prevSelected, couponCpnId];
        } else {
          updatedSelectedItems = prevSelected.filter(
            (cpnId) => cpnId !== couponCpnId,
          );
        }
        const updatedCoupons = coupons
          .filter((coupon: CouponListArgs) =>
            updatedSelectedItems.includes(coupon.cpnId),
          )
          .map((coupon: CouponListArgs) => ({
            coupon_code: coupon.cpnId,
            coupon_name: coupon.name,
          }));
        setCouponInputs(updatedCoupons);
        setSelectAll(updatedSelectedItems.length === coupons.length);
        return updatedSelectedItems;
      });
    };

  const handleAction = async () => {
    if (confirm("해당 쿠폰을 선택 하시겠어요?")) {
      setSelectedCouponItems(couponInputs);
      onClose();
    }
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  const handleSearch = () => {
    const searchResponse = fetchSearchCoupon(
      searchKeyword,
      searchFilter,
      context,
    );
    searchResponse
      .then((response) => {
        console.log("data", response);
        setCouponResponse(response);
      })
      .catch((error) => {
        console.error("검색 중 오류가 생겼습니다:", error);
      });
  };
  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 text-sm border-b border-gray-200 whitespace-normal break-words break-all text-center";
  const labelClass = "text-xs pt-4 text-gray-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="w-full pb-2 text-left text-xl font-bold">
          현재 추가 가능한 쿠폰 선택
        </h1>

        <div className="my-2 flex max-h-[550px] w-full max-w-[370px] flex-col items-center overflow-y-scroll lg:max-w-full">
          <div className="flex w-full flex-col rounded-lg bg-white p-3">
            <h1 className="text-md w-full pb-2 text-left font-semibold text-gray-500">
              쿠폰을 선택해 주세요
            </h1>
            <div className="flex gap-2">
              <select
                name="coupon"
                id="coupon"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              >
                <option value="cpnId">아이디</option>
                <option value="name">이름</option>
              </select>
              <InputTextBox
                disabled={false}
                type="text"
                id="coupon_id"
                placeholder="검색어를 입력해주세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="w-[60px] rounded-lg bg-blue-500 p-2 text-white"
                onClick={handleSearch}
              >
                검색
              </button>
            </div>
            <div className="block w-full py-3">
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
                    <th className={theadStyle}>쿠폰 ID</th>
                    <th className={theadStyle}>쿠폰 명</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon: CouponListArgs) => (
                    <tr key={coupon.cpnId}>
                      <td className={`${tbodyStyle} px-2`}>
                        <input
                          type="checkbox"
                          id={`item_${coupon.cpnId}`}
                          name={`item_${coupon.cpnId}`}
                          checked={selectedItemList.includes(coupon.cpnId)}
                          onChange={handleCheckboxChange(coupon.cpnId)}
                        />
                      </td>
                      <td className={tbodyStyle}>{coupon.cpnId}</td>
                      <td className={tbodyStyle}>{coupon.name}</td>
                    </tr>
                  ))}
                  {!coupons.length && (
                    <tr>
                      <td className={tbodyStyle} colSpan={6}>
                        현재 등록가능한 쿠폰이 없어요.
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
            <label className={labelClass}>선택된 쿠폰</label>
            <div className="mt-2 flex h-[85px] w-[350px] flex-wrap justify-center overflow-y-auto break-words rounded-xl bg-white p-2 pb-3 text-sm lg:w-full">
              {couponInputs.length !== 0 ? (
                couponInputs.map((inputCoupon) => {
                  const coupon = coupons.find(
                    (coupon: CouponListArgs) =>
                      coupon.cpnId === inputCoupon.coupon_code,
                  );
                  return (
                    coupon && (
                      <div
                        key={coupon.cpnId}
                        className="mr-1 mt-1 h-fit w-fit rounded-md bg-blue-300 p-1 text-sm text-white"
                      >
                        {coupon.name}
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
