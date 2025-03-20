import React, { KeyboardEvent } from "react";
import {
  PaymentFrequencyType,
  PaymentTimingType,
  RewardType,
  ItemConditions,
} from "@/lib/item/types";
import InputRadioBox from "@/components/base/InputRadio";
import { inputFormClass, labelClass } from "@/interfaces/tailwindCss";

interface ReferralConditionDetailsProps {
  trigger: string;
  target: string;

  rewardType: RewardType;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  itemConditions: ItemConditions;
  setItemConditions: React.Dispatch<React.SetStateAction<ItemConditions>>;
  useCondition: boolean;
  setUseCondition: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReferralConditionDetails: React.FC<ReferralConditionDetailsProps> = ({
  trigger,
  target,

  rewardType,
  handleKeyDown,
  itemConditions,
  setItemConditions,
  useCondition,
  setUseCondition,
}) => {
  const isSignupAndReferee = target === "referee" && trigger === "SIGNUP";

  const handleTimingChange = (
    key: keyof ItemConditions["payment_timing"],
    value: PaymentTimingType | number | null,
  ) => {
    setItemConditions((prevState) => ({
      ...prevState,
      payment_timing: {
        ...prevState.payment_timing,
        [key]: value,
      },
    }));
  };

  const handleFrequencyChange = (
    key: keyof ItemConditions["payment_frequency"],
    value: PaymentFrequencyType | number | null,
  ) => {
    setItemConditions((prevState) => ({
      ...prevState,
      payment_frequency: {
        ...prevState.payment_frequency,
        [key]: value,
      },
    }));
  };

  const handleCheckboxChange = () => {
    setUseCondition((prev) => {
      const newUseCondition = !prev;
      setItemConditions({
        payment_timing: {
          type: newUseCondition ? PaymentTimingType.IMM : null,
          delay_days: null,
        },
        payment_frequency: {
          type: newUseCondition ? PaymentFrequencyType.ONCE : null,
          repeat_count: null,
        },
      });
      return newUseCondition;
    });
  };

  return (
    <div className="w-full rounded-xl bg-white p-3 shadow-sm">
      <div className="mb-1 flex items-center border-b-[1px] pb-[5px]">
        <label className="text-md flex w-full text-left font-bold text-gray-600">
          {target === "referrer" ? "추천인" : "피추천인"}
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="peer sr-only opacity-0"
            id={`useCondition-${target}-${trigger}`}
            checked={useCondition}
            onChange={handleCheckboxChange}
          />
          <label
            htmlFor={`useCondition-${target}-${trigger}`}
            className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow peer-checked:bg-green-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-checked:peer-focus-visible:outline-green-500"
          >
            <span className="sr-only">Enable</span>
          </label>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          useCondition
            ? "max-h-screen opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className={inputFormClass}>
          <label className={labelClass}>
            {rewardType === RewardType.CO ? "쿠폰" : "포인트"} 지급 시점
          </label>
          <div className="mt-2 flex w-full justify-between text-sm">
            <InputRadioBox
              label="즉시 지급"
              name={`${target}_${trigger}_payment_timing_type`}
              value={PaymentTimingType.IMM}
              checked={
                itemConditions.payment_timing.type === PaymentTimingType.IMM
              }
              onChange={() => handleTimingChange("type", PaymentTimingType.IMM)}
              disabled={false}
            />
            <InputRadioBox
              label="추후 지급"
              name={`${target}_${trigger}_payment_timing_type`}
              value={PaymentTimingType.DEL}
              checked={
                itemConditions.payment_timing.type === PaymentTimingType.DEL
              }
              onChange={() => handleTimingChange("type", PaymentTimingType.DEL)}
              disabled={false}
            />
          </div>

          <div
            className={`transition-opacity duration-300 ease-in-out ${
              itemConditions.payment_timing.type === PaymentTimingType.DEL
                ? "max-h-screen opacity-100"
                : "max-h-0 overflow-hidden opacity-0"
            }`}
          >
            <div className="flex w-[120px] items-end text-left text-sm text-gray-500">
              <input
                type="text"
                id={`${target}_${trigger}_delay_days`}
                value={itemConditions.payment_timing.delay_days ?? ""}
                className="input-class w-full flex-grow border-b-[1px] py-2 pb-0 pt-4 text-sm lg:max-w-[450px]"
                onChange={(e) =>
                  handleTimingChange("delay_days", Number(e.target.value))
                }
                onKeyDown={handleKeyDown}
              />
              <div className="ml-2 flex min-w-fit items-center">일 후 지급</div>
            </div>
          </div>
        </div>

        <div className={inputFormClass}>
          <label className={labelClass}>
            {rewardType === RewardType.CO ? "쿠폰" : "포인트"} 지급 횟수
          </label>
          <div className="mt-2 flex w-full justify-between text-sm">
            <InputRadioBox
              label="한번만"
              name={`${target}_${trigger}_payment_frequency_type`}
              value={PaymentFrequencyType.ONCE}
              checked={
                itemConditions.payment_frequency.type ===
                  PaymentFrequencyType.ONCE || isSignupAndReferee
              }
              onChange={() =>
                handleFrequencyChange("type", PaymentFrequencyType.ONCE)
              }
              disabled={isSignupAndReferee}
            />
            <InputRadioBox
              label="반복"
              name={`${target}_${trigger}_payment_frequency_type`}
              value={PaymentFrequencyType.REP}
              checked={
                itemConditions.payment_frequency.type ===
                PaymentFrequencyType.REP
              }
              onChange={() =>
                handleFrequencyChange("type", PaymentFrequencyType.REP)
              }
              disabled={isSignupAndReferee}
            />
            <InputRadioBox
              label="무제한"
              name={`${target}_${trigger}_payment_frequency_type`}
              value={PaymentFrequencyType.UNL}
              checked={
                itemConditions.payment_frequency.type ===
                PaymentFrequencyType.UNL
              }
              onChange={() =>
                handleFrequencyChange("type", PaymentFrequencyType.UNL)
              }
              disabled={isSignupAndReferee}
            />
          </div>

          <div
            className={`transition-opacity duration-300 ease-in-out ${
              itemConditions.payment_frequency.type === PaymentFrequencyType.REP
                ? "max-h-screen opacity-100"
                : "max-h-0 overflow-hidden opacity-0"
            }`}
          >
            <div className="flex w-[120px] items-end text-left text-sm text-gray-500">
              <div className="mr-2 flex min-w-fit items-center">최대</div>
              <style jsx>{`
                input[type="number"]::-webkit-outer-spin-button,
                input[type="number"]::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type="number"] {
                  -moz-appearance: textfield;
                }
              `}</style>
              <input
                type="number"
                id={`${target}_${trigger}_repeat_count`}
                className="input-class w-full flex-grow border-b-[1px] py-2 pb-0 pt-4 text-sm lg:max-w-[450px]"
                value={itemConditions.payment_frequency.repeat_count || ""}
                onChange={(e) =>
                  handleFrequencyChange("repeat_count", Number(e.target.value))
                }
                onKeyDown={handleKeyDown}
              />
              <div className="ml-2 flex min-w-fit items-center">번</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralConditionDetails;
