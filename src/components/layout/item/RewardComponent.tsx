import React, { useState, KeyboardEvent } from "react";
import { CouponsArgs, ItemType, RewardsArgs, RewardType } from "@/lib/item/types";
import InputRadioBox from "@/components/base/InputRadio";
import CouponList from "@/components/layout/item/CouponList";
import { ApiResponse } from "@/lib/types";
import InputTextBox from "@/components/base/InputText";

interface RewardComponentProps {
  apiResponse: ApiResponse;
  setCouponInputs: (value: CouponsArgs[]) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  setSelectedCouponItems: (value: CouponsArgs[]) => void;
  reward_type: RewardType;
  selectedCouponItems: CouponsArgs[];
  couponInputs: CouponsArgs[];
  setRewardType: (value: RewardType) => void;
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
  disableInput: boolean;
}

const RewardComponent: React.FC<RewardComponentProps> = ({
  apiResponse,
  setSelectedCouponItems,
  setCouponInputs,
  disableInput,
  handleKeyDown,
  reward_type,
  selectedCouponItems,
  couponInputs,
  setRewardType,
}) => {
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-2";
  const radioButtonLabelClass = "text-xs pt-4 pb-2 text-gray-500";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleRewardTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRewardType(e.target.value as RewardType);
  };
  const closeModal = () => setIsModalOpen(false);
  const openModal = () => (reward_type ? setIsModalOpen(true) : alert("리워드 종류를 선택해주세요."));
  const handleInputChange = (value: string) => {};

  const labelClass = "text-xs pt-4 text-gray-500";
  return (
    <>
      <div className="flex flex-col w-full h-fit">
        <h1 className="font-bold text-xl pb-2 border-b-[1px]">리워드</h1>
        <div className={inputFormClass}>
          <label className={radioButtonLabelClass}>리워드 종류</label>
          <div className="flex h-[42px] items-center w-full ">
            <div className="flex space-x-20 text-left w-full lg:max-w-[458px]">
              <InputRadioBox
                label="쿠폰"
                name="reward_type"
                value={RewardType.CO}
                checked={reward_type === RewardType.CO}
                onChange={handleRewardTypeRadioChange}
                disabled={disableInput}
              />
              <InputRadioBox
                label="포인트"
                name="reward_type"
                value={RewardType.PO}
                checked={reward_type === RewardType.PO}
                onChange={handleRewardTypeRadioChange}
                disabled={disableInput}
              />

              <button
                id="create_item_container"
                className={`border p-1 ${
                  disableInput ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 cursor-pointer"
                }  text-white rounded-lg min-w-[45px] text-center `}
                onClick={openModal}
                disabled={disableInput}
              >
                추가
              </button>
            </div>
          </div>
          <div className="contents-container w-full justify-between pb-4">
            {reward_type === RewardType.CO && (
              <div className="flex flex-col w-[350px] lg:w-[450px] h-fit">
                <div className="flex flex-col w-full mb-2 text-left">
                  <label className={labelClass}>선택된 쿠폰</label>
                  <div className="w-[350px] lg:w-full h-[85px] text-sm mt-2 break-words flex flex-wrap justify-center bg-gray-100 rounded-xl p-2 pb-3 overflow-y-auto">
                    {selectedCouponItems.length !== 0 ? (
                      couponInputs.map((inputCoupon) => {
                        return (
                          inputCoupon && (
                            <div
                              key={inputCoupon.coupon_code}
                              className="mr-1 mt-1 p-1 w-fit h-fit text-sm text-white bg-blue-300 rounded-md"
                            >
                              {inputCoupon.coupon_name}
                            </div>
                          )
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
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
            )}
            {reward_type === RewardType.PO && (
              <>
                <div className="flex flex-col w-full h-fit">
                  <div className={inputFormClass}>
                    <label className={labelClass}>포인트</label>
                    <InputTextBox
                      type="text"
                      id={`promotion_description`}
                      placeholder="포인트를 입력해 주세요."
                      value={""}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e)}
                      disabled={disableInput}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <CouponList
        apiResponse={apiResponse}
        setSelectedCouponItems={setSelectedCouponItems}
        setCouponInputs={setCouponInputs}
        couponInputs={couponInputs}
        onClose={closeModal}
        isOpen={isModalOpen}
      />
    </>
  );
};

export default RewardComponent;
