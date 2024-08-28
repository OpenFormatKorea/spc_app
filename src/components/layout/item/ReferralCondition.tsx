import React, { useState, KeyboardEvent } from "react";
import { PaymentFrequencyType, PaymentTimingType, RewardPolicyArgs, RewardType } from "@/pages/item/lib/types";
import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";

interface ReferralConditionProps {
  target: "referrer" | "referee";
  inputFormClass: string;
  labelClass: string;
  rewardType: RewardType;
  target_state: RewardPolicyArgs;
  setTargetState: (value: RewardPolicyArgs) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const ReferralCondition: React.FC<ReferralConditionProps> = ({
  target,
  inputFormClass,
  labelClass,
  rewardType,
  target_state,
  setTargetState,
  handleKeyDown,
}) => {
  const [usePolicy, setUsePolicy] = useState(true);

  const handleCheckboxChange = () => {
    setUsePolicy((prev) => !prev);
  };

  const handleChange = (key: string, value: number | string | PaymentTimingType | PaymentFrequencyType) => {
    setTargetState((prevState) => ({
      ...prevState,
      [target.toUpperCase()]: {
        ...prevState[target.toUpperCase()],
        [key]: value,
      },
    }));
  };

  const policyState = target_state[target.toUpperCase() as keyof RewardPolicyArgs];

  return (
    <>
      <div className="p-4 border bg-white mb-4">
        <div className="flex items-center mb-4 border-b-[1px]">
          <input
            type="checkbox"
            id={`usePolicy-${target}`}
            checked={usePolicy}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor={`usePolicy-${target}`} className="font-gray-600 text-lg font-bold text-left w-full">
            {target === "referrer" ? "추천인" : "피추천인"}
          </label>
        </div>

        {usePolicy && (
          <>
            <div className={inputFormClass}>
              <label className={labelClass}>{rewardType === RewardType.CO ? "쿠폰" : "포인트"} 지급 시점</label>
              <div className="flex justify-between w-full mt-2 ">
                <InputRadioBox
                  label="즉시 지급"
                  name={`${target}_payment_timing_type`}
                  value={PaymentTimingType.IMM}
                  checked={policyState?.payment_timing.type === PaymentTimingType.IMM}
                  onChange={(e) => handleChange("payment_timing.type", e.target.value)}
                />
                <InputRadioBox
                  label="추후 지급"
                  name={`${target}_payment_timing_type`}
                  value={PaymentTimingType.DEL}
                  checked={policyState?.payment_timing.type === PaymentTimingType.DEL}
                  onChange={(e) => handleChange("payment_timing.type", e.target.value)}
                />
              </div>

              {policyState?.payment_timing.type === PaymentTimingType.DEL && (
                <div className="flex text-left w-[120px] mt-2 text-gray-500">
                  <InputTextBox
                    type="text"
                    id={`${target}_delay_days`}
                    placeholder=""
                    value={policyState?.payment_timing.delay_days || ""}
                    onChange={(e) => handleChange("payment_timing.delay_days", e.target.value)}
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
                  name={`${target}_payment_frequency_type`}
                  value={PaymentFrequencyType.ONCE}
                  checked={policyState?.payment_frequency.type === PaymentFrequencyType.ONCE}
                  onChange={(e) => handleChange("payment_frequency.type", e.target.value)}
                />
                <InputRadioBox
                  label="반복"
                  name={`${target}_payment_frequency_type`}
                  value={PaymentFrequencyType.REP}
                  checked={policyState?.payment_frequency.type === PaymentFrequencyType.REP}
                  onChange={(e) => handleChange("payment_frequency.type", e.target.value)}
                />
                <InputRadioBox
                  label="무제한"
                  name={`${target}_payment_frequency_type`}
                  value={PaymentFrequencyType.UNL}
                  checked={policyState?.payment_frequency.type === PaymentFrequencyType.UNL}
                  onChange={(e) => handleChange("payment_frequency.type", e.target.value)}
                />
              </div>
              {policyState?.payment_frequency.type === PaymentFrequencyType.REP && (
                <div className="flex text-left w-[150px] mb-2 text-gray-500">
                  <div className="flex min-w-fit items-center mr-2">최대 </div>
                  <InputTextBox
                    type="number"
                    id={`${target}_repeat_count`}
                    placeholder=""
                    value={policyState.payment_frequency.repeat_count || ""}
                    onChange={(e) => handleChange("payment_frequency.repeat_count", e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex items-center min-w-fit ml-2">번</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReferralCondition;
