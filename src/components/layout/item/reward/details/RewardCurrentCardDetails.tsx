import React, { useEffect, useState, ChangeEvent } from "react";
import {
  PaymentFrequencyType,
  PaymentTimingType,
  RewardsArgs,
} from "@/lib/item/types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface RewardCurrentCardDetailsProps {
  rewards: RewardsArgs[];
  selectedRewards: RewardsArgs[];
  setSelectedRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}

const RewardCurrentCardDetails: React.FC<RewardCurrentCardDetailsProps> = ({
  rewards,
  selectedRewards,
  setSelectedRewards,
}) => {
  const triggerTypes = ["SIGNUP", "PURCHASE"] as const;
  const conditionTypes = ["referrer_conditions", "referee_conditions"] as const;
  const [visibleRewards, setVisibleRewards] = useState<boolean[]>(
    Array(rewards.length).fill(false),
  );
  const [selectAll, setSelectAll] = useState<boolean>(true);

  const toggleRewardDetails = (index: number) => {
    setVisibleRewards((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible)),
    );
  };

  const renderPaymentTiming = (type: PaymentTimingType | null | undefined) => {
    switch (type) {
      case PaymentTimingType.IMM:
        return "즉시 지급";
      case PaymentTimingType.DEL:
        return "추후 지급";
      default:
        return null;
    }
  };

  const renderPaymentFrequency = (
    type: PaymentFrequencyType | null | undefined,
  ) => {
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

  useEffect(() => {
    if (selectAll) {
      setSelectedRewards([...rewards]);
    }
  }, [selectAll, rewards, setSelectedRewards]);

  const handleCheckboxChange =
    (reward: RewardsArgs) => (e: ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setSelectedRewards((prevSelected) =>
        isChecked
          ? [...prevSelected, reward]
          : prevSelected.filter((r) => r.id !== reward.id),
      );
      setSelectAll(
        isChecked
          ? selectedRewards.length + 1 === rewards.length
          : selectedRewards.length - 1 === rewards.length,
      );
    };

  return (
    <div className="mt-4 rounded-xl border border-gray-100 bg-gray-100 p-4">
      <div className="flex items-center justify-between pb-2">
        <span className="text-lg font-bold text-gray-600">
          현재 세팅 된 리워드
        </span>
      </div>
      {rewards.map((reward, index) => (
        <div
          className="mb-4 rounded-xl bg-gray-300 p-4 text-sm"
          key={reward.id}
          id={`rewards_${reward.id}`}
        >
          <div
            className="flex items-center justify-between"
            onClick={() => toggleRewardDetails(index)}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`reward_${reward.id}`}
                name={`reward_${reward.id}`}
                checked={selectedRewards.some((r) => r.id === reward.id)}
                onChange={handleCheckboxChange(reward)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
                disabled={true}
              />
              <span className="text-base font-semibold">
                {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"} -{" "}
                {reward.reward_type === "COUPON"
                  ? reward.coupon_code
                  : `${(reward.point_amount ?? 0).toLocaleString()} 포인트`}
              </span>
            </div>
            <div
              className="text-blue-500"
              aria-expanded={visibleRewards[index]}
              aria-controls={`rewards_details_${reward.id}`}
            >
              {visibleRewards[index] ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </div>
          </div>

          {visibleRewards[index] && (
            <div className="mt-4 flex flex-col rounded-xl bg-white lg:flex-row">
              {triggerTypes.map((trigger) => {
                const conditions =
                  trigger === "SIGNUP"
                    ? reward.referrer_conditions?.SIGNUP
                    : reward.referrer_conditions?.PURCHASE;

                return (
                  <div key={trigger} className="w-full p-3">
                    <h4 className="mb-2 text-base font-bold">
                      {trigger === "SIGNUP" ? "회원가입" : "구매 후"}
                    </h4>
                    {conditionTypes.map((type) => {
                      const policy =
                        type === "referrer_conditions"
                          ? reward.referrer_conditions?.[trigger]
                          : reward.referee_conditions?.[trigger];

                      if (!policy) return null;

                      return (
                        <div
                          key={type}
                          className="min-h-[145px] w-full space-y-1 bg-gray-100 p-2"
                        >
                          <div className="mb-2 border-b pb-1 text-base">
                            {type === "referrer_conditions"
                              ? "추천인"
                              : "피추천인"}
                          </div>
                          <div className="flex">
                            <span className="flex w-[100px] items-center text-left text-sm text-gray-500">
                              지급 시점:
                            </span>
                            <span className="flex items-center text-sm">
                              {renderPaymentTiming(policy.payment_timing?.type)}
                            </span>
                          </div>
                          {policy.payment_timing?.delay_days != null && (
                            <div className="flex">
                              <span className="flex w-[100px] items-center text-left text-sm text-gray-500">
                                제공 일:
                              </span>
                              <span className="flex items-center text-sm">
                                {policy.payment_timing.delay_days} 일
                              </span>
                            </div>
                          )}
                          <div className="flex">
                            <span className="flex w-[100px] items-center text-left text-sm text-gray-500">
                              지급 방식:
                            </span>
                            <span className="flex items-center text-sm">
                              {renderPaymentFrequency(
                                policy.payment_frequency?.type,
                              )}
                            </span>
                          </div>
                          {policy.payment_frequency?.repeat_count != null && (
                            <div className="flex">
                              <span className="flex w-[100px] items-center text-left text-sm text-gray-500">
                                최대 지급 횟수:
                              </span>
                              <span className="flex items-center text-sm">
                                {policy.payment_frequency.repeat_count} 번
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RewardCurrentCardDetails;
