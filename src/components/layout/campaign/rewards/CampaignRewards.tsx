import React, { useEffect, useState } from "react";
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

  setLoading: (value: boolean) => void;
}

const CampaignRewards: React.FC<CampaignRewardsProps> = (
  {
    startDate,
    endDate,
    apiResponse,
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
  const [campaignSearch, setCampaignSearch] = useState("");
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
      <div className="h-[72vh]">
        <div className="flex w-full pb-[5px]">
          <div className="mb-2 flex w-full items-center border-b-[1px] pb-[5px]">
            <div className="h-fit w-full">
              <div className="text-[18px]">캠페인 리워드 내역</div>
              <div className="text-[14px] font-normal text-gray-500">
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
            <div className="flex h-[30px] w-full items-center justify-center gap-[5px]">
              <label className="w-[100px] text-[12px]">캠페인 검색: </label>
              <input
                className="w-full p-2 text-[12px]"
                value={campaignSearch}
                type="text"
                placeholder="캠페인 이름을 입력해 주세요"
                onChange={(e) => setCampaignSearch(e.target.value)}
              ></input>
            </div>
            <CampaignListTable
              apiResponse={apiResponse}
              pageSize={pageSize}
              pageNum={pageNum}
              campaignSearch={campaignSearch}
              campaignId={campaignId}
              setCampaignId={setCampaignId}
              setCampaignName={setCampaignName}
              setPageNum={setPageNum}
            />
          </div>
          <div className="relative flex h-full w-full min-w-[50%] flex-col overflow-hidden rounded-xl bg-gray-100 p-[10px]">
            <div className="w-full text-left text-[18px] font-bold">
              리워드 지급내역
            </div>
            <div className="w-full pb-[8px] text-[15px] font-semibold">
              캠페인: <a className="font-normal">{campaignName}</a>
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
