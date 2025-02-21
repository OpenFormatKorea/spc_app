import LoadingSpinner from "@/components/base/LoadingSpinner";
import { fetchPostCampaignRecords } from "@/lib/campaign/apis";
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
  const defaultCampaignRecords: CampaignRecordsProps = {
    total_count: 0,
    page: 0,
    page_size: 0,
    total_pages: 0,
    result: [],
  };
  const [campaigns, setCampaigns] = useState<CampaignRecordsProps>(
    newApiResponse.data.result,
  );
  // 무한 스크롤
  const { isBottom, scrollRef } = useScrollPosition(true);
  const theadStyle =
    "px-[15px] py-[10px] border-b border-gray-200 text-left text-sm font-semibold text-gray-700 text-center";
  const tbodyStyle =
    "px-[12px] py-[8px] justify-center text-[12px] border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";
  const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
  const totalCount = apiResponse?.data.total_count || 0;
  const getNextPage = totalCount > stackedDataAmount;

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
        className="flex h-full max-h-[calc(58vh-30px)] w-full flex-col overflow-x-hidden overflow-y-scroll rounded-xl border bg-white"
      >
        {isRewardLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black bg-opacity-10">
            <LoadingSpinner />
          </div>
        )}
        <table className="table w-full border border-gray-100 text-center">
          <thead>
            <tr className="w-full bg-gray-100">
              <th className={theadStyle + " w-[90px]"}>리워드 ID</th>
              <th className={theadStyle + " w-[90px]"}>가입 ID</th>
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
              <th className={theadStyle + " w-[110px]"}>생성일</th>
            </tr>
          </thead>

          <tbody className="h-full">
            {campaigns?.result?.length > 0 ? (
              campaigns?.result?.map(
                (record: ReferralItem, index: number, arr) => {
                  const isSameAsPrevious =
                    index > 0 &&
                    record.referral_item_id === arr[index - 1].referral_item_id;
                  return (
                    <tr
                      key={record.referral_item_id + "-" + index}
                      className={`${isSameAsPrevious ? "border-t-0" : "border-t"} ${index === campaigns.result.length - 1 ? "border-b" : ""} `}
                    >
                      <td
                        className={`${isSameAsPrevious ? "border-x" : "border-x"} bg-gray-50`}
                      >
                        <div className="flex w-full items-center justify-center">
                          <a className="w-[85px] text-[13px] font-semibold">
                            {!isSameAsPrevious ? record.referral_item_id : ""}
                          </a>
                        </div>
                      </td>
                      <td className={tbodyStyle}>
                        <div className="flex w-full items-center justify-center">
                          <a className="w-[85px] text-[13px] font-semibold">
                            {record.signup_id}
                          </a>
                        </div>
                      </td>
                      <td className={tbodyStyle}>
                        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-gray-100 p-[4px]">
                          <div className="w-full p-[5px] text-left text-[12px] font-semibold">
                            <a>유저 ID: </a>
                            <a className="font-normal">
                              {record.referrer.base_user_id}
                            </a>
                          </div>
                          <div className="flex min-w-[180px] items-center justify-center rounded-xl border p-[5px]">
                            <div className="flex min-w-[200px] gap-[5px]">
                              {record.referrer.rewards.map(
                                (reward: RewardProps, i: number) => (
                                  <div
                                    className="flex h-fit w-full items-center justify-center text-[13px]"
                                    key={i}
                                  >
                                    <div
                                      className={
                                        `flex h-fit w-[160px] max-w-[160px] items-center justify-center rounded-md text-white ` +
                                        `${
                                          reward.reward_trigger === "SIGNUP"
                                            ? "bg-green-500"
                                            : "bg-orange-300"
                                        }`
                                      }
                                    >
                                      <div className="flex h-fit w-fit flex-col p-[5px] font-bold">
                                        <div className="w-[75px]">
                                          {reward.reward_trigger === "SIGNUP"
                                            ? "회원가입"
                                            : "구매 "}
                                          {reward.reward_trigger ===
                                            "PURCHASE" &&
                                          reward.payment_timing.type ===
                                            "DELAYED"
                                            ? `${reward.payment_timing.delay_days}일 후`
                                            : " 즉시"}
                                        </div>
                                        {!reward.status ? (
                                          <div className="rounded-sm bg-red-500 text-white">
                                            {reward.reward_type === "COUPON"
                                              ? "쿠폰"
                                              : "포인트"}{" "}
                                            미지급
                                          </div>
                                        ) : (
                                          <div className="rounded-sm bg-blue-500 text-white">
                                            지급완료
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex w-fit gap-[5px] p-[5px]">
                                        <a className="font-bold">
                                          {Number.isInteger(
                                            Number(reward.reward_value),
                                          )
                                            ? new Intl.NumberFormat(
                                                "en-US",
                                              ).format(
                                                Number(reward.reward_value),
                                              )
                                            : reward.reward_value}{" "}
                                        </a>
                                        {Number.isInteger(
                                          Number(reward.reward_value),
                                        ) && <a> 포인트</a>}
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={tbodyStyle}>
                        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-gray-100 p-[4px]">
                          <div className="w-full p-[5px] text-left text-[12px] font-semibold">
                            <a>유저 ID: </a>{" "}
                            <a className="font-normal">
                              {record.referee.base_user_id}
                            </a>
                          </div>
                          <div className="flex min-w-[180px] items-center justify-center rounded-xl border p-[5px]">
                            <div className="flex min-w-[200px] gap-[5px]">
                              {record.referee.rewards.map(
                                (reward: RewardProps, i: number) => (
                                  <div
                                    className="flex h-fit w-full items-center justify-center text-[13px]"
                                    key={i}
                                  >
                                    <div
                                      className={
                                        `flex h-fit w-[160px] max-w-[160px] items-center justify-center rounded-md text-white ` +
                                        `${
                                          reward.reward_trigger === "SIGNUP"
                                            ? "bg-green-500"
                                            : "bg-orange-300"
                                        }`
                                      }
                                    >
                                      <div className="flex h-fit w-fit flex-col p-[5px] font-bold">
                                        <div>
                                          {reward.reward_trigger === "SIGNUP"
                                            ? "회원가입"
                                            : "구매 "}
                                          {reward.reward_trigger ===
                                            "PURCHASE" &&
                                          reward.payment_timing.type ===
                                            "DELAYED"
                                            ? `${reward.payment_timing.delay_days}일 후`
                                            : ""}
                                        </div>
                                        {!reward.status ? (
                                          <div className="rounded-sm bg-red-500 text-white">
                                            {reward.reward_type === "COUPON"
                                              ? "쿠폰"
                                              : "포인트"}{" "}
                                            미지급
                                          </div>
                                        ) : (
                                          <div className="rounded-sm bg-blue-500 text-white">
                                            지급완료
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex w-fit gap-[5px] p-[5px]">
                                        <a className="font-bold">
                                          {Number.isInteger(
                                            Number(reward.reward_value),
                                          )
                                            ? new Intl.NumberFormat(
                                                "en-US",
                                              ).format(
                                                Number(reward.reward_value),
                                              )
                                            : reward.reward_value}{" "}
                                        </a>
                                        {Number.isInteger(
                                          Number(reward.reward_value),
                                        ) && <a> 포인트</a>}
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={tbodyStyle}>
                        {new Date(record.created_at).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </td>
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
                  스크롤하면 더 많은 캠페인 통계를 보실 수 있습니다.
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
