import React, { KeyboardEvent } from "react";
import { PaymentFrequencyType, PaymentTimingType, RewardType, ItemConditions } from "@/pages/item/lib/types";
import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";

interface ReferralConditionProps {
  trigger: string;
  target: string;
  inputFormClass: string;
  labelClass: string;
  rewardType: RewardType;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  itemConditions: ItemConditions;
  setItemConditions: React.Dispatch<React.SetStateAction<ItemConditions>>;
  useCondition: boolean;
  setUseCondition: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReferralCondition: React.FC<ReferralConditionProps> = ({
  trigger,
  target,
  inputFormClass,
  labelClass,
  rewardType,
  handleKeyDown,
  itemConditions,
  setItemConditions,
  useCondition,
  setUseCondition,
}) => {
  const handleTimingChange = (
    key: keyof ItemConditions["payment_timing"],
    value: PaymentTimingType | number | null
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
    value: PaymentFrequencyType | number | null
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
    <div className="p-4 border w-full bg-white rounded-2xl">
      <div className="flex items-center mb-4 border-b-[1px]">
        <label className="font-gray-600 text-lg font-bold text-left w-full">
          {target === "referrer" ? "추천인" : "피추천인"}
        </label>
        <div className="mr-2 mb-3 items-center flex">
          <input
            type="checkbox"
            className="peer sr-only opacity-0"
            id={`useCondition-${target}-${trigger}`}
            checked={useCondition}
            onChange={handleCheckboxChange}
          />
          <label
            htmlFor={`useCondition-${target}-${trigger}`}
            className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-green-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-green-500"
          >
            <span className="sr-only">Enable</span>
          </label>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          useCondition ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <div className={inputFormClass}>
          <label className={labelClass}>{rewardType === RewardType.CO ? "쿠폰" : "포인트"} 지급 시점</label>
          <div className="flex justify-between w-full mt-2">
            <InputRadioBox
              label="즉시 지급"
              name={`${target}_${trigger}_payment_timing_type`}
              value={PaymentTimingType.IMM}
              checked={itemConditions.payment_timing.type === PaymentTimingType.IMM}
              onChange={(e) => handleTimingChange("type", PaymentTimingType.IMM)}
            />
            <InputRadioBox
              label="추후 지급"
              name={`${target}_${trigger}_payment_timing_type`}
              value={PaymentTimingType.DEL}
              checked={itemConditions.payment_timing.type === PaymentTimingType.DEL}
              onChange={(e) => handleTimingChange("type", PaymentTimingType.DEL)}
            />
          </div>

          <div
            className={`transition-opacity duration-300 ease-in-out ${itemConditions.payment_timing.type === PaymentTimingType.DEL ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"}`}
          >
            <div className="flex text-left w-[120px] mt-2 text-gray-500">
              <InputTextBox
                type="text"
                id={`${target}_${trigger}_delay_days`}
                placeholder=""
                value={itemConditions.payment_timing.delay_days || ""}
                onChange={(e) => handleTimingChange("delay_days", Number(e.target.value))}
                onKeyDown={handleKeyDown}
              />
              <div className="flex items-center min-w-fit ml-2">일 후 지급</div>
            </div>
          </div>
        </div>

        <div className={inputFormClass}>
          <label className={labelClass}>{rewardType === RewardType.CO ? "쿠폰" : "포인트"} 지급 횟수</label>
          <div className="flex justify-between w-full mt-2">
            <InputRadioBox
              label="한번만"
              name={`${target}_${trigger}_payment_frequency_type`}
              value={PaymentFrequencyType.ONCE}
              checked={itemConditions.payment_frequency.type === PaymentFrequencyType.ONCE}
              onChange={(e) => handleFrequencyChange("type", PaymentFrequencyType.ONCE)}
            />
            <InputRadioBox
              label="반복"
              name={`${target}_${trigger}_payment_frequency_type`}
              value={PaymentFrequencyType.REP}
              checked={itemConditions.payment_frequency.type === PaymentFrequencyType.REP}
              onChange={(e) => handleFrequencyChange("type", PaymentFrequencyType.REP)}
            />
            <InputRadioBox
              label="무제한"
              name={`${target}_${trigger}_payment_frequency_type`}
              value={PaymentFrequencyType.UNL}
              checked={itemConditions.payment_frequency.type === PaymentFrequencyType.UNL}
              onChange={(e) => handleFrequencyChange("type", PaymentFrequencyType.UNL)}
            />
          </div>
          <div
            className={`transition-opacity duration-300 ease-in-out ${itemConditions.payment_frequency.type === PaymentFrequencyType.REP ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"}`}
          >
            <div className="flex text-left w-[150px] mb-2 text-gray-500">
              <div className="flex min-w-fit items-center mr-2">최대</div>
              <InputTextBox
                type="number"
                id={`${target}_${trigger}_repeat_count`}
                placeholder=""
                value={itemConditions.payment_frequency.repeat_count || ""}
                onChange={(e) => handleFrequencyChange("repeat_count", Number(e.target.value))}
                onKeyDown={handleKeyDown}
              />
              <div className="flex items-center min-w-fit ml-2">번</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralCondition;
