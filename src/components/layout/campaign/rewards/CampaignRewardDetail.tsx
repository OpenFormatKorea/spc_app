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
  campaignName: string;
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
    campaignName,
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
    defaultCampaignRecords,
  );
  // 무한 스크롤
  const { isBottom, scrollRef } = useScrollPosition(true);
  const theadStyle =
    "px-[15px] py-[10px] border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-[12px] py-[8px] text-[12px] border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";
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
        pageNum,
        pageSize,
        startDate,
        endDate,
        context,
      );
      if (newAPIResponse.data.result && newAPIResponse.data.result.length > 0) {
        setNewApiResponse(newAPIResponse);
        setCampaigns((prev) => ({
          ...prev,
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
    if (apiResponse?.data) {
      setCampaigns(apiResponse.data);
    }
  }, [apiResponse]);
  useEffect(() => {
    console.log("campaigns", campaigns);
  }, [campaigns]);

  return (
    <>
      <div
        ref={scrollRef}
        id="CRTableDiv"
        className="flex h-full max-h-[calc(58vh-30px)] w-full flex-col overflow-x-hidden overflow-y-scroll rounded-xl border bg-white"
      >
        <table className="table w-full border border-gray-100 text-center">
          <thead>
            <tr className="w-full bg-gray-100">
              <th className={theadStyle + " w-[150px]"}>ID</th>
              <th className={theadStyle + " w-[150px]"}>SignUp ID</th>
              <th className={theadStyle}>추천인 ID</th>
              <th className={theadStyle}>피추천인 ID</th>
              <th className={theadStyle}>생성일</th>
            </tr>
          </thead>

          <tbody className="h-full">
            {campaigns?.result?.length > 0 ? (
              campaigns?.result?.map((record: ReferralItem) => (
                <tr key={record.referral_item_id}>
                  <td className={tbodyStyle}>{record.referral_item_id}</td>
                  <td className={tbodyStyle}>{record.signup_id}</td>
                  <td className={tbodyStyle}>
                    <div className="flex flex-col items-start justify-start rounded-xl border p-[5px]">
                      <div className="text-[14px] font-semibold">
                        {record.referrer.base_user_id}
                      </div>
                      <div className="flex w-full flex-col gap-[5px]">
                        {record.referrer.rewards.map(
                          (reward: RewardProps, index: number) => (
                            <div
                              className="flex h-fit w-full items-center justify-center text-[13px]"
                              key={index}
                            >
                              <div
                                className={
                                  `flex h-fit w-fit min-w-[60px] items-center justify-center rounded-md text-white ` +
                                  `${
                                    reward.reward_type == "COUPON"
                                      ? "bg-green-500"
                                      : "bg-orange-300"
                                  }`
                                }
                              >
                                <div className="flex h-fit w-fit p-[5px] font-bold">
                                  {reward.reward_type}
                                </div>
                                <div className="flex h-fit w-fit gap-[5px] p-[5px]">
                                  <a className="font-bold">
                                    {reward.reward_value}
                                  </a>
                                  <a>포인트</a>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={tbodyStyle}>
                    <div className="flex flex-col items-start justify-start rounded-xl border p-[5px]">
                      <div className="text-[14px] font-semibold">
                        {record.referee.base_user_id}
                      </div>
                      <div className="flex w-full flex-col gap-[5px]">
                        {record.referee.rewards.map(
                          (reward: RewardProps, index: number) => (
                            <div
                              className="flex h-fit w-full items-center justify-center text-[13px]"
                              key={index}
                            >
                              <div
                                className={
                                  `flex h-fit w-fit min-w-[60px] items-center justify-center rounded-md text-white ` +
                                  `${
                                    reward.reward_type == "COUPON"
                                      ? "bg-green-500"
                                      : "bg-orange-300"
                                  }`
                                }
                              >
                                <div className="flex h-fit w-fit p-[5px] font-bold">
                                  {reward.reward_type}
                                </div>
                                <div className="flex h-fit w-fit gap-[5px] p-[5px]">
                                  <a className="font-bold">
                                    {reward.reward_value}
                                  </a>
                                  <a>포인트</a>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={tbodyStyle}>
                    {" "}
                    {new Date(record.created_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
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
    </>
  );
};

export default CampaignRewardDetail;
