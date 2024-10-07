import React, { useState, KeyboardEvent, Dispatch, useEffect } from "react";
import InputTextBox from "@/components/base/InputText";
import RewardPolicySetting from "@/components/layout/item/reward/RewardPolicySetting";
import {
  RewardType,
  RewardsArgs,
  PaymentTimingType,
  PaymentFrequencyType,
  RewardPolicyArgs,
  CouponsArgs,
} from "@/lib/item/types";
import Modal from "@/components/layout/base/Modal";

interface RewardModalProps {
  reward_type: RewardType;
  point_amount: number;
  couponInputs: CouponsArgs[];
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
  setPointAmount: (value: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({
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
        ...(reward_type === RewardType.CO ? { coupon_code: String(inputCoupon.coupon_code) } : {}),
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
          <h1 className="w-full text-left text-xl font-bold pb-2">
            {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가 설정
          </h1>

          <div className="flex flex-col items-center max-h-[550px] overflow-y-scroll my-2">
            <div className="flex flex-col bg-white p-3 rounded-lg">
              <div className="flex flex-col justify-center items-center w-full rounded-xl mb-4">
                <div className="flex flex-col w-full mb-2 text-left">
                  <label className="font-gray-300 text-sm font-semibold mb-2">
                    {reward_type === RewardType.CO ? "쿠폰 코드" : " 지급 포인트 금액"}
                  </label>

                  <div className="flex w-full items-end">
                    {reward_type === RewardType.PO ? (
                      <>
                        <InputTextBox
                          type={"number"}
                          id={"point_amount"}
                          placeholder={"원하시는 지급 포인트 금액을 입력하세요."}
                          value={reward_type === RewardType.PO ? point_amount : couponInputs.toString}
                          onChange={(e) => reward_type === RewardType.PO && setPointAmount(Number(e.target.value))}
                          onKeyDown={handleKeyDown}
                          disabled={true}
                        />

                        <label className="font-gray-300 text-sm font-semibold ml-2">포인트</label>
                      </>
                    ) : (
                      <div className="contents-container w-full justify-between pb-4">
                        <div className="flex flex-col w-full h-fit">
                          <div className="flex flex-col w-full mb-2 text-left">
                            <label className={labelClass}>선택된 쿠폰</label>
                            <div className="w-full h-fit text-sm justify-center mt-2 break-words flex flex-wrap bg-gray-100 rounded-xl p-2 pb-3">
                              {couponInputs.length !== 0 ? (
                                couponInputs.map((inputCoupon) => {
                                  return (
                                    inputCoupon && (
                                      <div
                                        key={inputCoupon.coupon_code}
                                        className="mr-1 mt-1 p-1 w-fit h-fit text-sm text-white bg-blue-300 rounded-md"
                                      >
                                        {inputCoupon.coupon_name}
                                      </div>
                                    )
                                  );
                                })
                              ) : (
                                <div className="flex items-center justify-center h-full w-full">
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

          <button
            className="bg-blue-500 text-white rounded-lg p-2 w-full mt-4"
            onClick={reward_type === RewardType.PO ? onclickAddPointItemConditions : onclickAddCouponItemConditions}
          >
            {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가
          </button>
        </div>
      </Modal>
    </>
  );
};

export default RewardModal;
