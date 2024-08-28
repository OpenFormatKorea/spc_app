import React, { KeyboardEvent, useState } from "react";
import { RewardPolicyArgs, RewardType } from "@/pages/item/lib/types";
import ReferralCondition from "@/components/layout/item/ReferralCondition";

interface RewardPolicyProps {
  trigger: string;
  inputformClass: string;
  labelClass: string;
  rewardType: RewardType;
  target_state: RewardPolicyArgs;
  setTargetState: (value: RewardPolicyArgs) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const RewardPolicy: React.FC<RewardPolicyProps> = ({
  trigger,
  inputformClass,
  labelClass,
  rewardType,
  target_state,
  setTargetState,
  handleKeyDown,
}) => {
  const [usePolicy, setUsePolicy] = useState(true);

  const handleCheckboxChange = () => {
    setUsePolicy(!usePolicy);
  };

  return (
    <>
      <div className="p-2 bg-gray-100 rounded-lg">
        <div className="flex items-center mb-4 border-b-[1px] pb-2">
          <input
            type="checkbox"
            id={`usePolicy-${trigger}`}
            checked={usePolicy}
            onChange={handleCheckboxChange}
            className="mr-2 align-middle"
          />
          <label htmlFor={`usePolicy-${trigger}`} className="text-lg font-bold">
            {trigger === "SIGNUP" ? "회원가입" : "구매 후"}
          </label>
        </div>

        {usePolicy && (
          <>
            <ReferralCondition
              target="referrer"
              inputFormClass={inputformClass}
              labelClass={labelClass}
              rewardType={rewardType}
              target_state={target_state}
              setTargetState={setTargetState}
              handleKeyDown={handleKeyDown}
            />
            <ReferralCondition
              target="referee"
              inputFormClass={inputformClass}
              labelClass={labelClass}
              rewardType={rewardType}
              target_state={target_state}
              setTargetState={setTargetState}
              handleKeyDown={handleKeyDown}
            />
          </>
        )}
      </div>
    </>
  );
};

export default RewardPolicy;
