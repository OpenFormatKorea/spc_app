import LoadingSpinner from "@/components/base/LoadingSpinner";
import { theadStyle, tbodyStyle } from "@/interfaces/tailwindCss";
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
interface UserRewardBlockProps {
  title: string;
  user: ReferralItem["referrer"] | ReferralItem["referee"];
}
const UserRewardBlock: React.FC<UserRewardBlockProps> = ({ title, user }) => (
  <td className={tbodyStyle}>
    <div className="flex w-full flex-col items-center justify-center">
      <div className="h-[25px] w-full text-left text-[14px] font-semibold">
        <a>{title}: </a>
        <a className="max-w-[50px] overflow-hidden truncate text-ellipsis whitespace-nowrap">
          {user.base_user_id}
        </a>
      </div>
      <div className="flex w-full min-w-[150px] max-w-[200px] items-center justify-start">
        <div className="flex w-full gap-[10px]">
          {user.rewards.map((reward: RewardProps, i: number) => (
            <div
              key={i}
              className="flex h-fit w-full flex-col items-start justify-center text-[13px]"
            >
              <div className="text-[16px] font-semibold">
                {reward.reward_trigger === "SIGNUP" ? "회원가입" : "구매 "}
              </div>
              <div
                className={`flex h-fit w-full flex-col items-start justify-center rounded-md border-2 bg-white p-[5px] text-gray-500 ${
                  reward.reward_trigger === "SIGNUP"
                    ? "border-green-500"
                    : "border-orange-300"
                }`}
              >
                <div className="flex w-fit max-w-[100px] gap-[5px] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                  <a className="text-[16px] font-bold">
                    {reward.reward_type === "POINT"
                      ? new Intl.NumberFormat("en-US").format(
                          Number(reward.reward_value),
                        )
                      : reward.coupon_title || reward.reward_value}{" "}
                  </a>
                  {reward.reward_type === "POINT" && (
                    <a>{reward.reward_value} 포인트</a>
                  )}
                </div>
                <div className="h-[20px] w-fit">
                  {reward.reward_trigger === "PURCHASE" &&
                  reward.payment_timing.type === "DELAYED"
                    ? `${reward.payment_timing.delay_days}일 후`
                    : ""}
                </div>
                {!reward.status ? (
                  <div className="w-full rounded-md bg-red-500 p-1 text-[12px] text-white">
                    {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"} 미지급
                  </div>
                ) : (
                  <div className="w-full rounded-md bg-blue-500 p-1 text-white">
                    지급완료
                  </div>
                )}
              </div>
              {!reward.status ? (
                <button className="mt-2 h-[28px] w-full cursor-pointer rounded-md border-2 border-blue-500 p-1 text-[12px] font-bold text-blue-500">
                  {reward.reward_type === "COUPON" ? "쿠폰" : "포인트"} 수동지급
                </button>
              ) : (
                <div className="w-full rounded-md bg-blue-500 p-1 text-white"></div>
              )}
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

  const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
  const totalCount = apiResponse?.data.total_count || 0;
  const getNextPage = totalCount > stackedDataAmount;
  let tableIndex = 0;
  //const [tableIndex, settTableIndex] = useState<number>(1);

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
              <th className={theadStyle + " w-[90px]"}>리워드 ID</th>
              <th className={theadStyle + " w-[90px]"}>가입 ID</th>
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
                  console.log("record", record);
                  return (
                    <tr
                      key={record.referral_item_id + "-" + index}
                      className={`${isSameAsPrevious ? "border-t-0" : "border-t"} ${index === campaigns.result.length - 1 ? "border-b" : ""} `}
                    >
                      <td
                        className={`${isSameAsPrevious ? "border-x" : "border-x"} bg-gray-50`}
                      >
                        <div className="flex w-full items-center justify-center">
                          <a className="w-[85px] text-[18px] font-bold">
                            {!isSameAsPrevious ? tableIndex : ""}
                          </a>
                        </div>
                      </td>
                      <td className={tbodyStyle + " w-[90px]"}>
                        <div className="flex w-full items-center justify-center">
                          <a className="w-[85px] text-[13px] font-semibold">
                            {record.signup_id}
                          </a>
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
                      <UserRewardBlock title="유저 ID" user={record.referrer} />
                      <UserRewardBlock title="유저 ID" user={record.referee} />
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
