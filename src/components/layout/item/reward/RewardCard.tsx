import React from "react";
import {
  PaymentFrequencyType,
  PaymentTimingType,
  RewardsArgs,
} from "@/lib/item/types";

interface RewardCardProps {
  page_type: "DETAILS" | "NEW";
  rewards: RewardsArgs[];
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}

const RewardCard: React.FC<RewardCardProps> = ({
  page_type,
  rewards,
  setRewards,
}) => {
  const triggerTypes = ["SIGNUP", "PURCHASE"] as const;
  const conditionTypes = ["referrer_conditions", "referee_conditions"] as const;
  const labelClass =
    "labelClass flex items-center text-sm text-left text-gray-500 w-[100px]";
  const inputFormClass = "inputForm flex items-center text-sm";
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
          className="mb-4 rounded-xl bg-gray-100 p-4 text-sm"
          key={index}
          id={`rewards_${index}`}
        >
          <h1 className="mb-2 flex w-full items-center justify-between">
            <div className="text-base font-semibold">
              {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"} -{" "}
              {reward.reward_type === "COUPON"
                ? reward.coupon_code
                : `${reward.point_amount} 포인트`}
            </div>
          </h1>
          <div className="flex w-full flex-col rounded-xl bg-white lg:flex-row">
            {triggerTypes.map((trigger) => (
              <div key={trigger} className="flex w-full flex-col p-3">
                <div className="mb-2 w-full text-base font-bold">
                  {trigger === "SIGNUP" ? "회원가입" : "구매 후"}
                </div>
                <div className="flex flex-col space-y-4">
                  {conditionTypes.map((type) => {
                    const conditions =
                      type === "referrer_conditions"
                        ? reward.referrer_conditions
                        : reward.referee_conditions;
                    const policy =
                      trigger === "SIGNUP"
                        ? conditions?.SIGNUP
                        : conditions?.PURCHASE;

                    return (
                      <div
                        key={type}
                        className="min-h-[145px] w-full space-y-1 bg-gray-100 p-2"
                      >
                        <div className="mb-2 w-full border-b pb-1 text-base">
                          {type === "referrer_conditions"
                            ? "추천인"
                            : "피추천인"}
                        </div>
                        <div className="flex">
                          <div className={labelClass}>지급 시점:</div>
                          <div className={inputFormClass}>
                            {renderPaymentTiming(policy?.payment_timing.type)}
                          </div>
                        </div>
                        {policy?.payment_timing.delay_days != null && (
                          <div className="flex">
                            <div className={labelClass}>
                              {trigger === "SIGNUP" ? "회원가입 후" : "구매 후"}{" "}
                              제공 일:
                            </div>
                            <div className={inputFormClass}>
                              {policy.payment_timing.delay_days}일
                            </div>
                          </div>
                        )}
                        <div className="flex">
                          <div className={labelClass}>지급 방식:</div>
                          <div className={inputFormClass}>
                            {renderPaymentFrequency(
                              policy?.payment_frequency.type,
                            )}
                          </div>
                        </div>
                        {policy?.payment_frequency.repeat_count != null && (
                          <div className="flex">
                            <div className={labelClass}>최대 지급 횟수:</div>
                            <div className={inputFormClass}>
                              {policy.payment_frequency.repeat_count}번
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {page_type === "NEW" && (
            <div className="flex justify-end">
              <button
                className="mt-2 min-w-[45px] cursor-pointer rounded-lg bg-red-500 p-1 text-white"
                onClick={() => handleDeleteRewards(index)}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default RewardCard;
