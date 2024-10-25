import React, { useEffect, useState, ChangeEvent } from "react";
import {
  PaymentFrequencyType,
  PaymentTimingType,
  RewardsArgs,
} from "@/lib/item/types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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

  const labelClass =
    "flex items-center text-sm text-left text-gray-500 w-[100px]";
  const inputFormClass = "flex items-center text-sm";

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

  const handleSelectAll = () => {
    const isChecked = !selectAll;
    setSelectAll(isChecked);
    setSelectedRewards(isChecked ? [...rewards] : []);
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
    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-200 p-4">
      <div className="flex items-center justify-between px-2 pb-2">
        <span className="text-lg font-bold text-gray-600">
          현재 세팅 된 리워드
        </span>
      </div>

      <div className="mb-2 flex items-start rounded-md px-1 py-1 text-sm">
        <label htmlFor="reward_all" className="flex items-center gap-1">
          <input
            type="checkbox"
            id="reward_all"
            name="reward_all"
            checked={selectAll}
            onChange={handleSelectAll}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <span className="text-xs font-bold">리워드 전체 선택</span>
        </label>
      </div>

      {rewards.map((reward, index) => (
        <div
          className="mb-4 rounded-xl bg-gray-100 p-4 text-sm"
          key={reward.id}
          id={`rewards_${reward.id}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`reward_${reward.id}`}
                name={`reward_${reward.id}`}
                checked={selectedRewards.some((r) => r.id === reward.id)}
                onChange={handleCheckboxChange(reward)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-base font-semibold">
                {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"} -{" "}
                {reward.reward_type === "COUPON"
                  ? reward.coupon_code
                  : `${(reward.point_amount ?? 0).toLocaleString()} 포인트`}
              </span>
            </div>
            <button
              type="button"
              className="text-blue-500 focus:outline-none"
              onClick={() => toggleRewardDetails(index)}
              aria-expanded={visibleRewards[index]}
              aria-controls={`rewards_details_${reward.id}`}
            >
              <KeyboardArrowDownIcon />
            </button>
          </div>

          {visibleRewards[index] && (
            <div
              className="mt-4 flex flex-col rounded-xl bg-white lg:flex-row"
              id={`rewards_details_${reward.id}`}
            >
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
                            <span className={labelClass}>지급 시점:</span>
                            <span className={inputFormClass}>
                              {renderPaymentTiming(policy.payment_timing.type)}
                            </span>
                          </div>
                          {policy.payment_timing.delay_days != null && (
                            <div className="flex">
                              <span className={labelClass}>
                                {trigger === "SIGNUP"
                                  ? "회원가입 후"
                                  : "구매 후"}{" "}
                                제공 일:
                              </span>
                              <span className={inputFormClass}>
                                {(
                                  policy.payment_timing.delay_days ?? 0
                                ).toLocaleString()}
                                일
                              </span>
                            </div>
                          )}
                          <div className="flex">
                            <span className={labelClass}>지급 방식:</span>
                            <span className={inputFormClass}>
                              {renderPaymentFrequency(
                                policy.payment_frequency.type,
                              )}
                            </span>
                          </div>
                          {policy.payment_frequency.repeat_count != null && (
                            <div className="flex">
                              <span className={labelClass}>
                                최대 지급 횟수:
                              </span>
                              <span className={inputFormClass}>
                                {(
                                  policy.payment_frequency.repeat_count ?? 0
                                ).toLocaleString()}
                                번
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
