import React, { KeyboardEvent, useEffect, useState } from "react";
import { PaymentFrequencyType, PaymentTimingType, ReferralConditions, RewardType } from "@/pages/item/lib/types";
import ReferralCondition from "@/components/layout/item/ReferralCondition";

interface RewardPolicyProps {
  trigger: string;
  inputformClass: string;
  labelClass: string;
  rewardType: RewardType;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  usePolicy: boolean;
  setUsePolicy: React.Dispatch<React.SetStateAction<boolean>>;
  useReffererCondition: boolean;
  setUseReffererCondition: React.Dispatch<React.SetStateAction<boolean>>;
  referrerConditions: ReferralConditions;
  setReferrerConditions: React.Dispatch<React.SetStateAction<ReferralConditions>>;
  useRefereeCondition: boolean;
  setUseRefereeCondition: React.Dispatch<React.SetStateAction<boolean>>;
  refereeConditions: ReferralConditions;
  setRefereeConditions: React.Dispatch<React.SetStateAction<ReferralConditions>>;
}

const RewardPolicy: React.FC<RewardPolicyProps> = ({
  trigger,
  inputformClass,
  labelClass,
  rewardType,
  handleKeyDown,
  usePolicy,
  setUsePolicy,
  useReffererCondition,
  setUseReffererCondition,
  referrerConditions,
  setReferrerConditions,
  useRefereeCondition,
  setUseRefereeCondition,
  refereeConditions,
  setRefereeConditions,
}) => {
  const handleSignUpCheckboxChange = () => {
    const defaultConditions = {
      payment_timing: {
        type: null,
        delay_days: null,
      },
      payment_frequency: {
        type: null,
        repeat_count: null,
      },
    };
    setUsePolicy((prev) => {
      const newUsePolicy = !prev;
      if (!newUsePolicy) {
        setUseReffererCondition(false);
        setReferrerConditions(defaultConditions);
      } else {
        setUseReffererCondition(true);
        setReferrerConditions({
          payment_timing: {
            type: PaymentTimingType.IMM,
            delay_days: null,
          },
          payment_frequency: {
            type: PaymentFrequencyType.ONCE,
            repeat_count: null,
          },
        });
      }
      return newUsePolicy;
    });
  };
  const handlePurchaseCheckboxChange = () => {
    const defaultConditions = {
      payment_timing: {
        type: null,
        delay_days: null,
      },
      payment_frequency: {
        type: null,
        repeat_count: null,
      },
    };
    setUsePolicy((prev) => {
      const newUsePolicy = !prev;
      if (!newUsePolicy) {
        setUseRefereeCondition(false);
        setRefereeConditions(defaultConditions);
      } else {
        setUseRefereeCondition(true);
        setRefereeConditions({
          payment_timing: {
            type: PaymentTimingType.IMM,
            delay_days: null,
          },
          payment_frequency: {
            type: PaymentFrequencyType.ONCE,
            repeat_count: null,
          },
        });
      }
      return newUsePolicy;
    });
  };
  // useEffect(() => {
  //   console.log("Referrer Conditions", referrerConditions);
  // }, [referrerConditions]);
  // useEffect(() => {
  //   console.log("Referee Conditions", refereeConditions);
  // }, [refereeConditions]);

  return (
    <div className="flex-col p-2 bg-gray-100 rounded-lg w-full min-w-[332px]">
      <div className="flex items-center mb-4 border-b-[1px] pb-2">
        <label className="text-lg font-bold text-left w-full">{trigger === "SIGNUP" ? "회원가입" : "구매 후"}</label>
        <div className="mr-2 mb-3 items-center flex">
          <input
            type="checkbox"
            className="peer sr-only opacity-0"
            id={`usePolicy-${trigger}`}
            checked={usePolicy}
            onChange={trigger === "SIGNUP" ? handleSignUpCheckboxChange : handlePurchaseCheckboxChange}
          />
          <label
            htmlFor={`usePolicy-${trigger}`}
            className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-green-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-green-500"
          >
            <span className="sr-only">Enable</span>
          </label>
        </div>
      </div>

      {usePolicy && (
        <>
          <ReferralCondition
            trigger={trigger}
            target="referrer"
            inputFormClass={inputformClass}
            labelClass={labelClass}
            rewardType={rewardType}
            handleKeyDown={handleKeyDown}
            referralConditions={referrerConditions}
            setReferralConditions={setReferrerConditions}
            useCondition={useReffererCondition}
            setUseCondition={setUseReffererCondition}
          />
          <ReferralCondition
            trigger={trigger}
            target="referee"
            inputFormClass={inputformClass}
            labelClass={labelClass}
            rewardType={rewardType}
            handleKeyDown={handleKeyDown}
            referralConditions={refereeConditions}
            setReferralConditions={setRefereeConditions}
            useCondition={useRefereeCondition}
            setUseCondition={setUseRefereeCondition}
          />
        </>
      )}
    </div>
  );
};

export default RewardPolicy;
