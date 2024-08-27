import React, { KeyboardEvent, useState } from "react";
import { RewardPolicyArgs, RewardType } from "@/pages/item/lib/types";
import ReferralCondition from "@/components/layout/item/ReferralCondition";

interface RewardPolicyProps {
  trigger: string;
  inputformClass: string;
  labelClass: string;
  reward_type: RewardType;
  target_state: RewardPolicyArgs;
  setTargetState: (value: RewardPolicyArgs) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const RewardPolicy: React.FC<RewardPolicyProps> = ({
  trigger,
  inputformClass,
  labelClass,
  reward_type,
  target_state,
  setTargetState,
  handleKeyDown,
}) => {
  return (
    <>
      <div className="p-2 bg-gray-100 rounded-lg">
        <div className={inputformClass}>
          <label className="font-gray-600 text-lg font-bold text-left w-full pb-2 border-b-[1px]">
            {trigger === "SIGNUP" ? "회원가입" : "구매 후"}
          </label>
        </div>

        <ReferralCondition
          target="referrer"
          inputformClass={inputformClass}
          labelClass={labelClass}
          reward_type={reward_type}
          target_state={target_state}
          setTargetState={setTargetState}
          handleKeyDown={handleKeyDown}
        />
      </div>
      <div className="p-2 bg-gray-100 rounded-lg">
        <ReferralCondition
          target="referee"
          inputformClass={inputformClass}
          labelClass={labelClass}
          reward_type={reward_type}
          target_state={target_state}
          setTargetState={setTargetState}
          handleKeyDown={handleKeyDown}
        />
      </div>
    </>
  );
};

export default RewardPolicy;
