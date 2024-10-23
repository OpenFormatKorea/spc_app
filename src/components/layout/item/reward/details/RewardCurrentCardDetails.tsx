import React, { useEffect, useState } from "react";
import {
  PaymentFrequencyType,
  PaymentTimingType,
  RewardsArgs,
} from "@/lib/item/types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface RewardCurrentCardDetailsdProps {
  rewards: RewardsArgs[];
  selectedRewards: RewardsArgs[];
  setSelectedRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}

const RewardCurrentCardDetails: React.FC<RewardCurrentCardDetailsdProps> = ({
  rewards,
  selectedRewards,
  setSelectedRewards,
}) => {
  const triggerTypes = ["SIGNUP", "PURCHASE"] as const;
  const conditionTypes = ["referrer_conditions", "referee_conditions"] as const;
  const labelClass =
    "labelClass flex items-center text-sm text-left text-gray-500 w-[100px]";
  const inputFormClass = "inputForm flex items-center text-sm";
  const [visibleRewards, setVisibleRewards] = useState(
    Array(rewards.length).fill(false),
  );

  const [selectAll, setSelectAll] = useState(true);

  const toggleRewardDetails = (index: number) => {
    setVisibleRewards((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible)),
    );
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

  const handleSelectAll = () => {
    const isChecked = !selectAll;
    setSelectAll(isChecked);

    if (isChecked) {
      setSelectedRewards([...rewards]);
    } else {
      setSelectedRewards([]);
    }
  };

  useEffect(() => {
    if (selectAll) {
      setSelectedRewards(rewards);
    }
  }, [selectAll, rewards, setSelectedRewards]);

  const handleCheckboxChange =
    (reward: RewardsArgs) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setSelectedRewards((prevSelected) => {
        if (isChecked) {
          return [...prevSelected, reward];
        } else {
          return prevSelected.filter((r) => r.id !== reward.id);
        }
      });
      const allSelected =
        selectedRewards.length + (isChecked ? 1 : -1) === rewards.length;
      setSelectAll(allSelected);
    };
  return (
    <>
      <div className="mt-4 rounded-xl border-[1px] border-blue-200 bg-blue-200 p-4">
        <div className="flex items-center justify-between px-2 pb-2">
          <span className="items-center text-lg font-bold text-gray-600">
            현재 세팅 된 리워드
          </span>
        </div>
        <div className="mb-2 flex w-fit items-start rounded-md px-1 py-1 text-sm">
          <div className="flex items-center gap-1">
            <div className="items-center">
              <input
                type="checkbox"
                id="reward_all"
                name="reward_all"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </div>
            <div className="items-center text-xs font-bold">
              리워드 전체 선택
            </div>
          </div>
        </div>
        {rewards.map((reward, index) => (
          <div
            className="mb-4 rounded-xl bg-gray-100 p-4 text-sm"
            key={index}
            id={`rewards_${index}`}
          >
            <div className="items-left flex justify-between">
              <div className="items-left flex justify-start gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`reward_${reward.id}`}
                    name={`reward_${reward.id}`}
                    checked={selectedRewards.some((r) => r.id === reward.id)}
                    onChange={handleCheckboxChange(reward)}
                  />
                </div>
                <div className="text-center text-base font-semibold">
                  {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"} -{" "}
                  {reward.reward_type === "COUPON"
                    ? reward.coupon_code
                    : `${reward.point_amount} 포인트`}
                </div>
              </div>
              <div
                className="cursor-pointer text-blue-500"
                onClick={() => toggleRewardDetails(index)}
              >
                {<KeyboardArrowDownIcon />}
              </div>
            </div>
            {visibleRewards[index] && (
              <div
                className="flex w-full flex-col rounded-xl bg-white lg:flex-row"
                id={`rewards_details_${index}`}
              >
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
                                {renderPaymentTiming(
                                  policy?.payment_timing.type,
                                )}
                              </div>
                            </div>
                            {policy?.payment_timing.delay_days != null && (
                              <div className="flex">
                                <div className={labelClass}>
                                  {trigger === "SIGNUP"
                                    ? "회원가입 후"
                                    : "구매 후"}{" "}
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
                                <div className={labelClass}>
                                  최대 지급 횟수:
                                </div>
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
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default RewardCurrentCardDetails;
