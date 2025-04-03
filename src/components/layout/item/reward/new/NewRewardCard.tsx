import React from "react";
import {
  PaymentFrequencyType,
  PaymentTimingType,
  RewardsArgs,
} from "@/lib/item/types";
import { labelClass, inputFormClass } from "@/interfaces/tailwindCss";

interface NewRewardCardProps {
  rewards: RewardsArgs[];
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}

const NewRewardCard: React.FC<NewRewardCardProps> = ({
  rewards,
  setRewards,
}) => {
  const triggerTypes = ["SIGNUP", "PURCHASE"] as const;
  const conditionTypes = ["referrer_conditions", "referee_conditions"] as const;
  const handleDeleteRewards = (indexToDelete: number) => {
    if (confirm("리워드를 삭제하시겠습니까?")) {
      setRewards((prevRewards) =>
        prevRewards.filter((_, index) => index !== indexToDelete),
      );
    }
  };

  const renderPaymentTiming = (type: PaymentTimingType | null | undefined) => {
    if (!type) return null;
    return type === PaymentTimingType.IMM ? "즉시 지급" : "추후 지급";
  };

  const renderPaymentFrequency = (
    type: PaymentFrequencyType | null | undefined,
  ) => {
    if (!type) return null;
    switch (type) {
      case PaymentFrequencyType.ONCE:
        return "한번 지급";
      case PaymentFrequencyType.REP:
        return "반복 지급";
      case PaymentFrequencyType.UNL:
        return "무제한 지급";
      default:
        return null;
    }
  };

  return (
    <>
      {rewards.map((reward, index) => (
        <div
          className="flex w-full max-w-[380px] flex-col gap-[10px] rounded-xl border-2 border-gray-200 p-[10px] text-[12px]"
          key={index}
          id={`rewards_${index}`}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex h-full w-full justify-between gap-[10px] rounded-md bg-gray-100 p-[8px]">
              <div className="flex w-[80%] flex-col truncate">
                <span className="text-[18px] font-bold">
                  {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"}
                </span>
                {reward.reward_type === "COUPON" ? (
                  <div>
                    <span className="text-[16px]">[{reward.coupon_code}] </span>{" "}
                    <span className="text-[14px]">{reward.coupon_title}</span>
                  </div>
                ) : (
                  <span className="text-[14px]">
                    {reward.point_amount} 포인트
                  </span>
                )}{" "}
              </div>
              <div className="flex h-full w-fit items-center">
                <button
                  className="h-fit w-fit cursor-pointer rounded-lg bg-red-500 px-2 py-1 text-white"
                  onClick={() => handleDeleteRewards(index)}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-[10px] rounded-xl bg-white p-[5px] lg:flex-row">
            {triggerTypes.map((trigger) => (
              <div key={trigger} className="flex w-full flex-col">
                <div className="w-full text-[20px] font-bold">
                  {trigger === "SIGNUP" ? "회원가입" : "구매 후"}
                </div>
                <div className="flex flex-col gap-[10px]">
                  {conditionTypes.map((type) => {
                    const conditions =
                      type === "referrer_conditions"
                        ? reward.referrer_conditions
                        : reward.referee_conditions;
                    const policy =
                      trigger === "SIGNUP"
                        ? conditions?.SIGNUP
                        : conditions?.PURCHASE;
                    let isEmpty = false;
                    if (
                      policy?.payment_frequency.type === null &&
                      policy?.payment_timing.type === null
                    ) {
                      isEmpty = true;
                    }
                    return (
                      isEmpty === false && (
                        <div
                          key={type}
                          className={`flex h-[205px] w-full flex-col rounded-md p-[5px] ${isEmpty ? "bg-white" : "bg-gray-100"}`}
                        >
                          <>
                            <div className="w-full border-b border-b-gray-400 text-[16px] font-semibold">
                              {type === "referrer_conditions"
                                ? "추천인"
                                : "피추천인"}
                            </div>
                            <div className="flex w-full justify-between gap-[10px] p-[5px] py-[10px] text-[15px]">
                              <div className="w-fit font-semibold text-gray-600">
                                지급 시점:
                              </div>
                              <div className="w-fit font-bold">
                                {renderPaymentTiming(
                                  policy?.payment_timing.type,
                                )}
                              </div>
                            </div>
                            {policy?.payment_timing.delay_days != null && (
                              <div className="flex w-full justify-between gap-[10px] p-[5px] text-[15px]">
                                <div className="flex w-fit flex-col font-semibold text-gray-600">
                                  <span>
                                    {trigger === "SIGNUP"
                                      ? "회원가입 후"
                                      : "구매 후"}{" "}
                                  </span>
                                  <span>제공 일:</span>
                                </div>
                                <div className="w-fit font-bold">
                                  {policy.payment_timing.delay_days}일
                                </div>
                              </div>
                            )}
                            <div className="flex w-full justify-between gap-[10px] p-[5px] text-[15px]">
                              <div className="w-fit font-semibold text-gray-600">
                                지급 방식:
                              </div>
                              <div className="w-fit font-bold">
                                {renderPaymentFrequency(
                                  policy?.payment_frequency.type,
                                )}
                              </div>
                            </div>
                            {policy?.payment_frequency.repeat_count != null && (
                              <div className="flex w-full justify-between gap-[10px] p-[5px] text-[15px]">
                                <div className="w-fit font-semibold text-gray-600">
                                  최대 지급 횟수:
                                </div>
                                <div className="w-fit font-bold">
                                  {policy.payment_frequency.repeat_count}번
                                </div>
                              </div>
                            )}
                          </>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default NewRewardCard;
