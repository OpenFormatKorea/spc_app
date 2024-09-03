import React, { KeyboardEvent } from "react";
import { ItemConditions, PaymentFrequencyType, PaymentTimingType, RewardType } from "@/pages/item/lib/types";
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
  referrerConditions: ItemConditions;
  setReferrerConditions: React.Dispatch<React.SetStateAction<ItemConditions>>;
  useRefereeCondition: boolean;
  setUseRefereeCondition: React.Dispatch<React.SetStateAction<boolean>>;
  refereeConditions: ItemConditions;
  setRefereeConditions: React.Dispatch<React.SetStateAction<ItemConditions>>;
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
  const handleSignUpCheckboxChange = () => {
    setUsePolicy((prev) => {
      const newUsePolicy = !prev;
      if (!newUsePolicy) {
        setUseReffererCondition(false);
        setReferrerConditions(defaultConditions);
        setRefereeConditions(defaultConditions);
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
    setUsePolicy((prev) => {
      const newUsePolicy = !prev;
      if (!newUsePolicy) {
        setUseRefereeCondition(false);
        setRefereeConditions(defaultConditions);
        setReferrerConditions(defaultConditions);
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

  return (
    <div className="bg-gray-100 rounded-xl w-full min-w-[320px]">
      <div className="flex flex-col lg:flex-row items-center mb-4 border-b pb-2">
        <label className="text-lg font-bold text-left w-full">{trigger === "SIGNUP" ? "회원가입" : "구매 후"}</label>
        <div className="mr-2 flex justify-end w-full">
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
      <div
        className={`transition-all duration-300 ease-in-out ${
          usePolicy ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <ReferralCondition
            trigger={trigger}
            target="referrer"
            inputFormClass={inputformClass}
            labelClass={labelClass}
            rewardType={rewardType}
            handleKeyDown={handleKeyDown}
            itemConditions={referrerConditions}
            setItemConditions={setReferrerConditions}
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
            itemConditions={refereeConditions}
            setItemConditions={setRefereeConditions}
            useCondition={useRefereeCondition}
            setUseCondition={setUseRefereeCondition}
          />
        </div>
      </div>
    </div>
  );
};

export default RewardPolicy;
