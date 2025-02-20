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
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const CampaignRewards: React.FC<CampaignRewardsProps> = (
  {
    period,
    startDate,
    endDate,
    apiResponse,
    setPeriod,
    loading,
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
  const [detailPageSize, setDetailPageSize] = useState("10");
  const defaultApiResponse: ApiResponse = {
    status: "", // Default empty string or "200" if you expect a successful response
    message: "",
    error: undefined,
    data: [], // Or an empty object {} if needed
  };
  const [campaignRewardDetailResponse, setCampaignRewardDetailResponse] =
    useState<ApiResponse>(defaultApiResponse);
  useEffect(() => {
    if (apiResponse && Object.keys(apiResponse).length > 0) {
      setLoading(false);
    }
  }, [apiResponse]);

  const getNewCampaignRewardRecord = async () => {
    try {
      const response = await fetchPostCampaignRecords(
        campaignId,
        detailPageNum,
        detailPageSize,
        startDate,
        endDate,
        context,
      );
      setCampaignRewardDetailResponse(response);
    } catch (error) {
      console.error("Error fetching campaign reward records:", error);
    }
  };
  useEffect(() => {
    if (campaignId || campaignId !== "") {
      getNewCampaignRewardRecord();
    }
  }, [campaignId]);
  return (
    <>
      <div style={{ maxHeight: "70vh" }}>
        <div className="mb-2 w-full pb-2">
          <div className="mb-2 flex w-full items-center border-b-[1px] pb-2">
            <div className="w-[80%]">
              <div className="text-xl">캠페인 리워드 내역</div>
              <div className="text-sm font-normal text-gray-500">
                캠페인 리워드 내역입니다.
              </div>
            </div>
          </div>
        </div>
        {/* <div className="h-[calc(100%-80px)] w-full gap-[20px] rounded-lg border border-gray-100 bg-gray-100 p-[20px]"> */}
        <div className="flex h-[calc(100%-80px)] min-h-[430px] w-full gap-[20px]">
          <div className="flex h-full w-[300px] flex-col gap-[10px] rounded-xl bg-gray-100 p-[10px]">
            <div className="w-full text-left text-[14px] font-semibold">
              리워드 확인을 원하는
              <br />
              캠페인을 선택해주세요
            </div>
            <CampaignListTable
              apiResponse={apiResponse}
              pageSize={pageSize}
              pageNum={pageNum}
              campaignId={campaignId}
              setCampaignId={setCampaignId}
              setCampaignName={setCampaignName}
              setPageNum={setDetailPageNum}
              setLoading={setLoading}
              setIsRewardLoading={setIsRewardLoading}
            />
          </div>
          <div className="relative flex h-full w-full min-w-[50%] flex-col overflow-hidden rounded-xl bg-gray-100 p-[10px]">
            {isRewardLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black bg-opacity-10">
                <LoadingSpinner />
              </div>
            )}
            <h1 className="w-full text-left text-xl font-bold">
              {campaignName} 리워드 지급내역
            </h1>
            <div className="mt-[10px] flex h-full flex-col items-start justify-center overflow-hidden rounded-xl bg-white p-[20px] text-center">
              <div className="flex h-full w-full flex-col items-center justify-center text-center">
                <CampaignRewardDetail
                  apiResponse={campaignRewardDetailResponse}
                  campaignId={campaignId}
                  pageSize={detailPageSize}
                  pageNum={detailPageNum}
                  startDate={startDate}
                  endDate={endDate}
                  campaignName={campaignName}
                  setPageNum={setDetailPageNum}
                  setIsRewardLoading={setLoading}
                />
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
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
