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
    <div className="flex flex-col gap-[10px] rounded-lg border border-gray-100 bg-gray-100 p-[10px]">
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-bold text-gray-600">
          현재 세팅 된 리워드
        </span>
      </div>
      {rewards.map((reward, index) => (
        <div
          className="flex flex-col gap-[10px] rounded-lg bg-gray-200 p-[8px] text-[14px]"
          key={reward.id}
          id={`rewards_${reward.id}`}
        >
          <div
            className="flex items-center justify-between"
            onClick={() => toggleRewardDetails(index)}
          >
            <div className="flex items-center gap-[10px]">
              <input
                type="checkbox"
                id={`reward_${reward.id}`}
                name={`reward_${reward.id}`}
                checked={selectedRewards.some((r) => r.id === reward.id)}
                onChange={handleCheckboxChange(reward)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
                disabled={true}
              />
              <span className="text-[14px] font-semibold">
                {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"} -{" "}
                {reward.reward_type === "COUPON"
                  ? reward.coupon_title
                    ? `${reward.coupon_code} | ${reward.coupon_name ? reward.coupon_name : reward.coupon_title}`
                    : `${reward.coupon_code} | 쿠폰명 없음`
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
            <div className="flex w-full flex-col gap-[10px] rounded-xl bg-white p-[10px] lg:flex-row">
              {triggerTypes.map((trigger) => {
                const conditions =
                  trigger === "SIGNUP"
                    ? reward.referrer_conditions?.SIGNUP
                    : reward.referrer_conditions?.PURCHASE;

                return (
                  <div
                    key={trigger}
                    className="flex w-full flex-col gap-[10px]"
                  >
                    <div className="w-full text-[12px] font-bold">
                      {trigger === "SIGNUP" ? "회원가입" : "구매 후"}
                    </div>
                    {conditionTypes.map((type) => {
                      const policy =
                        type === "referrer_conditions"
                          ? reward.referrer_conditions?.[trigger]
                          : reward.referee_conditions?.[trigger];

                      if (!policy) return null;

                      return (
                        <div
                          key={type}
                          className="min-h-[165px] w-full gap-[10px] bg-gray-100 p-2"
                        >
                          <div className="w-full border-b text-[16px]">
                            {type === "referrer_conditions"
                              ? "추천인"
                              : "피추천인"}
                          </div>
                          <div className="flex w-full gap-[10px] p-[5px]">
                            <div className="w-fit text-gray-600">
                              지급 시점:
                            </div>
                            <div className="w-fit">
                              {renderPaymentTiming(policy.payment_timing?.type)}
                            </div>
                          </div>
                          {policy.payment_timing?.delay_days != null && (
                            <div className="flex w-full gap-[10px] p-[5px]">
                              <div className="w-fit text-gray-600">
                                제공 일:
                              </div>
                              <div className="w-fit">
                                {policy.payment_timing.delay_days} 일
                              </div>
                            </div>
                          )}
                          <div className="flex w-full gap-[10px] p-[5px]">
                            <div className="w-fit text-gray-600">
                              지급 방식:
                            </div>
                            <div className="w-fit">
                              {renderPaymentFrequency(
                                policy.payment_frequency?.type,
                              )}
                            </div>
                          </div>
                          {policy.payment_frequency?.repeat_count != null && (
                            <div className="flex w-full gap-[10px] p-[5px]">
                              <div className="w-fit text-gray-600">
                                최대 지급 횟수:
                              </div>
                              <div className="w-fit">
                                {policy.payment_frequency.repeat_count} 번
                              </div>
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
