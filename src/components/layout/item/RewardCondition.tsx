import React, { useState, KeyboardEvent } from "react";
import InputTextBox from "@/components/base/InputText";
import {
  PaymentFrequencyType,
  PaymentTimingType,
  RewardConditionsArgs,
  RewardPolicyArgs,
  RewardType,
  TriggerType,
} from "@/pages/item/lib/types";
import InputRadioBox from "@/components/base/InputRadio";

interface RewardCardProps {
  reward_type: RewardType;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  isOpen: boolean;
  onClose: () => void;
  setRewardConditions: (value: RewardConditionsArgs) => void;
}
const RewardCard: React.FC<RewardCardProps> = ({
  reward_type,
  isOpen,
  handleKeyDown,
  onClose,
  setRewardConditions,
}) => {
  const inputformClass = "flex flex-col text-left w-full lg:max-w-[350px] min-w-[300px] mb-4";
  const labelClass = "font-gray-600 text-sm font-bold text-left w-full mt-4";

  const [coupon_code, setCoupon_code] = useState("");
  const [point_amount, setPoint_amount] = useState<number>(0);
  const [referrerState, setReferrerState] = useState({
    delay_days: 0,
    repeat_count: 0,
    trigger_type: TriggerType.SU,
    payment_timing_type: PaymentTimingType.IMM,
    payment_frequency_type: PaymentFrequencyType.ONCE,
  });

  const [refereeState, setRefereeState] = useState({
    delay_days: 0,
    repeat_count: 0,
    trigger_type: TriggerType.SU,
    payment_timing_type: PaymentTimingType.IMM,
    payment_frequency_type: PaymentFrequencyType.ONCE,
  });

  const handleChange = (
    setState: React.Dispatch<React.SetStateAction<any>>,
    key: string,
    value: number | string | PaymentTimingType | PaymentFrequencyType
  ) => {
    setState((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const referrerPolicy: RewardPolicyArgs = {
    trigger: referrerState.trigger_type,
    payment_timing: {
      type: referrerState.payment_timing_type,
      ...(referrerState.payment_timing_type === PaymentTimingType.DEL && {
        delay_days: referrerState.delay_days,
      }),
    },
    payment_frequency: {
      type: referrerState.payment_frequency_type,
      ...(referrerState.payment_frequency_type === PaymentFrequencyType.REP && {
        repeat_count: referrerState.repeat_count,
      }),
    },
  };
  const refereePolicy: RewardPolicyArgs = {
    trigger: refereeState.trigger_type,
    payment_timing: {
      type: refereeState.payment_timing_type,
      ...(refereeState.payment_timing_type === PaymentTimingType.DEL && {
        delay_days: refereeState.delay_days,
      }),
    },
    payment_frequency: {
      type: refereeState.payment_frequency_type,
      ...(refereeState.payment_frequency_type === PaymentFrequencyType.REP && {
        repeat_count: refereeState.repeat_count,
      }),
    },
  };

  const onclickAddReferralConditions = () => {
    const rewardConditionsArgs: RewardConditionsArgs = {
      ...(reward_type === RewardType.CO && { coupon_code }),
      ...(reward_type === RewardType.PO && { point_amount }),
      referrer_policy: referrerPolicy,
      referee_policy: refereePolicy,
    };
    setRewardConditions(rewardConditionsArgs);
    onClose;
    console.log(JSON.stringify(rewardConditionsArgs, null, 2));
  };
  if (!isOpen) return null;

  return (
    <>
      <div className="items-center justify-center text-center m-5">
        <h1 className="w-full text-left text-2xl font-bold pb-2  border-b-[1px]">
          {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가 설정
        </h1>

        <div className="flex-col max-h-[500px] overflow-y-scroll p-2">
          <div className="w-full p-2">
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰 코드" : "지급 포인트 금액"}</label>
              {reward_type === RewardType.CO ? (
                <InputTextBox
                  type="text"
                  id="coupon_code"
                  placeholder="쿠폰 코드를 입력하세요."
                  value={coupon_code}
                  onChange={(e) => setCoupon_code(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <InputTextBox
                  type="number"
                  id="point_amount"
                  placeholder="원하시는 지급 포인트 금액을 입력하세요."
                  value={point_amount}
                  onChange={(e) => setPoint_amount(Number(e.target.value))}
                  onKeyDown={handleKeyDown}
                />
              )}
            </div>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className={inputformClass}>
              <label className="font-gray-600 text-lg font-bold text-left w-full pb-2 border-b-[1px]">추천인</label>
            </div>

            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 조건</label>
              <div className="flex justify-between w-full mt-2 ">
                <InputRadioBox
                  label="회원가입"
                  name="referrer_trigger_type"
                  value={TriggerType.SU}
                  checked={referrerState.trigger_type === TriggerType.SU}
                  onChange={(e) => {
                    handleChange(setReferrerState, "trigger_type", e.target.value);
                  }}
                />
                <InputRadioBox
                  label="상품구매"
                  name="referrer_trigger_type"
                  value={TriggerType.PUR}
                  checked={referrerState.trigger_type === TriggerType.PUR}
                  onChange={(e) => {
                    handleChange(setReferrerState, "trigger_type", e.target.value);
                  }}
                />
                <div />
              </div>
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 시점</label>
              <div className="flex justify-between w-full mt-2 ">
                <InputRadioBox
                  label="즉시 지급"
                  name="referrer_payment_timing_type"
                  value={PaymentTimingType.IMM}
                  checked={referrerState.payment_timing_type === PaymentTimingType.IMM}
                  onChange={(e) => {
                    handleChange(setReferrerState, "payment_timing_type", e.target.value);
                  }}
                />
                <InputRadioBox
                  label="추후 지급"
                  name="referrer_payment_timing_type"
                  value={PaymentTimingType.DEL}
                  checked={referrerState.payment_timing_type === PaymentTimingType.DEL}
                  onChange={(e) => {
                    handleChange(setReferrerState, "payment_timing_type", e.target.value);
                  }}
                />
                <div />
              </div>
              {referrerState.payment_timing_type === PaymentTimingType.DEL && (
                <div className="flex text-left w-[100px] mt-2  text-gray-500 m">
                  <InputTextBox
                    type="text"
                    id="referrer_delay_days"
                    placeholder=""
                    value={referrerState.delay_days}
                    onChange={(e) => {
                      handleChange(setReferrerState, "delay_days", e.target.value);
                    }}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                  <div className="flex items-center min-w-fit ml-2"> 번</div>
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
                  checked={referrerState.payment_frequency_type === PaymentFrequencyType.ONCE}
                  onChange={(e) => {
                    handleChange(setReferrerState, "payment_frequency_type", e.target.value);
                  }}
                />
                <InputRadioBox
                  label="반복"
                  name="referrer_payment_frequency_type"
                  value={PaymentFrequencyType.REP}
                  checked={referrerState.payment_frequency_type === PaymentFrequencyType.REP}
                  onChange={(e) => {
                    handleChange(setReferrerState, "payment_frequency_type", e.target.value);
                  }}
                />
                <InputRadioBox
                  label="무제한"
                  name="referrer_payment_frequency_type"
                  value={PaymentFrequencyType.UNL}
                  checked={referrerState.payment_frequency_type === PaymentFrequencyType.UNL}
                  onChange={(e) => {
                    handleChange(setReferrerState, "payment_frequency_type", e.target.value);
                  }}
                />
              </div>
            </div>
            {referrerState.payment_frequency_type === PaymentFrequencyType.REP && (
              <div className="flex text-left w-[150px] mb-2 text-gray-500">
                <div className="flex  min-w-fit  items-center mr-2">최대 </div>
                <InputTextBox
                  type="number"
                  id="referrer_repeat_count"
                  placeholder=""
                  value={referrerState.repeat_count}
                  onChange={(e) => {
                    handleChange(setReferrerState, "repeat_count", e.target.value);
                  }}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
                <div className="flex items-center min-w-fit ml-2"> 번</div>
              </div>
            )}
          </div>
          <div className="p-4 my-6 bg-gray-100 rounded-lg">
            <div className={inputformClass}>
              <label className="font-gray-600 text-lg font-bold text-left w-full pb-2 border-b-[1px]">피추천인</label>
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 조건</label>
              <div className="flex justify-between w-full mt-2">
                <InputRadioBox
                  label="회원가입"
                  name="referee_trigger_type"
                  value={TriggerType.SU}
                  checked={refereeState.trigger_type === TriggerType.SU}
                  onChange={(e) => {
                    handleChange(setRefereeState, "trigger_type", e.target.value);
                  }}
                />
                <InputRadioBox
                  label="상품구매"
                  name="referee_trigger_type"
                  value={TriggerType.PUR}
                  checked={refereeState.trigger_type === TriggerType.PUR}
                  onChange={(e) => {
                    handleChange(setRefereeState, "trigger_type", e.target.value);
                  }}
                />
                <div />
              </div>
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 시점</label>
              <div className="flex justify-between w-full mt-2 ">
                <InputRadioBox
                  label="즉시 지급"
                  name="referee_payment_timing_type"
                  value={PaymentTimingType.IMM}
                  checked={refereeState.payment_timing_type === PaymentTimingType.IMM}
                  onChange={(e) => {
                    handleChange(setRefereeState, "payment_timing_type", e.target.value);
                  }}
                />
                <InputRadioBox
                  label="추후 지급"
                  name="referee_payment_timing_type"
                  value={PaymentTimingType.DEL}
                  checked={refereeState.payment_timing_type === PaymentTimingType.DEL}
                  onChange={(e) => {
                    handleChange(setRefereeState, "payment_timing_type", e.target.value);
                  }}
                />
                <div />
              </div>
              {refereeState.payment_timing_type === PaymentTimingType.DEL && (
                <div className="flex text-left w-[200px] mb-2 text-gray-500">
                  <InputTextBox
                    type="number"
                    id="referee_delay_days"
                    placeholder=""
                    value={refereeState.delay_days}
                    onChange={(e) => {
                      handleChange(setRefereeState, "delay_days", e.target.value);
                    }}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                  <div className="flex items-center min-w-[100px] justify-center mx-2"> 일 후 지급</div>
                </div>
              )}
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 횟수</label>
              <div className="flex justify-between w-full mt-2 ">
                <InputRadioBox
                  label="한번만"
                  name="referee_payment_frequency_type"
                  value={PaymentFrequencyType.ONCE}
                  checked={refereeState.payment_frequency_type === PaymentFrequencyType.ONCE}
                  onChange={(e) => {
                    handleChange(setRefereeState, "payment_frequency_type", e.target.value);
                  }}
                />
                <InputRadioBox
                  label="반복"
                  name="referee_payment_frequency_type"
                  value={PaymentFrequencyType.REP}
                  checked={refereeState.payment_frequency_type === PaymentFrequencyType.REP}
                  onChange={(e) => {
                    handleChange(setRefereeState, "payment_frequency_type", e.target.value);
                  }}
                />
                <InputRadioBox
                  label="무제한"
                  name="referee_payment_frequency_type"
                  value={PaymentFrequencyType.UNL}
                  checked={refereeState.payment_frequency_type === PaymentFrequencyType.UNL}
                  onChange={(e) => {
                    handleChange(setRefereeState, "payment_frequency_type", e.target.value);
                  }}
                />
              </div>
            </div>
            {refereeState.payment_frequency_type === PaymentFrequencyType.REP && (
              <div className="flex text-left w-[150px] mb-2 text-gray-500">
                <div className="flex  min-w-fit  items-center mr-2">최대 </div>
                <InputTextBox
                  type="number"
                  id="referee_repeat_count"
                  placeholder=""
                  value={refereeState.repeat_count}
                  onChange={(e) => {
                    handleChange(setRefereeState, "repeat_count", e.target.value);
                  }}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
                <div className="flex items-center min-w-fit ml-2"> 번</div>
              </div>
            )}
          </div>
        </div>
        <button className="bg-blue-500 text-white rounded-lg p-2 w-full mt-4 " onClick={onclickAddReferralConditions}>
          {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가
        </button>
      </div>
    </>
  );
};

export default RewardCard;
