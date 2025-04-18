import {
  ReferralItem,
  RefTarget,
  RewardProps,
  RewradStatus,
} from "@/lib/campaign/types";
import React from "react";

interface ClickFetchRevokeReward {
  (
    base_user_id: string,
    signup_id: string,
    reward_trigger: string,
  ): Promise<void>;
}
interface ClickFetchIssueReward {
  (
    base_user_id: string,
    signup_id: string,
    reward_trigger: string,
    reward_id: number,
    reward_target: string,
    record_id: string,
  ): Promise<void>;
}

interface UserRewardBlockProps {
  user: ReferralItem["referrer"] | ReferralItem["referee"];
  reward_target: RefTarget;
  signup_id: string;
  clickFetchRevokeReward: ClickFetchRevokeReward;
  clickFetchIssueReward: ClickFetchIssueReward;
}
const UserRewardBlock: React.FC<UserRewardBlockProps> = ({
  user,
  reward_target,
  signup_id,
  clickFetchRevokeReward,
  clickFetchIssueReward,
}) => {
  return (
    <td
      className={`whitespace-normal break-words break-all border-b border-gray-200 p-2 text-center align-top text-[13px]`}
    >
      <div className="flex h-full w-full min-w-[150px] flex-col items-start justify-start gap-[5px]">
        <div className="flex h-[60px] w-full flex-col rounded-md bg-gray-200 p-3 lg:w-1/2">
          <div className="w-full text-left text-[12px] text-gray-500">유저</div>
          <div className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap text-left text-[14px] font-semibold text-black">
            {user.base_user_id}
          </div>
        </div>
        <div className="flex h-fit w-full flex-col gap-[10px]">
          {user.rewards.map((reward: RewardProps, i: number) => (
            <div
              key={i}
              className="flex h-fit min-h-[180px] w-full flex-col items-start justify-start gap-[5px] rounded-md border-2 p-2 text-[14px]"
            >
              <div className="flex w-full flex-col gap-[5px] lg:flex-row">
                <div className="flex h-[60px] w-full flex-col items-start rounded-md bg-gray-200 p-3 lg:w-1/2">
                  <div className="w-full text-left text-[12px] text-gray-500">
                    리워드 종류
                  </div>
                  <div className="w-full text-left text-[14px] font-semibold text-black">
                    {reward.reward_type === "POINT" ? "포인트" : "쿠폰"}
                  </div>
                </div>
                <div className="flex h-[60px] w-full flex-col items-start rounded-md bg-gray-200 p-3 lg:w-1/2">
                  <div className="w-full text-left text-[12px] text-gray-500">
                    {reward.reward_type === "POINT" ? "포인트 액수" : "쿠폰 명"}
                  </div>
                  <div className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap text-left text-[14px] font-semibold text-black">
                    {reward.reward_type === "POINT"
                      ? Number(reward.reward_value).toLocaleString()
                      : reward.coupon_title || reward.reward_value}{" "}
                  </div>
                  {reward.reward_type === "POINT" && (
                    <label>{reward.reward_value.toLocaleString()} 포인트</label>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-col gap-[5px] lg:flex-row">
                <div className="flex h-[60px] w-full flex-col items-start rounded-md bg-gray-200 p-3 lg:w-1/2">
                  <div className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap text-left text-[12px] text-gray-500">
                    리워드 트리거 & 지급 시점
                  </div>
                  <div className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap text-left text-[12px] text-gray-500">
                    <label className="w-fit text-left text-[14px] font-semibold text-black">
                      {reward.reward_trigger === "SIGNUP" ? "회원가입" : "구매"}{" "}
                      후{" "}
                    </label>
                    <label className="w-fit text-left text-[14px] font-semibold text-black">
                      {reward.reward_trigger === "PURCHASE" &&
                      reward.payment_timing.type === "DELAYED"
                        ? `${reward.payment_timing.delay_days}일 후`
                        : "즉시 지급"}
                    </label>
                  </div>
                </div>
                <div
                  className={`flex h-[60px] w-full flex-col items-start rounded-md p-3 lg:w-1/2 ${reward.status === RewradStatus.P ? "bg-green-500" : reward.status === RewradStatus.S ? "bg-blue-500" : reward.status === RewradStatus.C ? "bg-orange-500" : reward.status === RewradStatus.F ? "bg-red-500" : "bg-green-500"}`}
                >
                  <div className="w-full text-left text-[12px] text-white">
                    지급 현황
                  </div>
                  <div className="w-full text-left text-[14px] font-semibold text-white">
                    <label className={`w-full text-left font-bold`}>
                      {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"}{" "}
                      {reward.status === RewradStatus.P
                        ? "지급 전"
                        : reward.status === RewradStatus.S
                          ? "지급 성공"
                          : reward.status === RewradStatus.C
                            ? "지급 취소"
                            : reward.status === RewradStatus.F
                              ? "지급 실패"
                              : " 지급 전"}
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-end">
                {reward.status === RewradStatus.S ? (
                  <div
                    className="flex w-[120px] cursor-pointer items-center justify-center rounded-md bg-red-500 p-1 text-[14px] text-white hover:bg-red-600"
                    onClick={() =>
                      clickFetchRevokeReward(
                        user.base_user_id,
                        signup_id,
                        reward.reward_trigger,
                      )
                    }
                  >
                    {reward.reward_type === "POINT" ? "포인트" : "쿠폰"} 회수
                  </div>
                ) : reward.status === RewradStatus.F || RewradStatus.P ? (
                  <div
                    className="flex w-[120px] cursor-pointer items-center justify-center rounded-md bg-blue-500 p-1 text-[14px] text-white hover:bg-blue-600"
                    onClick={() =>
                      clickFetchIssueReward(
                        user.base_user_id,
                        signup_id,
                        reward.reward_trigger,
                        reward.id,
                        reward_target,
                        reward.record_id,
                      )
                    }
                  >
                    {reward.reward_type === "POINT" ? "포인트" : "쿠폰"} 수동
                    지급
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </td>
  );
};

export default UserRewardBlock;
