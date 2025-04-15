import LoadingSpinner from "@/components/base/LoadingSpinner";
import UserRewardBlock from "@/components/layout/campaign/rewards/UserRewardBlock";
import { theadStyle, tbodyStyle } from "@/interfaces/tailwindCss";
import {
  fetchPostCampaignRecords,
  fetchRevokeReward,
} from "@/lib/campaign/apis";
import {
  CampaignRecordsProps,
  ReferralItem,
  RewardProps,
  RewradStatus,
} from "@/lib/campaign/types";
import { removeWhiteSpace } from "@/lib/common";
import { useScrollPosition } from "@/lib/infinitescrollFunctions";
import { ApiResponse } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
interface CampaignRewardDetailProps {
  apiResponse: ApiResponse;
  pageSize: string;
  pageNum: string;
  setPageNum: (value: string) => void;
  startDate: string;
  endDate: string;
  campaignId: string;
  userId: string;
  setUserId: (value: string) => void;
  isRewardLoading: boolean;
  setIsRewardLoading: (value: boolean) => void;
}
const CampaignRewardDetail: React.FC<CampaignRewardDetailProps> = (
  {
    apiResponse,
    pageSize,
    pageNum,
    setPageNum,
    startDate,
    endDate,
    campaignId,
    userId,
    setUserId,
    isRewardLoading,
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
  const totalCount = newApiResponse?.data?.total_count || 0;
  const getNextPage = totalCount > stackedDataAmount;
  let tableIndex = 0;

  const fetchRewarDetails = async (reset = false) => {
    if (!getNextPage && !reset) return;
    setIsRewardLoading(true);

    try {
      const currentPage = reset ? "1" : (parseInt(pageNum) + 1).toString();
      const newAPIResponse: ApiResponse = await fetchPostCampaignRecords(
        campaignId,
        currentPage,
        pageSize,
        startDate,
        endDate,
        userId,
        context,
      );

      if (newAPIResponse.data.result && newAPIResponse.data.result.length > 0) {
        setNewApiResponse(newAPIResponse);
        setCampaigns(
          reset
            ? newAPIResponse.data
            : (prev) => ({
                ...prev,
                total_count: newAPIResponse.data.total_count,
                page: newAPIResponse.data.page,
                page_size: newAPIResponse.data.page_size,
                total_pages: newAPIResponse.data.total_pages,
                result: [...prev.result, ...newAPIResponse.data.result],
              }),
        );
      } else if (
        newAPIResponse.data.result &&
        newAPIResponse.data.result.length == 0
      ) {
        setNewApiResponse(newAPIResponse);
        setCampaigns(newAPIResponse.data);
      }
      setPageNum(currentPage);
    } catch (error) {
      console.error("Failed to fetch next page:", error);
    } finally {
      setIsRewardLoading(false);
    }
  };

  const fetchforSearch = () => fetchRewarDetails(true); // 검색
  const fetchNextPage = () => fetchRewarDetails(); // 다음 무한 스크롤 페이지

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
      <div className="flex h-[40px] w-full items-center justify-end rounded-md">
        <div className="flex h-fit w-fit items-end gap-[5px] pb-2">
          <div className="h-fit w-fit text-center text-[14px] font-semibold text-gray-600">
            리워드 검색:{" "}
          </div>
          <input
            type="text"
            className="h-fit w-[250px] border-b border-b-gray-400 p-1 text-left"
            value={userId}
            onChange={(e) => setUserId(removeWhiteSpace(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchforSearch();
              }
            }}
          />
          <button
            onClick={fetchforSearch}
            className="flex w-[55px] items-center justify-center rounded-md bg-blue-500 p-1 text-center text-white hover:bg-blue-600"
          >
            검색
          </button>
        </div>
      </div>
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
              <th className={theadStyle + " w-[10%]"}></th>
              {/* <th className={theadStyle + " w-[90px]"}>가입 ID</th> */}
              <th className={theadStyle + " w-[10%]"}>생성일</th>
              <th
                className={theadStyle + " w-[40%] min-w-[100px] max-w-[185px]"}
              >
                추천인 ID
              </th>
              <th
                className={theadStyle + " w-[40%] min-w-[100px] max-w-[185px]"}
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
      <div className="wf w-full">
        <div className="w-full pt-[4px] text-left text-[12px]">
          총 리워드:{" "}
          {new Intl.NumberFormat("en-US").format(
            Math.min(Number(totalCount), Number(pageNum) * Number(pageSize)),
          )}{" "}
          / {new Intl.NumberFormat("en-US").format(Number(totalCount))}개
        </div>
      </div>
    </>
  );
};

export default CampaignRewardDetail;
