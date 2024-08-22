import React, { useState, useEffect, KeyboardEvent } from "react";
import InputTextBox from "@/components/base/InputText";
import { RewardArgs, RewardType } from "@/pages/item/lib/types";

interface NewRewardComponentProps {
  setRewards: (value: RewardArgs[]) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  reward_type: RewardType;
  couponInputs: RewardArgs[];
  pointInputs: RewardArgs[];
  setCouponInputs: (value: RewardArgs[]) => void;
  setPointInputs: (value: RewardArgs[]) => void;
}

const NewRewardComponent: React.FC<NewRewardComponentProps> = ({
  setRewards,
  handleKeyDown,
  reward_type,
  couponInputs,
  pointInputs,
  setCouponInputs,
  setPointInputs,
}) => {
  useEffect(() => {
    // Initialize with a single coupon input if no inputs are present
    if (couponInputs.length === 0 && pointInputs.length === 0) {
      setCouponInputs([{ reward_type: RewardType.CO, coupon_code: "" }]);
    }
  }, []);

  const handleAddInput = () => {
    if (reward_type === RewardType.CO) {
      setCouponInputs([...couponInputs, { reward_type: RewardType.CO, coupon_code: "" }]);
    } else if (reward_type === RewardType.PO) {
      setPointInputs([...pointInputs, { reward_type: RewardType.PO, point_amount: 0 }]);
    }
  };

  const handleDeleteInput = (type: RewardType, index: number) => {
    if (type === RewardType.CO) {
      const updatedInputs = couponInputs.filter((_, i) => i !== index);
      setCouponInputs(updatedInputs.length > 0 ? updatedInputs : couponInputs);
      setRewards(updatedInputs.length > 0 ? updatedInputs : couponInputs);
    } else if (type === RewardType.PO) {
      const updatedInputs = pointInputs.filter((_, i) => i !== index);
      setPointInputs(updatedInputs.length > 0 ? updatedInputs : pointInputs);
      setRewards(updatedInputs.length > 0 ? updatedInputs : pointInputs);
    }
  };

  const handleInputChange = (value: string | number, index: number, type: RewardType) => {
    if (type === RewardType.CO) {
      const updatedInputs = [...couponInputs];
      updatedInputs[index] = { ...updatedInputs[index], coupon_code: value as string };
      setCouponInputs(updatedInputs);
      setRewards(updatedInputs);
    } else if (type === RewardType.PO) {
      const updatedInputs = [...pointInputs];
      updatedInputs[index] = { ...updatedInputs[index], point_amount: Number(value) };
      setPointInputs(updatedInputs);
      setRewards(updatedInputs);
    }
  };

  return (
    <>
      <div className="inputForm flex flex-col w-full">
        <div className="flex items-center mb-2">
          <label className="text-md font-bold flex-grow">{reward_type === RewardType.CO ? "쿠폰" : "포인트"}</label>
          <div
            id="create_item_container"
            className="border p-1 bg-blue-500 text-white rounded-lg min-w-[45px] text-center cursor-pointer"
            onClick={handleAddInput}
          >
            추가
          </div>
        </div>

        <div className="contents-container w-full flex flex-col">
          {/* Coupon Inputs */}
          {couponInputs.map((input, index) => (
            <div key={index} className="flex items-center w-full mb-2">
              <InputTextBox
                type="text"
                id={`coupon_code_${index}`}
                placeholder="쿠폰 코드를 입력하세요."
                value={input.coupon_code || ""}
                onChange={(e) => handleInputChange(e.target.value, index, RewardType.CO)}
                onKeyDown={(e) => handleKeyDown(e)}
              />
              <div
                id="delete_item_container"
                className={`ml-2 p-1 rounded-lg min-w-[45px] text-center cursor-pointer text-white ${
                  couponInputs.length === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
                }`}
                onClick={() => handleDeleteInput(RewardType.CO, index)}
                style={{ pointerEvents: couponInputs.length === 1 ? "none" : "auto" }}
              >
                삭제
              </div>
            </div>
          ))}

          {/* Point Inputs */}
          {pointInputs.map((input, index) => (
            <div key={index} className="flex items-center w-full mb-2">
              <InputTextBox
                type="number"
                id={`point_amount_${index}`}
                placeholder="포인트 금액을 입력하세요."
                value={input.point_amount || ""}
                onChange={(e) => handleInputChange(e.target.value, index, RewardType.PO)}
                onKeyDown={(e) => handleKeyDown(e)}
              />
              <div
                id="delete_item_container"
                className={`ml-2 p-1 rounded-lg min-w-[45px] text-center cursor-pointer text-white ${
                  pointInputs.length === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
                }`}
                onClick={() => handleDeleteInput(RewardType.PO, index)}
                style={{ pointerEvents: pointInputs.length === 1 ? "none" : "auto" }}
              >
                삭제
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewRewardComponent;
