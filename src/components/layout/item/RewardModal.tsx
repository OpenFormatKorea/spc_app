import React, { useState, KeyboardEvent, Dispatch } from "react";
import InputTextBox from "@/components/base/InputText";
import RewardPolicySetting from "@/components/layout/item/RewardPolicySetting";
import { RewardType, RewardsArgs, PaymentTimingType, PaymentFrequencyType, RewardPolicyArgs } from "@/lib/item/types";

interface RewardModalProps {
  reward_type: RewardType;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClose: () => void;
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}

const RewardModal: React.FC<RewardModalProps> = ({ reward_type, handleKeyDown, onClose, setRewards }) => {
  const defaultPolicy = {
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
  };
  const [coupon_code, setCouponCode] = useState("");
  const [point_amount, setPointAmount] = useState<number>(0);
  const [referrerState, setReferrerState] = useState<RewardPolicyArgs>(defaultPolicy);
  const [refereeState, setRefereeState] = useState<RewardPolicyArgs>(defaultPolicy);
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-2";
  const labelClass = "text-xs pt-2 text-gray-500";
  const generatePolicy = (state: RewardPolicyArgs): RewardPolicyArgs => {
    return {
      SIGNUP: {
        payment_timing: {
          type: state.SIGNUP?.payment_timing?.type || null,
          delay_days: state.SIGNUP?.payment_timing?.delay_days ?? null,
        },
        payment_frequency: {
          type: state.SIGNUP?.payment_frequency?.type || null,
          repeat_count: state.SIGNUP?.payment_frequency?.repeat_count ?? null,
        },
      },
      PURCHASE: {
        payment_timing: {
          type: state.PURCHASE?.payment_timing?.type || null,
          delay_days: state.PURCHASE?.payment_timing?.delay_days ?? null,
        },
        payment_frequency: {
          type: state.PURCHASE?.payment_frequency?.type || null,
          repeat_count: state.PURCHASE?.payment_frequency?.repeat_count ?? null,
        },
      },
    };
  };
  function infoCheck() {
    if (reward_type === RewardType.CO && coupon_code === "") {
      alert("coupon_code is null ");
      return false;
    }
    if (reward_type === RewardType.PO && point_amount === 0) {
      alert("point_amount is null ");
      return false;
    }
    if (
      referrerState.SIGNUP?.payment_frequency.type === PaymentFrequencyType.REP &&
      referrerState.SIGNUP?.payment_frequency.repeat_count === null
    ) {
      alert("referrerState SIGNUP payment frequency repeat count is null ");
      return false;
    }
    if (
      referrerState.PURCHASE?.payment_timing.type === PaymentTimingType.DEL &&
      referrerState.PURCHASE?.payment_timing.delay_days === null
    ) {
      alert("referrerState PURCHASE payment timing delay days is null ");
      return false;
    }
    if (
      refereeState.SIGNUP?.payment_frequency.type === PaymentFrequencyType.REP &&
      refereeState.SIGNUP?.payment_frequency.repeat_count === null
    ) {
      alert("refereeState SIGNUP payment frequency repeat count is null ");
      return false;
    }
    if (
      refereeState.PURCHASE?.payment_timing.type === PaymentTimingType.DEL &&
      refereeState.PURCHASE?.payment_timing.delay_days === null
    ) {
      alert("refereeState PURCHASE payment timing delay days is null ");
      return false;
    }

    return true;
  }
  const onclickAddItemConditions = () => {
    const rewardConditionsArgs: RewardsArgs = {
      reward_type,
      ...(reward_type === RewardType.CO && { coupon_code }),
      ...(reward_type === RewardType.PO && { point_amount }),
      referrer_conditions: generatePolicy(referrerState),
      referee_conditions: generatePolicy(refereeState),
    };
    if (infoCheck()) {
      setRewards((prevRewards) => [...prevRewards, rewardConditionsArgs]);
      onClose();
    } else {
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="w-full text-left text-xl font-bold pb-2">
        {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가 설정
      </h1>

      <div className="flex flex-col items-center max-h-[550px] overflow-y-scroll my-2">
        <div className="flex flex-col bg-white p-3">
          <div className="flex flex-col justify-center items-center w-full rounded-xl mb-4">
            <div className="flex flex-col w-full mb-2 text-left">
              <label className="font-gray-600 text-md font-bold mb-2">
                {reward_type === RewardType.CO ? "쿠폰 코드" : "지급 포인트 금액"}
              </label>
              <InputTextBox
                type={reward_type === RewardType.CO ? "text" : "number"}
                id={reward_type === RewardType.CO ? "coupon_code" : "point_amount"}
                placeholder={
                  reward_type === RewardType.CO ? "쿠폰 코드를 입력하세요." : "원하시는 지급 포인트 금액을 입력하세요."
                }
                value={reward_type === RewardType.CO ? coupon_code : point_amount}
                onChange={(e) =>
                  reward_type === RewardType.CO ? setCouponCode(e.target.value) : setPointAmount(Number(e.target.value))
                }
                onKeyDown={handleKeyDown}
                disabled={false}
              />
            </div>
          </div>
          <RewardPolicySetting
            inputformClass={inputFormClass}
            labelClass={labelClass}
            reward_type={reward_type}
            handleKeyDown={handleKeyDown}
            setReferrerState={setReferrerState}
            setRefereeState={setRefereeState}
          />
        </div>
      </div>

      <button className="bg-blue-500 text-white rounded-lg p-2 w-full mt-4" onClick={onclickAddItemConditions}>
        {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가
      </button>
    </div>
  );
};

export default RewardModal;
