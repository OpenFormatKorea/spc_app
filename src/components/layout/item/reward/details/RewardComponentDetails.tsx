import React from "react";
import { RewardsArgs } from "@/lib/item/types";
import { ApiResponse } from "@/lib/types";
import RewardCurrentCardDetails from "@/components/layout/item/reward/details/RewardCurrentCardDetails";
import { inputFormClass } from "@/interfaces/tailwindCss";

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
  return (
    <>
      <h1 className="border-b border-b-gray-200 pb-[5px] text-[18px] font-bold">
        리워드
      </h1>
      {/* <span className="mb-[10px] border-b-[1px] pb-[5px] text-[12px] text-gray-500">
        * 이전에 세팅된 리워드의 경우, 수정시 체크박스로 선택한 리워드만
        저장됩니다.
      </span> */}

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
