import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { CampaignListApiResponse } from "@/lib/campaign/types";
import CampaignListTable from "@/components/layout/campaign/rewards/CampaignListTable";
import { fetchPostCampaignRecords } from "@/lib/campaign/apis";
import CampaignRewardDetail from "@/components/layout/campaign/rewards/CampaignRewardDetail";
import { GetServerSidePropsContext } from "next";
import { ApiResponse } from "@/lib/types";

interface CampaignRewardsProps {
  apiResponse: CampaignListApiResponse;
  pageNum: string;
  setPageNum: (value: string) => void;
  startDate: string;
  endDate: string;
  pageSize: string;
  period: string;
  setPeriod: (value: string) => void;
  setLoading: (value: boolean) => void;
}

const CampaignRewards: React.FC<CampaignRewardsProps> = (
  {
    period,
    startDate,
    endDate,
    apiResponse,
    setPeriod,
    setLoading,
    pageNum,
    pageSize,
    setPageNum,
  },
  context: GetServerSidePropsContext,
) => {
  const [isRewardLoading, setIsRewardLoading] = useState(false);
  const [campaignId, setCampaignId] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [detailPageNum, setDetailPageNum] = useState("1");
  const detailPageSize = "10";
  const defaultApiResponse: ApiResponse = {
    status: "",
    message: "",
    error: undefined,
    data: [],
  };
  const [campaignRewardDetailResponse, setCampaignRewardDetailResponse] =
    useState<ApiResponse>(defaultApiResponse);
  useEffect(() => {
    if (apiResponse && Object.keys(apiResponse).length > 0) {
      setLoading(false);
    }
  }, [apiResponse]);

  const getNewCampaignRewardRecord = async () => {
    const response = await fetchPostCampaignRecords(
      campaignId,
      detailPageNum,
      detailPageSize,
      startDate,
      endDate,
      context,
    );
    setCampaignRewardDetailResponse(response);
  };
  useEffect(() => {
    if (campaignId || campaignId !== "") {
      setIsRewardLoading(true);
      try {
        setDetailPageNum("1");
        getNewCampaignRewardRecord();
      } catch (e) {
        console.error("Error fetching campaign reward records:", e);
      }
      setIsRewardLoading(false);
    }
  }, [campaignId]);
  return (
    <>
      <div style={{ maxHeight: "70vh" }}>
        <div className="mb-2 w-full pb-2">
          <div className="mb-2 flex w-full items-center border-b-[1px] pb-2">
            <div className="w-full">
              <div className="text-xl">캠페인 리워드 내역</div>
              <div className="text-sm font-normal text-gray-500">
                캠페인 리워드 내역입니다.
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[calc(100%-80px)] min-h-[430px] w-full gap-[20px]">
          <div className="flex h-full w-[300px] flex-col gap-[10px] rounded-xl bg-gray-100 p-[10px]">
            <div className="w-full text-left text-[14px] font-semibold">
              리워드를 확인할 캠페인을 선택해주세요
            </div>
            <CampaignListTable
              apiResponse={apiResponse}
              pageSize={pageSize}
              pageNum={pageNum}
              setCampaignId={setCampaignId}
              setCampaignName={setCampaignName}
              setPageNum={setPageNum}
            />
          </div>
          <div className="relative flex h-full w-full min-w-[50%] flex-col overflow-hidden rounded-xl bg-gray-100 p-[10px]">
            <div className="w-full pb-[8px] text-left text-xl font-bold">
              {campaignName} 리워드 지급내역
            </div>
            <div className="flex h-full flex-col items-start justify-center overflow-hidden rounded-xl bg-white p-[20px] text-center">
              <div className="flex h-full w-full flex-col items-center justify-center text-center">
                <CampaignRewardDetail
                  apiResponse={campaignRewardDetailResponse}
                  pageSize={detailPageSize}
                  pageNum={detailPageNum}
                  startDate={startDate}
                  endDate={endDate}
                  campaignId={campaignId}
                  isRewardLoading={isRewardLoading}
                  setPageNum={setDetailPageNum}
                  setIsRewardLoading={setIsRewardLoading}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[12px] flex h-fit w-fit rounded-xl bg-gray-100">
          <div className="pageOption flex w-fit items-center justify-center rounded-lg bg-gray-100 p-2">
            <div className="flex min-w-[70px] items-center gap-2 text-left text-sm">
              <label className="font-bold">내역기간</label>
            </div>
            <select
              className="font-sm"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="30">30일 전</option>
              <option value="60">60일 전</option>
              <option value="90">90일 전</option>
              <option value="120">120일 전</option>
            </select>
          </div>
          <div className="flex w-fit flex-col items-center justify-center rounded-lg bg-gray-100 p-[5px] text-gray-500">
            <div className="flex w-fit gap-[10px]">
              <a className="text-[12px] font-semibold">시작일: {startDate}</a>
              <a className="text-[12px] font-semibold">종료일: {endDate}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignRewards;
