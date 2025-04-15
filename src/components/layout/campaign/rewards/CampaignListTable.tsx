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
  campaignSearch: string;
  campaignId: string;
  setUserId: (value: string) => void;
  setCampaignName: (value: string) => void;
  setCampaignId: (value: string) => void;
  setPageNum: (value: string) => void;
}

const CampaignListTable: React.FC<CampaignListTableProps> = (
  {
    apiResponse,
    pageSize,
    pageNum,
    campaignSearch,
    setUserId,
    setCampaignName,
    campaignId,
    setCampaignId,
    setPageNum,
  },
  context: GetServerSidePropsContext,
) => {
  const [isListLoading, setIsListLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignArgs[]>(
    apiResponse?.result ?? [],
  );
  const filtereCampaign =
    campaigns?.filter((campaign: CampaignArgs) =>
      campaign.title.toLowerCase().includes(campaignSearch.toLowerCase()),
    ) || [];
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
    e: React.MouseEvent<HTMLElement>,
    title: string,
  ) => {
    const id = e.currentTarget.id;
    try {
      setCampaignId(id);
      setCampaignName(title);
      setUserId("");
    } catch (e) {
      console.error("error: ", e);
    }
  };
  return (
    <>
      <div
        ref={scrollRef}
        className="relative flex h-full w-[230px] flex-col items-center justify-center overflow-y-auto rounded-xl bg-white p-[10px]"
      >
        <div className="flex h-full w-[200px] flex-col gap-[8px]">
          {isListLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black bg-opacity-10">
              <LoadingSpinner />
            </div>
          )}
          {filtereCampaign.length > 0 ? (
            filtereCampaign.map((campaign) => (
              <div
                key={campaign.id}
                className={`flex w-full cursor-pointer flex-col gap-[5px] border p-4 text-gray-600 hover:bg-gray-50 ${campaignId == campaign.id ? "border-gray-500 bg-gray-50" : "bg-white"}`}
                id={`${campaign.id}`}
                onClick={(e) => handleCampaignClick(e, campaign.title)}
              >
                <div className="flex w-full flex-col rounded-sm bg-gray-200 p-[5px] pr-2 text-[14px]">
                  <div className="w-[150px] overflow-hidden truncate text-ellipsis whitespace-nowrap text-[12px]">
                    {campaign.title}
                  </div>
                </div>
                <div className="flex w-full flex-col rounded-sm bg-gray-100 p-[5px] pr-2 text-[14px]">
                  <div className="flex cursor-pointer flex-col">
                    <div>
                      <label className="cursor-pointer font-semibold">
                        시작일:{" "}
                      </label>
                      <label className="cursor-pointer text-[12px] text-gray-600">
                        {new Date(campaign.start_date).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </label>
                    </div>
                    <div>
                      <label className="cursor-pointer font-semibold">
                        종료일:{" "}
                      </label>
                      <label className="cursor-pointer text-[12px] text-gray-600">
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
                      </label>
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
