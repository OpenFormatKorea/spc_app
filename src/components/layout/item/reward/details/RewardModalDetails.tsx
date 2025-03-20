import React, { useState, KeyboardEvent, useEffect } from "react";
import InputTextBox from "@/components/base/InputText";
import {
  RewardType,
  RewardsArgs,
  PaymentTimingType,
  PaymentFrequencyType,
  RewardPolicyArgs,
  CouponsArgs,
} from "@/lib/item/types";
import Modal from "@/components/layout/base/Modal";
import RewardPolicySettingDetails from "@/components/layout/item/reward/details/RewardPolicySettingDetails";
import InputNumberTextBox from "@/components/base/InputNumberText";

interface RewardModalDetailsProps {
  reward_type: RewardType;
  point_amount: string;
  couponInputs: CouponsArgs[];
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
  setPointAmount: (value: string) => void;
  isOpen: boolean;
  onClose: () => void;
  newAddedRewards: RewardsArgs[];
  setNewAddedRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}

const RewardModalDetails: React.FC<RewardModalDetailsProps> = ({
  reward_type,
  handleKeyDown,
  setRewards,
  point_amount,
  couponInputs,
  setPointAmount,
  isOpen,
  onClose,
  newAddedRewards,
  setNewAddedRewards,
}) => {
  const defaultPolicy: RewardPolicyArgs = {
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

  const [referrerState, setReferrerState] =
    useState<RewardPolicyArgs>(defaultPolicy);
  const [refereeState, setRefereeState] =
    useState<RewardPolicyArgs>(defaultPolicy);

  // Class name constants
  const labelClass = "text-[12px] pt-2 text-gray-500";

  // Helper function to generate policy
  const generatePolicy = (state: RewardPolicyArgs): RewardPolicyArgs => ({
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
  });

  // Validation function
  const infoCheck = (): boolean => {
    const validatePolicy = (
      policy: RewardPolicyArgs,
      role: string,
    ): boolean => {
      const { SIGNUP, PURCHASE } = policy;
      if (
        SIGNUP?.payment_frequency.type === PaymentFrequencyType.REP &&
        SIGNUP.payment_frequency.repeat_count === null
      ) {
        alert(`${role} SIGNUP payment frequency repeat count is null`);
        return false;
      }
      if (
        PURCHASE?.payment_timing.type === PaymentTimingType.DEL &&
        PURCHASE.payment_timing.delay_days === null
      ) {
        alert(`${role} PURCHASE payment timing delay days is null`);
        return false;
      }
      return true;
    };

    if (!validatePolicy(referrerState, "referrerState")) return false;
    if (!validatePolicy(refereeState, "refereeState")) return false;

    return true;
  };

  // Unified add function
  const handleAddReward = () => {
    const rewardConditionsArgs: RewardsArgs = {
      reward_type,
      ...(reward_type === RewardType.PO && { point_amount }),
      ...(reward_type === RewardType.CO &&
        couponInputs.reduce<Record<string, string>>((acc, coupon) => {
          acc[`coupon_code_${coupon.coupon_code}`] = String(coupon.coupon_code);
          return acc;
        }, {})),
      referrer_conditions: generatePolicy(referrerState),
      referee_conditions: generatePolicy(refereeState),
    };

    if (infoCheck()) {
      setRewards((prev) => [...prev, rewardConditionsArgs]);
      setNewAddedRewards((prev) => [...prev, rewardConditionsArgs]);
      onClose();
    }
  };

  // Handle adding based on reward type
  const handleAddButtonClick = () => {
    if (reward_type === RewardType.PO) {
      handleAddReward();
    } else if (reward_type === RewardType.CO) {
      couponInputs.forEach((inputCoupon) => {
        const rewardArgs: RewardsArgs = {
          reward_type,
          coupon_code: String(inputCoupon.coupon_code),
          referrer_conditions: generatePolicy(referrerState),
          referee_conditions: generatePolicy(refereeState),
        };

        if (infoCheck()) {
          setNewAddedRewards((prev) => [...prev, rewardArgs]);
        }
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <h1 className="w-full pb-[5px] text-left text-[18px] font-bold">
          {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가 설정
        </h1>

        <div className="my-2 flex max-h-[550px] w-full flex-col items-center overflow-y-scroll">
          <div className="flex w-full flex-col rounded-lg bg-white p-3">
            <div className="mb-4 flex w-full flex-col text-left">
              <label className="mb-2 text-[14px] font-semibold text-gray-300">
                {reward_type === RewardType.CO
                  ? "쿠폰 코드"
                  : "지급 포인트 금액"}
              </label>

              <div className="flex w-full items-end">
                {reward_type === RewardType.PO ? (
                  <>
                    <InputNumberTextBox
                      id="point_amount"
                      placeholder="원하시는 지급 포인트 금액을 입력하세요."
                      value={point_amount}
                      onChange={(e) => setPointAmount(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={true}
                    />
                    <label className="ml-2 text-[14px] font-semibold text-gray-500">
                      포인트
                    </label>
                  </>
                ) : (
                  <div className="flex w-full flex-col">
                    <label className={labelClass}>선택된 쿠폰</label>
                    <div className="mt-2 flex flex-wrap justify-center rounded-xl bg-gray-100 p-2 pb-3 text-[14px]">
                      {couponInputs.length > 0 ? (
                        couponInputs.map((coupon) => (
                          <div
                            key={coupon.coupon_code}
                            className="mr-1 mt-1 rounded-md bg-blue-300 p-1 text-[14px] text-white"
                          >
                            {coupon.coupon_code} - {coupon.coupon_name}
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center text-gray-600">
                          선택된 쿠폰이 없습니다.
                          <br />
                          상품을 선택해주세요.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <RewardPolicySettingDetails
              reward_type={reward_type}
              handleKeyDown={handleKeyDown}
              setReferrerState={setReferrerState}
              setRefereeState={setRefereeState}
            />
          </div>
        </div>

        <button
          className={`mt-4 w-full rounded-lg p-2 text-white ${
            (reward_type === RewardType.CO && couponInputs.length === 0) ||
            (reward_type === RewardType.PO && point_amount === "")
              ? "cursor-not-allowed bg-gray-400"
              : "cursor-pointer bg-blue-500"
          }`}
          onClick={handleAddButtonClick}
          disabled={
            (reward_type === RewardType.CO && couponInputs.length === 0) ||
            (reward_type === RewardType.PO && point_amount === "")
          }
        >
          {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가
        </button>
      </div>
    </Modal>
  );
};

export default RewardModalDetails;
