import React, { useState, KeyboardEvent } from "react";
import {
  RewardType,
  RewardsArgs,
  PaymentTimingType,
  PaymentFrequencyType,
  RewardPolicyArgs,
  CouponsArgs,
} from "@/lib/item/types";
import Modal from "@/components/layout/base/Modal";
import NewRewardPolicySetting from "@/components/layout/item/reward/new/NewRewardPolicySetting";
import InputNumberTextBox from "@/components/base/InputNumberText";

interface NewRewardModalProps {
  reward_type: RewardType;
  point_amount: string;
  couponInputs: CouponsArgs[];
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
  setPointAmount: (value: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NewRewardModal: React.FC<NewRewardModalProps> = ({
  reward_type,
  handleKeyDown,
  setRewards,
  point_amount,
  couponInputs,
  setPointAmount,
  isOpen,
  onClose,
}) => {
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
  const [referrerState, setReferrerState] =
    useState<RewardPolicyArgs>(defaultPolicy);
  const [refereeState, setRefereeState] =
    useState<RewardPolicyArgs>(defaultPolicy);

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
    if (
      referrerState.SIGNUP?.payment_frequency.type ===
        PaymentFrequencyType.REP &&
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
      refereeState.SIGNUP?.payment_frequency.type ===
        PaymentFrequencyType.REP &&
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

  const onclickAddPointItemConditions = () => {
    const rewardConditionsArgs: RewardsArgs = {
      reward_type,
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
  const onclickAddCouponItemConditions = () => {
    couponInputs.forEach((inputCoupon: CouponsArgs) => {
      // Create rewardConditionsArgs based on the reward type
      const rewardConditionsArgs: RewardsArgs = {
        reward_type,
        ...(reward_type === RewardType.CO
          ? { coupon_code: String(inputCoupon.coupon_code) }
          : {}),
        referrer_conditions: generatePolicy(referrerState),
        referee_conditions: generatePolicy(refereeState),
      };

      if (infoCheck()) {
        setRewards((prevRewards) => [...prevRewards, rewardConditionsArgs]);
        onClose();
      } else {
        return false;
      }
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="w-full pb-2 text-left text-xl font-bold">
            {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가 설정
          </h1>

          <div className="my-2 flex max-h-[550px] flex-col items-center overflow-y-scroll">
            <div className="flex w-full flex-col rounded-lg bg-white p-3">
              <div className="mb-4 flex w-full flex-col items-center justify-center rounded-xl">
                <div className="mb-2 flex w-full flex-col text-left">
                  <label className="font-gray-300 mb-2 text-sm font-semibold">
                    {reward_type === RewardType.CO
                      ? "쿠폰 코드"
                      : " 지급 포인트 금액"}
                  </label>

                  <div className="flex w-full items-end">
                    {reward_type === RewardType.PO ? (
                      <>
                        <InputNumberTextBox
                          id={"point_amount"}
                          placeholder={
                            "원하시는 지급 포인트 금액을 입력하세요."
                          }
                          value={
                            reward_type === RewardType.PO
                              ? point_amount
                              : couponInputs.toString
                          }
                          onChange={(e) =>
                            reward_type === RewardType.PO &&
                            setPointAmount(e.target.value)
                          }
                          onKeyDown={handleKeyDown}
                          disabled={true}
                        />

                        <label className="font-gray-300 ml-2 text-sm font-semibold">
                          포인트
                        </label>
                      </>
                    ) : (
                      <div className="contents-container w-full justify-between pb-4">
                        <div className="flex h-fit w-full flex-col">
                          <div className="mb-2 flex w-full flex-col text-left">
                            <label className={labelClass}>선택된 쿠폰</label>
                            <div className="mt-2 flex h-fit w-full flex-wrap justify-center break-words rounded-xl bg-gray-100 p-2 pb-3 text-sm">
                              {couponInputs.length !== 0 ? (
                                couponInputs.map((inputCoupon) => {
                                  return (
                                    inputCoupon && (
                                      <div
                                        key={inputCoupon.coupon_code}
                                        className="mr-1 mt-1 h-fit w-fit rounded-md bg-blue-300 p-1 text-sm text-white"
                                      >
                                        {inputCoupon.coupon_name}
                                      </div>
                                    )
                                  );
                                })
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <div className="text-center text-gray-600">
                                    선택된 쿠폰이 없습니다.
                                    <br />
                                    상품을 선택해주세요.
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <NewRewardPolicySetting
                inputformClass={inputFormClass}
                labelClass={labelClass}
                reward_type={reward_type}
                handleKeyDown={handleKeyDown}
                setReferrerState={setReferrerState}
                setRefereeState={setRefereeState}
              />
            </div>
          </div>

          <button
            className="mt-4 w-full rounded-lg bg-blue-500 p-2 text-white"
            onClick={
              reward_type === RewardType.PO
                ? onclickAddPointItemConditions
                : onclickAddCouponItemConditions
            }
          >
            {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가
          </button>
        </div>
      </Modal>
    </>
  );
};

export default NewRewardModal;
