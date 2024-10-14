import React, { KeyboardEvent, useEffect, useState } from "react";
import {
  ItemConditions,
  PaymentFrequencyType,
  PaymentTimingType,
  RewardPolicyArgs,
  RewardType,
} from "@/lib/item/types";
import RewardPolicy from "@/components/layout/item/reward/RewardPolicy";

interface RewardPolicySettingProps {
  inputformClass: string;
  labelClass: string;
  reward_type: RewardType;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  setReferrerState: React.Dispatch<React.SetStateAction<RewardPolicyArgs>>;
  setRefereeState: React.Dispatch<React.SetStateAction<RewardPolicyArgs>>;
}

const RewardPolicySetting: React.FC<RewardPolicySettingProps> = ({
  inputformClass,
  labelClass,
  reward_type,
  handleKeyDown,
  setReferrerState,
  setRefereeState,
}) => {
  const [useSignUpPolicy, setUseSignUpPolicy] = useState(true);
  const [usePurchasePolicy, setUsePurchasePolicy] = useState(true);
  const defaultConditions = {
    payment_timing: {
      type: PaymentTimingType.IMM,
      delay_days: null,
    },
    payment_frequency: {
      type: PaymentFrequencyType.ONCE,
      repeat_count: null,
    },
  };
  // Separate state for sign up and purchase

  const [useSignUpReffererCondition, setUseSignUpReffererCondition] =
    useState(true);
  const [signUpReferrerConditions, setSignUpReferrerConditions] =
    useState<ItemConditions>(defaultConditions);
  const [useSignUpRefereeCondition, setUseSignUpRefereeCondition] =
    useState(true);
  const [signUpRefereeConditions, setSignUpRefereeConditions] =
    useState<ItemConditions>(defaultConditions);

  const [usePurchaseReffererCondition, setUsePurchaseReffererCondition] =
    useState(true);
  const [purchaseReferrerConditions, setPurchaseReferrerConditions] =
    useState<ItemConditions>(defaultConditions);
  const [usePurchaseRefereeCondition, setUsePurchaseRefereeCondition] =
    useState(true);
  const [purchaseRefereeConditions, setPurchaseRefereeConditions] =
    useState<ItemConditions>(defaultConditions);

  useEffect(() => {
    setReferrerState({
      SIGNUP: signUpReferrerConditions,
      PURCHASE: purchaseReferrerConditions,
    });
  }, [signUpReferrerConditions, purchaseReferrerConditions]);

  useEffect(() => {
    setRefereeState({
      SIGNUP: signUpRefereeConditions,
      PURCHASE: purchaseRefereeConditions,
    });
  }, [signUpRefereeConditions, purchaseRefereeConditions]);

  return (
    <div className="mb-3 flex flex-col items-center">
      <div className="flex flex-col rounded-lg">
        <RewardPolicy
          defaultConditions={defaultConditions}
          trigger="SIGNUP"
          inputformClass={inputformClass}
          labelClass={labelClass}
          rewardType={reward_type}
          handleKeyDown={handleKeyDown}
          usePolicy={useSignUpPolicy}
          setUsePolicy={setUseSignUpPolicy}
          useReffererCondition={useSignUpReffererCondition}
          setUseReffererCondition={setUseSignUpReffererCondition}
          referrerConditions={signUpReferrerConditions}
          setReferrerConditions={setSignUpReferrerConditions}
          useRefereeCondition={useSignUpRefereeCondition}
          setUseRefereeCondition={setUseSignUpRefereeCondition}
          refereeConditions={signUpRefereeConditions}
          setRefereeConditions={setSignUpRefereeConditions}
        />
      </div>
      <div className="flex flex-col rounded-lg">
        <RewardPolicy
          defaultConditions={defaultConditions}
          trigger="PURCHASE"
          inputformClass={inputformClass}
          labelClass={labelClass}
          rewardType={reward_type}
          handleKeyDown={handleKeyDown}
          usePolicy={usePurchasePolicy}
          setUsePolicy={setUsePurchasePolicy}
          useReffererCondition={usePurchaseReffererCondition}
          setUseReffererCondition={setUsePurchaseReffererCondition}
          referrerConditions={purchaseReferrerConditions}
          setReferrerConditions={setPurchaseReferrerConditions}
          useRefereeCondition={usePurchaseRefereeCondition}
          setUseRefereeCondition={setUsePurchaseRefereeCondition}
          refereeConditions={purchaseRefereeConditions}
          setRefereeConditions={setPurchaseRefereeConditions}
        />
      </div>
    </div>
  );
};

export default RewardPolicySetting;
