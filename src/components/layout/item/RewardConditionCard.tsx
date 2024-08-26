import React from "react";
import { RewardConditionsArgs, RewardType } from "@/pages/item/lib/types";

interface RewardConditionCardProps {
  reward_conditions: RewardConditionsArgs;
  reward_type: RewardType;
}

const RewardConditionCard: React.FC<RewardConditionCardProps> = ({ reward_conditions, reward_type }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-bold">Reward Information</h3>
      <p>
        <strong>Reward Type:</strong> {reward_type === RewardType.CO ? "Coupon" : "Point"}
      </p>
      {reward_type === RewardType.CO && reward_conditions.coupon_code && (
        <p>
          <strong>Coupon Code:</strong> {reward_conditions.coupon_code}
        </p>
      )}
      {reward_type === RewardType.PO && reward_conditions.point_amount && (
        <p>
          <strong>Point Amount:</strong> {reward_conditions.point_amount}
        </p>
      )}
      <div>
        <h4 className="font-bold mt-2">Referrer Policy</h4>
        <p>
          <strong>Trigger:</strong> {reward_conditions.referrer_policy.trigger}
        </p>
        <p>
          <strong>Payment Timing:</strong> {reward_conditions.referrer_policy.payment_timing.type}
        </p>
        {reward_conditions.referrer_policy.payment_timing.delay_days && (
          <p>
            <strong>Delay Days:</strong> {reward_conditions.referrer_policy.payment_timing.delay_days}
          </p>
        )}
        <p>
          <strong>Payment Frequency:</strong> {reward_conditions.referrer_policy.payment_frequency.type}
        </p>
        {reward_conditions.referrer_policy.payment_frequency.repeat_count && (
          <p>
            <strong>Repeat Count:</strong> {reward_conditions.referrer_policy.payment_frequency.repeat_count}
          </p>
        )}
      </div>
      <div>
        <h4 className="font-bold mt-2">Referee Policy</h4>
        <p>
          <strong>Trigger:</strong> {reward_conditions.referee_policy.trigger}
        </p>
        <p>
          <strong>Payment Timing:</strong> {reward_conditions.referee_policy.payment_timing.type}
        </p>
        {reward_conditions.referee_policy.payment_timing.delay_days && (
          <p>
            <strong>Delay Days:</strong> {reward_conditions.referee_policy.payment_timing.delay_days}
          </p>
        )}
        <p>
          <strong>Payment Frequency:</strong> {reward_conditions.referee_policy.payment_frequency.type}
        </p>
        {reward_conditions.referee_policy.payment_frequency.repeat_count && (
          <p>
            <strong>Repeat Count:</strong> {reward_conditions.referee_policy.payment_frequency.repeat_count}
          </p>
        )}
      </div>
    </div>
  );
};

export default RewardConditionCard;
