import { ApiResponse } from "@/lib/types";
import { useMemo, useState, useEffect } from "react";
import { CouponListArgs, CouponsArgs, RewardsArgs } from "@/lib/item/types";
import Modal from "@/components/layout/base/Modal";

interface CouponListProps {
  apiResponse?: ApiResponse;
  couponInputs: CouponsArgs[];
  setCouponInputs: (value: CouponsArgs[]) => void;
  setSelectedCouponItems: (value: CouponsArgs[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CouponList: React.FC<CouponListProps> = ({
  apiResponse,
  couponInputs,
  setCouponInputs,
  setSelectedCouponItems,
  isOpen,
  onClose,
}) => {
  const coupons = useMemo(
    () =>
      Array.isArray(apiResponse?.data.data.content)
        ? apiResponse.data.data.content
        : [],
    [apiResponse],
  );
  const [selectedItemList, setSelectedItemList] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  useEffect(() => {
    if (selectedItemList.length === coupons.length && coupons.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
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
    setSelectAll(isChecked);
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

  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 text-sm border-b border-gray-200 whitespace-normal break-words break-all text-center";
  const labelClass = "text-xs pt-4 text-gray-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="w-full pb-2 text-left text-xl font-bold">쿠폰 선택</h1>

        <div className="my-2 flex max-h-[550px] max-w-[370px] flex-col items-center overflow-y-scroll lg:max-w-full">
          <div className="flex flex-col rounded-lg bg-white p-3">
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
