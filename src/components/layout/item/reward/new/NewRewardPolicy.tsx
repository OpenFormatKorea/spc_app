import React, { KeyboardEvent, useEffect } from "react";
import { ItemConditions, RewardType } from "@/lib/item/types";
import NewReferralCondition from "@/components/layout/item/reward/new/NewReferralCondition";

interface NewRewardPolicyProps {
  trigger: string;
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
  defaultConditions: ItemConditions;
}

const NewRewardPolicy: React.FC<NewRewardPolicyProps> = ({
  defaultConditions,
  trigger,
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
  const defaultNullConditions = {
    payment_timing: {
      type: null,
      delay_days: null,
    },
    payment_frequency: {
      type: null,
      repeat_count: null,
    },
  };

  const toggleCheckboxChange = (
    setUsePolicy: React.Dispatch<React.SetStateAction<boolean>>,
    setUseRefereeCondition: React.Dispatch<React.SetStateAction<boolean>>,
    setUseReffererCondition: React.Dispatch<React.SetStateAction<boolean>>,
    setRefereeConditions: React.Dispatch<React.SetStateAction<ItemConditions>>,
    setReferrerConditions: React.Dispatch<React.SetStateAction<ItemConditions>>,
    defaultConditions: ItemConditions,
    defaultNullConditions: ItemConditions,
  ) => {
    setUsePolicy((prev) => {
      const newUsePolicy = !prev;
      if (!newUsePolicy) {
        setUseRefereeCondition(false);
        setUseReffererCondition(false);
        setReferrerConditions(defaultNullConditions);
        setRefereeConditions(defaultNullConditions);
      } else {
        setUseRefereeCondition(true);
        setUseReffererCondition(true);
        setRefereeConditions(defaultConditions);
        setReferrerConditions(defaultConditions);
      }
      return newUsePolicy;
    });
  };

  const handleSignUpCheckboxChange = () => {
    toggleCheckboxChange(
      setUsePolicy,
      setUseRefereeCondition,
      setUseReffererCondition,
      setRefereeConditions,
      setReferrerConditions,
      defaultConditions,
      defaultNullConditions,
    );
  };

  const handlePurchaseCheckboxChange = () => {
    toggleCheckboxChange(
      setUsePolicy,
      setUseRefereeCondition,
      setUseReffererCondition,
      setRefereeConditions,
      setReferrerConditions,
      defaultConditions,
      defaultNullConditions,
    );
  };

  useEffect(() => {
    if (!useReffererCondition && !useRefereeCondition) {
      setUsePolicy(false);
    }
  }, [useReffererCondition, useRefereeCondition, usePolicy, setUsePolicy]);

  return (
    <div className="w-full min-w-[320px] rounded-lg bg-gray-100 p-[10px]">
      <div className="mb-[10px] flex w-full items-center border-b pb-[5px] lg:flex-row">
        <label className="w-full text-left text-[16px] font-bold">
          {trigger === "SIGNUP" ? "회원가입" : "구매 후"}
        </label>
        <div className="mr-2 flex w-full justify-end">
          <input
            type="checkbox"
            className="peer sr-only opacity-0"
            id={`usePolicy-${trigger}`}
            checked={usePolicy}
            onChange={
              trigger === "SIGNUP"
                ? handleSignUpCheckboxChange
                : handlePurchaseCheckboxChange
            }
          />
          <label
            htmlFor={`usePolicy-${trigger}`}
            className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-green-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-green-500"
          >
            <span className="sr-only">Enable</span>
          </label>
        </div>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          usePolicy
            ? "max-h-screen opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="flex flex-col gap-[10px] lg:flex-row">
          <NewReferralCondition
            trigger={trigger}
            target="referrer"
            rewardType={rewardType}
            handleKeyDown={handleKeyDown}
            itemConditions={referrerConditions}
            setItemConditions={setReferrerConditions}
            useCondition={useReffererCondition}
            setUseCondition={setUseReffererCondition}
          />
          <NewReferralCondition
            trigger={trigger}
            target="referee"
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

export default NewRewardPolicy;
