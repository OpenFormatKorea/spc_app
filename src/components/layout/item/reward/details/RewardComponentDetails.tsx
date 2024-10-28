import React, { useState, KeyboardEvent } from "react";
import { CouponsArgs, RewardsArgs, RewardType } from "@/lib/item/types";
import { ApiResponse } from "@/lib/types";
import RewardModalDetails from "@/components/layout/item/reward/details/RewardModalDetails";
import RewardCurrentCardDetails from "@/components/layout/item/reward/details/RewardCurrentCardDetails";
import CouponListDetails from "@/components/layout/item/modal/details/CouponListDetails";

interface RewardComponentDetailsProps {
  apiResponse?: ApiResponse;
  disableInput: boolean;
  rewards: RewardsArgs[];
  selectedRewards: RewardsArgs[];
  setSelectedRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}

const RewardComponentDetails: React.FC<RewardComponentDetailsProps> = ({
  rewards,
  selectedRewards,
  setSelectedRewards,
}) => {
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-2";

  return (
    <>
      <h1 className="pb-2 text-xl font-bold">리워드</h1>
      <span className="border-b-[1px] pb-2 text-xs text-gray-500">
        * 이전에 세팅된 리워드의 경우, 수정시 체크박스로 선택한 리워드만
        저장됩니다.
      </span>

      <div className={inputFormClass}>
        <RewardCurrentCardDetails
          rewards={rewards}
          selectedRewards={selectedRewards}
          setSelectedRewards={setSelectedRewards}
        />
      </div>
    </>
  );
};

export default RewardComponentDetails;
