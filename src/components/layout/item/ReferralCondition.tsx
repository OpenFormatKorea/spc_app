import React, { KeyboardEvent, useState } from "react";
import { PaymentFrequencyType, PaymentTimingType, RewardPolicyArgs, RewardType } from "@/pages/item/lib/types";
import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";

interface ReferralConditionProps {
  target: string;
  inputformClass: string;
  labelClass: string;
  reward_type: RewardType;
  target_state: RewardPolicyArgs;
  setTargetState: (value: RewardPolicyArgs) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const ReferralCondition: React.FC<ReferralConditionProps> = ({
  target,
  inputformClass,
  labelClass,
  reward_type,
  target_state,
  setTargetState,
  handleKeyDown,
}) => {
  const [referrerChecked, setReferrerChecked] = useState(true);
  const [refereeChecked, setRefereeChecked] = useState(true);
  const handleChange = (
    setState: React.Dispatch<React.SetStateAction<any>>,
    key: string,
    value: number | string | RewardPolicyArgs | PaymentTimingType | PaymentFrequencyType
  ) => {
    setState((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <>
      <div className="p-4 border bg-white mb-4">
        <div className={`${inputformClass}`}>
          <label className=" font-gray-600 text-md font-bold border-b-[1px]  flex">
            {target === "referrer" ? "추천인" : "피추천인"}
          </label>
          <div className="flex  w-full mt-2 text-right ">
            <InputRadioBox
              label="사용"
              name="referrerChecked"
              value={referrerChecked}
              checked={referrerChecked === true}
              onChange={(e) => {
                handleChange(setTargetState, "payment_timing_type", e.target.value);
              }}
            />
            <InputRadioBox
              label="미사용"
              name="referrerChecked"
              value={referrerChecked}
              checked={referrerChecked === false}
              onChange={(e) => {
                handleChange(setTargetState, "payment_timing_type", e.target.value);
              }}
            />
          </div>
        </div>
        <div className={inputformClass}>
          <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 시점</label>
          <div className="flex justify-between w-full mt-2 ">
            <InputRadioBox
              label="즉시 지급"
              name="referrer_payment_timing_type"
              value={PaymentTimingType.IMM}
              checked={target_state.PURCHASE.payment_timing.type === PaymentTimingType.IMM}
              onChange={(e) => {
                handleChange(setTargetState, "payment_timing_type", e.target.value);
              }}
            />
            <InputRadioBox
              label="추후 지급"
              name="referrer_payment_timing_type"
              value={PaymentTimingType.DEL}
              checked={target_state.PURCHASE.payment_timing.type === PaymentTimingType.DEL}
              onChange={(e) => {
                handleChange(setTargetState, "payment_timing_type", e.target.value);
              }}
            />
            <div />
          </div>
          {target_state.PURCHASE.payment_timing.type === PaymentTimingType.DEL && (
            <div className="flex text-left w-[120px] mt-2  text-gray-500 m">
              <InputTextBox
                type="text"
                id="referrer_delay_days"
                placeholder=""
                value={target_state.PURCHASE.payment_timing.delay_days}
                onChange={(e) => {
                  handleChange(setTargetState, "delay_days", e.target.value);
                }}
                onKeyDown={(e) => handleKeyDown(e)}
              />
              <div className="flex items-center min-w-fit ml-2"> 일 후 지급</div>
            </div>
          )}
        </div>
        <div className={inputformClass}>
          <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 횟수</label>
          <div className="flex justify-between w-full mt-2 ">
            <InputRadioBox
              label="한번만"
              name="referrer_payment_frequency_type"
              value={PaymentFrequencyType.ONCE}
              checked={target_state.PURCHASE.payment_frequency.type === PaymentFrequencyType.ONCE}
              onChange={(e) => {
                handleChange(setTargetState, "payment_frequency_type", e.target.value);
              }}
            />
            <InputRadioBox
              label="반복"
              name="referrer_payment_frequency_type"
              value={PaymentFrequencyType.REP}
              checked={target_state.PURCHASE.payment_frequency.type === PaymentFrequencyType.REP}
              onChange={(e) => {
                handleChange(setTargetState, "payment_frequency_type", e.target.value);
              }}
            />
            <InputRadioBox
              label="무제한"
              name="referrer_payment_frequency_type"
              value={PaymentFrequencyType.UNL}
              checked={target_state.PURCHASE.payment_frequency.type === PaymentFrequencyType.UNL}
              onChange={(e) => {
                handleChange(setTargetState, "payment_frequency_type", e.target.value);
              }}
            />
          </div>
        </div>
        {target_state.PURCHASE.payment_frequency.type === PaymentFrequencyType.REP && (
          <div className="flex text-left w-[150px] mb-2 text-gray-500">
            <div className="flex  min-w-fit  items-center mr-2">최대 </div>
            <InputTextBox
              type="number"
              id="referrer_repeat_count"
              placeholder=""
              value={target_state.PURCHASE.payment_frequency.repeat_count}
              onChange={(e) => {
                handleChange(setTargetState, "repeat_count", e.target.value);
              }}
              onKeyDown={(e) => handleKeyDown(e)}
            />
            <div className="flex items-center min-w-fit ml-2"> 번</div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReferralCondition;
