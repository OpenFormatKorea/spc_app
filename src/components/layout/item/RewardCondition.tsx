import React, { useState, KeyboardEvent } from "react";
import InputTextBox from "@/components/base/InputText";
import {
  PaymentFrequencyType,
  PaymentTimingType,
  RewardsArgs,
  RewardPolicyArgs,
  RewardType,
} from "@/pages/item/lib/types";
import RewardPolicySetting from "@/components/layout/item/RewardPolicySetting";

interface RewardCardProps {
  reward_type: RewardType;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  isOpen: boolean;
  onClose: () => void;
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}
const RewardCard: React.FC<RewardCardProps> = ({ reward_type, isOpen, handleKeyDown, onClose, setRewards }) => {
  const inputformClass = "flex flex-col text-left w-full min-w-[300px] mb-4";
  const labelClass = "font-gray-600 text-sm font-bold text-left w-full mt-4";
  const [coupon_code, setCouponCode] = useState("");
  const [point_amount, setPointAmount] = useState<number>(0);
  const [referrerState, setReferrerState] = useState<RewardPolicyArgs>({
    SIGNUP: {
      payment_timing: {
        type: PaymentTimingType.IMM,
        delay_days: null,
      },
      payment_frequency: {
        type: PaymentFrequencyType.ONCE,
        repeat_count: null,
      },
    },
    PURCHASE: {
      payment_timing: {
        type: PaymentTimingType.IMM,
        delay_days: null,
      },
      payment_frequency: {
        type: PaymentFrequencyType.ONCE,
        repeat_count: null,
      },
    },
  });

  const [refereeState, setRefereeState] = useState<RewardPolicyArgs>({
    SIGNUP: {
      payment_timing: {
        type: PaymentTimingType.IMM,
        delay_days: null,
      },
      payment_frequency: {
        type: PaymentFrequencyType.ONCE,
        repeat_count: null,
      },
    },
    PURCHASE: {
      payment_timing: {
        type: PaymentTimingType.IMM,
        delay_days: null,
      },
      payment_frequency: {
        type: PaymentFrequencyType.ONCE,
        repeat_count: null,
      },
    },
  });

  const onclickAddReferralConditions = () => {
    const referrerPolicy = generatePolicy(referrerState);
    const refereePolicy = generatePolicy(refereeState);

    const rewardConditionsArgs: RewardsArgs = {
      reward_type,
      ...(reward_type === RewardType.CO && { coupon_code }),
      ...(reward_type === RewardType.PO && { point_amount }),
      referrer_policy: referrerPolicy,
      referee_policy: refereePolicy,
    };

    setRewards((prevRewards: RewardsArgs[]) => [...prevRewards, rewardConditionsArgs]);
    onClose();
    console.log("rewardConditionsArgs: ", JSON.stringify(rewardConditionsArgs, null, 2));
  };

  const generatePolicy = (state: RewardPolicyArgs): RewardPolicyArgs => ({
    SIGNUP: {
      payment_timing: {
        type: state.SIGNUP.payment_timing.type,
        ...(state.SIGNUP.payment_timing.type === PaymentTimingType.DEL && {
          delay_days: state.SIGNUP.payment_timing.delay_days,
        }),
      },
      payment_frequency: {
        type: state.SIGNUP.payment_frequency.type,
        ...(state.SIGNUP.payment_frequency.type === PaymentFrequencyType.REP && {
          repeat_count: state.SIGNUP.payment_frequency.repeat_count,
        }),
      },
    },
    PURCHASE: {
      payment_timing: {
        type: state.PURCHASE.payment_timing.type,
        ...(state.PURCHASE.payment_timing.type === PaymentTimingType.DEL && {
          delay_days: state.PURCHASE.payment_timing.delay_days,
        }),
      },
      payment_frequency: {
        type: state.PURCHASE.payment_frequency.type,
        ...(state.PURCHASE.payment_frequency.type === PaymentFrequencyType.REP && {
          repeat_count: state.PURCHASE.payment_frequency.repeat_count,
        }),
      },
    },
  });

  // if (!isOpen) return null;

  return (
    <>
      <div className="items-center justify-center text-center m-5">
        <h1 className="w-full text-left text-2xl font-bold pb-2  border-b-[1px]">
          {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가 설정
        </h1>

        <div className="flex-col max-h-[500px] overflow-y-scroll p-2">
          <div className="w-full p-2">
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className={inputformClass}>
                <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰 코드" : "지급 포인트 금액"}</label>
                {reward_type === RewardType.CO ? (
                  <InputTextBox
                    type="text"
                    id="coupon_code"
                    placeholder="쿠폰 코드를 입력하세요."
                    value={coupon_code}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                ) : (
                  <InputTextBox
                    type="number"
                    id="point_amount"
                    placeholder="원하시는 지급 포인트 금액을 입력하세요."
                    value={point_amount}
                    onChange={(e) => setPointAmount(Number(e.target.value))}
                    onKeyDown={handleKeyDown}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex-col max-h-full p-2">
            <RewardPolicySetting
              inputformClass={inputformClass}
              labelClass={labelClass}
              reward_type={reward_type}
              target_state={referrerState}
              setTargetState={setReferrerState}
              handleKeyDown={handleKeyDown}
            />
          </div>
          {/* <div className="flex-col max-h-full p-2">
            <RewardPolicySetting
              inputformClass={inputformClass}
              labelClass={labelClass}
              reward_type={reward_type}
              target_state={refereeState}
              setTargetState={setRefereeState}
              handleKeyDown={handleKeyDown}
            />
          </div> */}
        </div>
        <button className="bg-blue-500 text-white rounded-lg p-2 w-full mt-4 " onClick={onclickAddReferralConditions}>
          {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가
        </button>
      </div>
    </>
  );
};

export default RewardCard;
