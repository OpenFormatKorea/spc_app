import LoadingSpinner from "@/components/base/LoadingSpinner";
import { fetchGetCampaignList } from "@/lib/campaign/apis";
import { CampaignArgs, CampaignListApiResponse } from "@/lib/campaign/types";
import { useScrollPosition } from "@/lib/infinitescrollFunctions";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
interface CampaignListTableProps {
  apiResponse: CampaignListApiResponse;
  pageSize: string;
  pageNum: string;
  setCampaignName: (value: string) => void;
  setCampaignId: (value: string) => void;
  setPageNum: (value: string) => void;
}

const CampaignListTable: React.FC<CampaignListTableProps> = (
  {
    apiResponse,
    pageSize,
    pageNum,
    setCampaignName,
    setCampaignId,
    setPageNum,
  },
  context: GetServerSidePropsContext,
) => {
  const [isListLoading, setIsListLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignArgs[]>(
    apiResponse?.result ?? [],
  );

  // 무한 스크롤
  const { isBottom, scrollRef } = useScrollPosition(true);
  const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
  const totalCount = apiResponse?.total_count || 0;
  const getNextPage = totalCount > stackedDataAmount;

  const fetchNextPage = async () => {
    if (!getNextPage || !scrollRef.current || isListLoading) return;
    setIsListLoading(true);
    const currentPage = (parseInt(pageNum) + 1).toString();
    try {
      const newData = await fetchGetCampaignList(
        currentPage,
        pageSize,
        context,
      );
      if (newData?.result && newData.result.length > 0) {
        setCampaigns((prev) => [...prev, ...newData.result]);
      }
      setPageNum(currentPage);
    } catch (error) {
      console.error("Failed to fetch next page:", error);
    } finally {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    if (isBottom) {
      fetchNextPage();
    }
  }, [isBottom]);

  const handleCampaignClick = async (
    event: React.MouseEvent<HTMLElement>,
    title: string,
  ) => {
    const id = event.currentTarget.id;
    try {
      setCampaignId(id);
      setCampaignName(title);
    } catch (e) {
      console.error("error: ", e);
    }
  };
  return (
    <>
      <div
        ref={scrollRef}
        className="relative flex h-full w-full flex-col overflow-y-auto rounded-xl bg-white p-[10px]"
      >
        <div className="flex h-full w-full flex-col">
          {isListLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black bg-opacity-10">
              <LoadingSpinner />
            </div>
          )}
          {/* <div
            key={35}
            className="text-gray-60e0 mb-[4px] w-full cursor-pointer gap-[5px] border bg-white p-4"
            id={`${35}`}
            onClick={(event) => handleCampaignClick(event, "테스트용 목업")}
          >
            <div className="mb-[5px] flex w-full flex-col rounded-lg bg-gray-100 p-[5px] pr-2 text-sm">
              <div className="w-[100px] font-semibold">캠페인명</div>
              <div>{"테스트용 목업"}</div>
            </div>
            <div className="flex w-full flex-col rounded-lg bg-gray-100 p-[5px] pr-2 text-sm">
              <div className="w-[100px] font-semibold">활성 기간:</div>
              <div className="flex flex-col">
                <div>시작일: 2025년 2월 11일</div>
                <div>종료일: 2025년 2월 12일</div>
              </div>
            </div>
          </div> */}
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="mb-[4px] w-full cursor-pointer gap-[5px] border bg-white p-4 text-gray-600"
                id={`${campaign.id}`}
                onClick={(event) => handleCampaignClick(event, campaign.title)}
              >
                <div className="mb-[5px] flex w-full flex-col rounded-lg bg-gray-100 p-[5px] pr-2 text-sm">
                  <div className="w-[100px] font-semibold">캠페인명</div>
                  <div>{campaign.title}</div>
                </div>
                <div className="flex w-full flex-col rounded-lg bg-gray-100 p-[5px] pr-2 text-sm">
                  <div className="w-[100px] font-semibold">활성 기간:</div>
                  <div className="flex flex-col">
                    <div>
                      시작일:{" "}
                      {new Date(campaign.start_date).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </div>
                    <div>
                      종료일:{" "}
                      {campaign.end_date
                        ? new Date(campaign.end_date).toLocaleDateString(
                            "ko-KR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full w-full items-center justify-center text-center text-gray-500">
              사용중인 캠페인이 없습니다. 새로운 캠페인을 생성해보세요.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CampaignListTable;
