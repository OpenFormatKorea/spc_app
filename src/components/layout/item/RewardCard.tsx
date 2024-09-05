import React from "react";
import { PaymentFrequencyType, PaymentTimingType, RewardsArgs } from "@/pages/item/lib/types";

interface RewardCardProps {
  page_type: "DETAILS" | "NEW";
  rewards: RewardsArgs[];
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}

const RewardCard: React.FC<RewardCardProps> = ({ page_type, rewards, setRewards }) => {
  const triggerTypes = ["SIGNUP", "PURCHASE"] as const;
  const conditionsTypes = ["referrer_conditions", "refferee_conditions"] as const;

  function handleDeleteRewards(indexToDelete: number) {
    if (confirm("리워드를 삭제하시겠습니까?")) {
      setRewards((prevRewards) => prevRewards.filter((_, index) => index !== indexToDelete));
      console.log("deleted!");
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      {rewards.map((reward, index) => (
        <div className="rounded-xl my-4 bg-gray-100 text-sm min-h-[210px] p-3" key={index} id={`rewards_${index}`}>
          <h1 className="font-bold text-base pb-2 border-b mb-5 w-full flex justify-between items-center">
            <div>
              {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"} -{" "}
              {reward.reward_type === "COUPON" ? reward.coupon_code : `${reward.point_amount} 포인트`}
            </div>
            <button
              className="bg-red-500 text-white font-normal px-2 py-1 rounded-lg w-fit"
              onClick={() => handleDeleteRewards(index)}
            >
              삭제
            </button>
          </h1>
          <div className="flex-col justify-between w-full">
            {triggerTypes.map((trigger) => {
              return (
                <div key={trigger} className="flex-col bg-white p-4 space-y-4 w-full rounded-xl my-4">
                  <div className="text-base font-bold w-full border-b pb-1 mb-4">
                    {trigger === "SIGNUP" ? "회원가입" : "구매 후"}
                  </div>
                  <div className="flex flex-col lg:flex-row lg:space-x-4">
                    {conditionsTypes.map((type) => {
                      const conditions =
                        type === "referrer_conditions" ? reward.referrer_conditions : reward.referee_conditions;
                      const policy = trigger === "SIGNUP" ? conditions?.SIGNUP : conditions?.PURCHASE;
                      return (
                        <div
                          key={type}
                          className="flex-col bg-gray-50 p-2 lg:p-4 space-y-2 w-full rounded-xl my-2 lg:my-0"
                        >
                          <div className="text-base font-bold w-full mb-2">
                            {type === "referrer_conditions" ? "추천인" : "피추천인"}
                          </div>
                          <div className="flex mb-2">
                            <div className="font-bold">지급 시점</div>
                            <div>
                              :{" "}
                              {policy?.payment_timing?.type
                                ? policy.payment_timing.type === PaymentTimingType.IMM
                                  ? "즉시 지급"
                                  : "추후 지급"
                                : null}
                            </div>
                          </div>
                          {policy?.payment_timing.delay_days != null && (
                            <div className="flex mb-2">
                              <div className="font-bold">
                                {trigger === "SIGNUP" ? "회원가입 후" : "구매 후"} 제공 일
                              </div>
                              <div>: {policy.payment_timing.delay_days}</div>
                            </div>
                          )}
                          <div className="flex mb-2">
                            <div className="font-bold">지급 방식</div>
                            <div>
                              :{" "}
                              {policy?.payment_frequency?.type
                                ? policy.payment_frequency.type === PaymentFrequencyType.ONCE
                                  ? "한번 지급"
                                  : policy.payment_frequency.type === PaymentFrequencyType.REP
                                    ? "반복 지급"
                                    : policy.payment_frequency.type === PaymentFrequencyType.UNL
                                      ? "무제한 지급"
                                      : null
                                : null}
                            </div>
                          </div>
                          {policy?.payment_frequency.repeat_count != null && (
                            <div className="flex mb-2">
                              <div className="font-bold">최대 지급 횟수</div>
                              <div>: {policy.payment_frequency.repeat_count}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default RewardCard;
