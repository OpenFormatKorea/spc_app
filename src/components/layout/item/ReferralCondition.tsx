import React, { KeyboardEvent } from "react";
import { PaymentFrequencyType, PaymentTimingType, RewardType, ReferralConditions } from "@/pages/item/lib/types";
import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";

interface ReferralConditionProps {
  trigger: string;
  target: string;
  inputFormClass: string;
  labelClass: string;
  rewardType: RewardType;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  referralConditions: ReferralConditions;
  setReferralConditions: React.Dispatch<React.SetStateAction<ReferralConditions>>;
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
  referralConditions,
  setReferralConditions,
  useCondition,
  setUseCondition,
}) => {
  //payment timing options
  const handleTimingChange = (
    key: keyof ReferralConditions["payment_timing"],
    value: PaymentTimingType | number | null
  ) => {
    setReferralConditions((prevState) => ({
      ...prevState,
      payment_timing: {
        ...prevState.payment_timing,
        [key]: value,
      },
    }));
  };
  //payment frequency options
  const handleFrequencyChange = (
    key: keyof ReferralConditions["payment_frequency"],
    value: PaymentFrequencyType | number | null
  ) => {
    setReferralConditions((prevState) => ({
      ...prevState,
      payment_frequency: {
        ...prevState.payment_frequency,
        [key]: value,
      },
    }));
  };
  // checkbox selected for refferer and referee
  const handleCheckboxChange = () => {
    setUseCondition((prev) => {
      const newUseCondition = !prev;

      setReferralConditions({
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
    <div className="p-4 border w-full bg-white mb-4 rounded-xl">
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

      {useCondition && (
        <>
          <div className={inputFormClass}>
            <label className={labelClass}>{rewardType === RewardType.CO ? "쿠폰" : "포인트"} 지급 시점</label>
            <div className="flex justify-between w-full mt-2">
              <InputRadioBox
                label="즉시 지급"
                name={`${target}_${trigger}_payment_timing_type`}
                value={PaymentTimingType.IMM}
                checked={referralConditions.payment_timing.type === PaymentTimingType.IMM}
                onChange={(e) => handleTimingChange("type", PaymentTimingType.IMM)}
              />
              <InputRadioBox
                label="추후 지급"
                name={`${target}_${trigger}_payment_timing_type`}
                value={PaymentTimingType.DEL}
                checked={referralConditions.payment_timing.type === PaymentTimingType.DEL}
                onChange={(e) => handleTimingChange("type", PaymentTimingType.DEL)}
              />
            </div>

            {referralConditions.payment_timing.type === PaymentTimingType.DEL && (
              <div className="flex text-left w-[120px] mt-2 text-gray-500">
                <InputTextBox
                  type="text"
                  id={`${target}_${trigger}_delay_days`}
                  placeholder=""
                  value={referralConditions.payment_timing.delay_days || ""}
                  onChange={(e) => handleTimingChange("delay_days", Number(e.target.value))}
                  onKeyDown={handleKeyDown}
                />
                <div className="flex items-center min-w-fit ml-2">일 후 지급</div>
              </div>
            )}
          </div>

          <div className={inputFormClass}>
            <label className={labelClass}>{rewardType === RewardType.CO ? "쿠폰" : "포인트"} 지급 횟수</label>
            <div className="flex justify-between w-full mt-2">
              <InputRadioBox
                label="한번만"
                name={`${target}_${trigger}_payment_frequency_type`}
                value={PaymentFrequencyType.ONCE}
                checked={referralConditions.payment_frequency.type === PaymentFrequencyType.ONCE}
                onChange={(e) => handleFrequencyChange("type", PaymentFrequencyType.ONCE)}
              />
              <InputRadioBox
                label="반복"
                name={`${target}_${trigger}_payment_frequency_type`}
                value={PaymentFrequencyType.REP}
                checked={referralConditions.payment_frequency.type === PaymentFrequencyType.REP}
                onChange={(e) => handleFrequencyChange("type", PaymentFrequencyType.REP)}
              />
              <InputRadioBox
                label="무제한"
                name={`${target}_${trigger}_payment_frequency_type`}
                value={PaymentFrequencyType.UNL}
                checked={referralConditions.payment_frequency.type === PaymentFrequencyType.UNL}
                onChange={(e) => handleFrequencyChange("type", PaymentFrequencyType.UNL)}
              />
            </div>
            {referralConditions.payment_frequency.type === PaymentFrequencyType.REP && (
              <div className="flex text-left w-[150px] mb-2 text-gray-500">
                <div className="flex min-w-fit items-center mr-2">최대</div>
                <InputTextBox
                  type="number"
                  id={`${target}_${trigger}_repeat_count`}
                  placeholder=""
                  value={referralConditions.payment_frequency.repeat_count || ""}
                  onChange={(e) => handleFrequencyChange("repeat_count", Number(e.target.value))}
                  onKeyDown={handleKeyDown}
                />
                <div className="flex items-center min-w-fit ml-2">번</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReferralCondition;
