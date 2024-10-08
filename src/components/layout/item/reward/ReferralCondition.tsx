import React, { KeyboardEvent } from "react";
import { PaymentFrequencyType, PaymentTimingType, RewardType, ItemConditions } from "@/lib/item/types";
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
  const isSignupAndReferee = target === "referee" && trigger === "SIGNUP";
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
    <div className="p-3 w-full bg-white rounded-xl shadow-sm">
      <div className="flex items-center border-b-[1px] pb-2 mb-1">
        <label className="font-gray-600 text-md font-bold text-left w-full flex">
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
          <div className="flex justify-between w-full text-sm mt-2">
            <InputRadioBox
              label="즉시 지급"
              name={`${target}_${trigger}_payment_timing_type`}
              value={PaymentTimingType.IMM}
              checked={itemConditions.payment_timing.type === PaymentTimingType.IMM}
              onChange={(e) => handleTimingChange("type", PaymentTimingType.IMM)}
              disabled={false}
            />
            <InputRadioBox
              label="추후 지급"
              name={`${target}_${trigger}_payment_timing_type`}
              value={PaymentTimingType.DEL}
              checked={itemConditions.payment_timing.type === PaymentTimingType.DEL}
              onChange={(e) => handleTimingChange("type", PaymentTimingType.DEL)}
              disabled={false}
            />
          </div>

          <div
            className={`transition-opacity duration-300 ease-in-out ${itemConditions.payment_timing.type === PaymentTimingType.DEL ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"}`}
          >
            <div className="flex text-left text-sm w-[120px] text-gray-500 items-end">
              <input
                type="text"
                id={`${target}_${trigger}_delay_days`}
                placeholder=""
                value={itemConditions.payment_timing.delay_days || ""}
                className="input-class flex-grow text-sm py-2 w-full lg:max-w-[450px] border-b-[1px] pt-4 pb-0"
                onChange={(e) => handleTimingChange("delay_days", Number(e.target.value))}
                onKeyDown={handleKeyDown}
                disabled={false}
              />
              <div className="flex items-center min-w-fit ml-2">일 후 지급</div>
            </div>
          </div>
        </div>

        <div className={inputFormClass}>
          <label className={labelClass}>{rewardType === RewardType.CO ? "쿠폰" : "포인트"} 지급 횟수</label>
          <div className="flex justify-between w-full text-sm mt-2">
            <InputRadioBox
              label="한번만"
              name={`${target}_${trigger}_payment_frequency_type`}
              value={PaymentFrequencyType.ONCE}
              checked={itemConditions.payment_frequency.type === PaymentFrequencyType.ONCE || isSignupAndReferee}
              onChange={(e) => handleFrequencyChange("type", PaymentFrequencyType.ONCE)}
              disabled={isSignupAndReferee} // Disable when it's "signup" and "referee"
            />
            <InputRadioBox
              label="반복"
              name={`${target}_${trigger}_payment_frequency_type`}
              value={PaymentFrequencyType.REP}
              checked={itemConditions.payment_frequency.type === PaymentFrequencyType.REP}
              onChange={(e) => handleFrequencyChange("type", PaymentFrequencyType.REP)}
              disabled={isSignupAndReferee} // Disable when it's "signup" and "referee"
            />
            <InputRadioBox
              label="무제한"
              name={`${target}_${trigger}_payment_frequency_type`}
              value={PaymentFrequencyType.UNL}
              checked={itemConditions.payment_frequency.type === PaymentFrequencyType.UNL}
              onChange={(e) => handleFrequencyChange("type", PaymentFrequencyType.UNL)}
              disabled={isSignupAndReferee} // Disable when it's "signup" and "referee"
            />
          </div>

          <div
            className={`transition-opacity duration-300 ease-in-out ${itemConditions.payment_frequency.type === PaymentFrequencyType.REP ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"}`}
          >
            <div className="flex text-left text-sm w-[120px] text-gray-500 items-end">
              <div className="flex min-w-fit items-center mr-2">최대</div>
              <style jsx>{`
                /* Chrome, Safari, Edge, Opera */
                input[type="number"]::-webkit-outer-spin-button,
                input[type="number"]::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                } /* Firefox */
                input[type="number"] {
                  -moz-appearance: textfield;
                }
              `}</style>
              <input
                type="number"
                id={`${target}_${trigger}_repeat_count`}
                placeholder=""
                className="input-class flex-grow text-sm py-2 w-full lg:max-w-[450px] border-b-[1px] pt-4 pb-0"
                value={itemConditions.payment_frequency.repeat_count || ""}
                onChange={(e) => handleFrequencyChange("repeat_count", Number(e.target.value))}
                onKeyDown={handleKeyDown}
                disabled={false}
              />
              {/* <InputTextBox
                type="number"
                id={`${target}_${trigger}_repeat_count`}
                placeholder=""
                value={itemConditions.payment_frequency.repeat_count || ""}
                onChange={(e) => handleFrequencyChange("repeat_count", Number(e.target.value))}
                onKeyDown={handleKeyDown}
                disabled={false}
              /> */}
              <div className="flex items-center min-w-fit ml-2">번</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralCondition;
