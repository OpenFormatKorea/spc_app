import LoadingSpinner from "@/components/base/LoadingSpinner";
import { theadStyle, tbodyStyle } from "@/interfaces/tailwindCss";
import {
  fetchPostCampaignRecords,
  fetchRevokeReward,
} from "@/lib/campaign/apis";
import {
  CampaignRecordsProps,
  ReferralItem,
  RewardProps,
} from "@/lib/campaign/types";
import { useScrollPosition } from "@/lib/infinitescrollFunctions";
import { ApiResponse } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
interface CampaignRewardDetailProps {
  apiResponse: ApiResponse;
  pageSize: string;
  pageNum: string;
  startDate: string;
  endDate: string;
  campaignId: string;
  isRewardLoading: boolean;
  setPageNum: (value: string) => void;
  setIsRewardLoading: (value: boolean) => void;
}
interface ClickFetchRevokeReward {
  (
    base_user_id: string,
    signup_id: string,
    reward_trigger: string,
  ): Promise<void>;
}
interface UserRewardBlockProps {
  user: ReferralItem["referrer"] | ReferralItem["referee"];
  signup_id: string;
  clickFetchRevokeReward: ClickFetchRevokeReward;
}
const UserRewardBlock: React.FC<UserRewardBlockProps> = ({
  user,
  signup_id,
  clickFetchRevokeReward,
}) => (
  <td className={tbodyStyle}>
    <div className="flex w-full flex-col items-center justify-center">
      <div className="h-fit w-full text-left font-semibold">
        <label className="w-[120px] text-left text-[16px] font-semibold text-black">
          유저 ID:{" "}
        </label>
        <label className="max-w-[50px] overflow-hidden truncate text-ellipsis whitespace-nowrap text-[14px] text-gray-600">
          {user.base_user_id}
        </label>
      </div>
      <div className="my-[5px] flex h-fit w-full min-w-[150px] items-center justify-start gap-[5px]">
        <div className="flex h-fit w-full flex-col gap-[10px]">
          {user.rewards.map((reward: RewardProps, i: number) => (
            <div
              key={i}
              className={`flex h-fit w-full flex-col items-start justify-center rounded-lg border bg-gray-50 p-2 text-[14px]`}
            >
              <div className="flex h-[25px] w-full items-center text-left text-[18px] font-semibold">
                <label className="w-full text-gray-600">
                  {reward.reward_trigger === "SIGNUP" ? "회원가입" : "구매"} 후
                </label>
              </div>
              <div
                className={`flex h-fit w-full flex-col items-start gap-[5px] rounded-md text-gray-500`}
              >
                <div className="flex h-[25px] w-full items-center gap-[10px]">
                  <label className="w-[120px] text-left font-semibold text-black">
                    리워드 트리거:{" "}
                  </label>
                  <label className="w-full text-left text-gray-600">
                    {reward.reward_trigger === "SIGNUP" ? "회원가입" : "구매"}{" "}
                    후
                  </label>
                </div>
                <div className="flex h-[25px] w-full items-center gap-[10px]">
                  <label className="w-[120px] text-left font-semibold text-black">
                    리워드 종류:{" "}
                  </label>
                  <label className="w-full text-left text-gray-600">
                    {reward.reward_type === "POINT" ? "포인트" : "쿠폰"}
                  </label>
                </div>
                <div className="flex h-[25px] w-full items-center gap-[10px] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                  <label className="w-[120px] text-left font-semibold text-black">
                    {reward.reward_type === "POINT"
                      ? "포인트 액수: "
                      : "쿠폰 명: "}
                  </label>
                  <label className="w-full text-left text-gray-600">
                    {reward.reward_type === "POINT"
                      ? Number(reward.reward_value).toLocaleString()
                      : reward.coupon_title || reward.reward_value}{" "}
                  </label>
                  {reward.reward_type === "POINT" && (
                    <label>{reward.reward_value.toLocaleString()} 포인트</label>
                  )}
                </div>
                <div className="flex h-[25px] w-full items-center gap-[10px]">
                  <label className="w-[120px] text-left font-semibold text-black">
                    지급 시점:{" "}
                  </label>
                  <label className="w-full text-left text-gray-600">
                    {reward.reward_trigger === "PURCHASE" &&
                    reward.payment_timing.type === "DELAYED"
                      ? `${reward.payment_timing.delay_days}일 후`
                      : "즉시 지급"}
                  </label>
                </div>
                {!reward.status ? (
                  <>
                    <div className="flex h-[25px] w-full items-center justify-between">
                      <div className="flex w-full gap-[10px]">
                        <label className="w-[120px] text-left font-semibold text-black">
                          지급 현황:
                        </label>
                        <label className="w-full text-left font-bold text-red-500">
                          {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"}{" "}
                          미지급
                        </label>
                      </div>
                      {/* <div className="flex w-[120px] cursor-pointer items-center justify-center rounded-md bg-blue-500 p-1 text-[14px] text-white hover:bg-blue-600">
                        수동 지급
                      </div> */}
                    </div>
                  </>
                ) : (
                  <div className="flex h-[25px] w-full items-center">
                    <div className="flex w-full gap-[10px]">
                      <label className="w-[120px] text-left font-semibold text-black">
                        지급 현황:
                      </label>
                      <label className="w-full text-left font-bold text-blue-500">
                        {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"}{" "}
                        지급 완료
                      </label>
                    </div>
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
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </td>
);

const CampaignRewardDetail: React.FC<CampaignRewardDetailProps> = (
  {
    apiResponse,
    pageSize,
    pageNum,
    startDate,
    endDate,
    campaignId,
    isRewardLoading,
    setPageNum,
    setIsRewardLoading,
  },
  context: GetServerSidePropsContext,
) => {
  const defaultApiResponse: ApiResponse = {
    status: "",
    message: "",
    error: undefined,
    data: {
      total_count: 0,
      page: 0,
      page_size: 0,
      total_pages: 0,
      result: [],
    },
  };
  const [newApiResponse, setNewApiResponse] =
    useState<ApiResponse>(defaultApiResponse);

  const [campaigns, setCampaigns] = useState<CampaignRecordsProps>(
    newApiResponse.data.result,
  );
  const clickFetchRevokeReward = async (
    base_user_id: string,
    signup_id: string,
    reward_trigger: string,
  ) => {
    const confirmed = confirm("해당 리워드를 회수하시겠습니까?");
    if (!confirmed) return; // 👈 User cancelled — exit early
    try {
      const response: ApiResponse = await fetchRevokeReward(
        base_user_id,
        signup_id,
        reward_trigger,
        context,
      );
      if (response.status != 200) {
        alert("리워드 회수를 실패하였습니다.");
        console.error("error: ", response.status, response.message);
      } else {
        alert("리워드를 회수하였습니다.");
      }
    } catch (e) {
      console.error("error: ", e);
    }
  };
  // 무한 스크롤
  const { isBottom, scrollRef } = useScrollPosition(true);
  const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
  const totalCount = apiResponse?.data.total_count || 0;
  const getNextPage = totalCount > stackedDataAmount;
  let tableIndex = 0;

  const fetchNextPage = async () => {
    if (!getNextPage || !scrollRef.current) return;
    setIsRewardLoading(true);
    const currentPage = (parseInt(pageNum) + 1).toString();
    try {
      const newAPIResponse: ApiResponse = await fetchPostCampaignRecords(
        campaignId,
        currentPage,
        pageSize,
        startDate,
        endDate,
        context,
      );
      if (newAPIResponse.data.result && newAPIResponse.data.result.length > 0) {
        setNewApiResponse(newAPIResponse);
        setCampaigns((prev) => ({
          ...prev,
          total_count: newAPIResponse.data.total_count,
          page: newAPIResponse.data.page,
          page_size: newAPIResponse.data.page_size,
          total_pages: newAPIResponse.data.total_pages,
          result: [...prev.result, ...newAPIResponse.data.result],
        }));
      }
      setPageNum(currentPage);
    } catch (error) {
      console.error("Failed to fetch next page:", error);
    } finally {
      setIsRewardLoading(false);
    }
  };
  useEffect(() => {
    if (isBottom) {
      fetchNextPage();
    }
  }, [isBottom]);
  useEffect(() => {
    if (pageNum === "1" && apiResponse?.data) {
      setCampaigns(apiResponse.data);
    }
  }, [apiResponse]);

  return (
    <>
      <div
        ref={scrollRef}
        id="CRTableDiv"
        className="flex h-full max-h-[calc(58vh-30px)] w-[90%] flex-col overflow-x-hidden overflow-y-scroll rounded-xl border bg-white"
      >
        {isRewardLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black bg-opacity-10">
            <LoadingSpinner />
          </div>
        )}
        <table className="table w-full border border-gray-100 text-center">
          <thead>
            <tr className="w-full bg-gray-100">
              <th className={theadStyle + " w-[90px]"}></th>
              {/* <th className={theadStyle + " w-[90px]"}>가입 ID</th> */}
              <th className={theadStyle + " w-[110px]"}>생성일</th>
              <th
                className={
                  theadStyle + " w-[130px] min-w-[100px] max-w-[185px]"
                }
              >
                추천인 ID
              </th>
              <th
                className={
                  theadStyle + " w-[130px] min-w-[100px] max-w-[185px]"
                }
              >
                피추천인 ID
              </th>
            </tr>
          </thead>

          <tbody className="h-full">
            {campaigns?.result?.length > 0 ? (
              campaigns?.result?.map(
                (record: ReferralItem, index: number, arr) => {
                  const isSameAsPrevious =
                    index > 0 &&
                    record.referral_item_id === arr[index - 1].referral_item_id;
                  tableIndex = !isSameAsPrevious ? tableIndex + 1 : tableIndex;
                  return (
                    <tr
                      key={record.referral_item_id + "-" + index}
                      id={record.signup_id}
                      className={`${isSameAsPrevious ? "border-t-0" : "border-t"} ${index === campaigns.result.length - 1 ? "border-b" : ""} `}
                    >
                      <td
                        className={`${isSameAsPrevious ? "border-x" : "border-x"} bg-gray-50`}
                      >
                        <div className="flex w-full items-center justify-center">
                          <label className="w-[85px] text-[18px] font-bold">
                            {!isSameAsPrevious ? tableIndex : ""}
                          </label>
                        </div>
                      </td>
                      <td className={tbodyStyle + " w-[90px]"}>
                        {new Date(record.created_at).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </td>
                      <UserRewardBlock
                        user={record.referrer}
                        signup_id={record.signup_id}
                        clickFetchRevokeReward={clickFetchRevokeReward}
                      />
                      <UserRewardBlock
                        user={record.referee}
                        signup_id={record.signup_id}
                        clickFetchRevokeReward={clickFetchRevokeReward}
                      />
                    </tr>
                  );
                },
              )
            ) : (
              <tr>
                <td colSpan={5} className="p-[10px] text-center">
                  데이터가 없습니다.
                </td>
              </tr>
            )}

            {getNextPage && (
              <tr>
                <td colSpan={5} className="p-[10px] text-center">
                  스크롤하면 더 많은 리워드 지급내역을 보실 수 있습니다.{" "}
                  <button
                    onClick={() => fetchNextPage()}
                    className="items-center justify-center rounded-lg border bg-blue-500 px-[6px] py-[4px] text-white hover:bg-blue-700"
                  >
                    더보기
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="w-full pt-[4px] text-left text-[12px]">
        총 리워드:{" "}
        {new Intl.NumberFormat("en-US").format(
          Math.min(Number(totalCount), Number(pageNum) * Number(pageSize)),
        )}{" "}
        / {new Intl.NumberFormat("en-US").format(Number(totalCount))}개
      </div>
    </>
  );
};

export default CampaignRewardDetail;
