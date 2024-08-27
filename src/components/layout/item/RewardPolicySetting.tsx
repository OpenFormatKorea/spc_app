import React, { KeyboardEvent } from "react";
import { RewardPolicyArgs, RewardType } from "@/pages/item/lib/types";
import RewardPolicy from "@/components/layout/item/RewardPolicy";

interface RewardPolicySettingProps {
  inputformClass: string;
  labelClass: string;
  reward_type: RewardType;
  target_state: RewardPolicyArgs;
  setTargetState: (value: RewardPolicyArgs) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const RewardPolicySetting: React.FC<RewardPolicySettingProps> = ({
  inputformClass,
  labelClass,
  reward_type,
  target_state,
  setTargetState,
  handleKeyDown,
}) => {
  return (
    <>
      <div className="p-4 bg-gray-100 rounded-lg">
        <RewardPolicy
          trigger="SIGNUP"
          inputformClass={inputformClass}
          labelClass={labelClass}
          reward_type={reward_type}
          target_state={target_state}
          setTargetState={setTargetState}
          handleKeyDown={handleKeyDown}
        />
        <RewardPolicy
          trigger="PURCHASE"
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

export default RewardPolicySetting;
