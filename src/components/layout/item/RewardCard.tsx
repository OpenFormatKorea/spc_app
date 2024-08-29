import React from "react";
import { RewardPolicyArgs, RewardsArgs } from "@/pages/item/lib/types";

interface RewardCardProps {
  rewards: RewardsArgs[];
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}

const RewardCard: React.FC<RewardCardProps> = ({ rewards, setRewards }) => {
  const rewardTypes = ["SIGNUP", "PURCHASE"] as const;
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
        <div
          className="border-2 rounded-xl my-4 bg-gray-100 text-sm min-h-[210px] p-4"
          key={index}
          id={`rewards_${index}`}
        >
          <h1 className="font-bold text-base pb-2 border-b mb-5 w-full flex justify-between items-center">
            <div>
              {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"} -{" "}
              {reward.reward_type === "COUPON" ? reward.coupon_code : `${reward.point_amount} 포인트`}
            </div>
            <button
              className="bg-red-500 text-white p-2 rounded-lg w-[50px] h-fit"
              onClick={() => handleDeleteRewards(index)}
            >
              삭제
            </button>
          </h1>
          <div className="flex justify-center space-x-2 w-full">
            {rewardTypes.map((type) => {
              const policy = type === "SIGNUP" ? reward.referrer_policy.SIGNUP : reward.referrer_policy.PURCHASE;
              return (
                <div key={type} className="border bg-white p-3 w-full max-w-[48%] flex-shrink-0">
                  <div className="text-base font-bold w-full border-b pb-1 mb-2">
                    {type === "SIGNUP" ? "회원가입" : "구매 후"}
                  </div>
                  <div className="flex">
                    <div className="font-bold">지급 시점</div>
                    <div>: {policy?.payment_timing.type}</div>
                  </div>
                  {policy?.payment_timing.delay_days != null && (
                    <div className="flex">
                      <div className="font-bold">{type === "SIGNUP" ? "회원가입 후" : "구매 후"} 제공 일</div>
                      <div>: {policy.payment_timing.delay_days}</div>
                    </div>
                  )}
                  <div className="flex">
                    <div className="font-bold">지급 방식</div>
                    <div>: {policy?.payment_frequency.type}</div>
                  </div>
                  {policy?.payment_frequency.repeat_count != null && (
                    <div className="flex">
                      <div className="font-bold">최대 지급 횟수</div>
                      <div>: {policy.payment_frequency.repeat_count}</div>
                    </div>
                  )}
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
