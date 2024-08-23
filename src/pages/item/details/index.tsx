import React, { useState, useEffect, KeyboardEvent } from "react";
import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";
import { RewardArgs, RewardType } from "@/pages/item/lib/types";

interface RewardComponentProps {
  setRewards: (value: RewardArgs[]) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  reward_type: RewardType;
  couponInputs: RewardArgs[];
  pointInputs: RewardArgs[];
  setReward_Type: (value: RewardType) => void;
  setCouponInputs: (value: RewardArgs[]) => void;
  setPointInputs: (value: RewardArgs[]) => void;
}

const RewardComponent: React.FC<RewardComponentProps> = ({
  setRewards,
  handleKeyDown,
  reward_type,
  couponInputs,
  pointInputs,
  setReward_Type,
  setCouponInputs,
  setPointInputs,
}) => {
  useEffect(() => {
    if (couponInputs.length === 0 && pointInputs.length === 0) {
      setCouponInputs([{ reward_type: RewardType.CO, coupon_code: "" }]);
    }
  }, []);

  const handleRewardTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReward_Type(e.target.value as RewardType);
  };

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
      <div className="inputForm flex flex-col text-left w-full mb-2">
        <label className="text-md font-bold my-4">리워드 종류</label>
        <div className="flex justify-between w-[250px] lg:w-[300px]">
          <InputRadioBox
            label="쿠폰"
            name="reward_type"
            value={RewardType.CO}
            checked={reward_type === RewardType.CO}
            onChange={handleRewardTypeRadioChange}
          />
          <InputRadioBox
            label="포인트"
            name="reward_type"
            value={RewardType.PO}
            checked={reward_type === RewardType.PO}
            onChange={handleRewardTypeRadioChange}
          />
          <div
            id="create_item_container"
            className="border my-2 p-1 bg-blue-500 text-white rounded-lg w-[50px] text-center cursor-pointer"
            onClick={handleAddInput}
          >
            추가
          </div>
        </div>
      </div>

      <div className="contents-container w-full justify-center">
        {/* Coupon Inputs */}
        {couponInputs.map((input, index) => (
          <div key={index} className="inputForm flex items-center w-full mb-2 text-left">
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
              className={`ml-2 p-1 rounded-lg w-[50px] text-center cursor-pointer text-white ${
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
          <div key={index} className="inputForm flex items-center w-full mb-2 text-left">
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
              className={`ml-2 p-1 rounded-lg w-[50px] text-center cursor-pointer text-white ${
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
    </>
  );
};

export default RewardComponent;
