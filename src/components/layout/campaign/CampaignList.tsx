import CampaignActiveButton from "@/components/layout/campaign/CampaignActiveButton";
import { useInfiniteScroll } from "@/hooks/infiniteScroll";
import { fetchGetCampaignList } from "@/lib/campaign/apis";
import { CampaignArgs, CampaignListApiResponse } from "@/lib/campaign/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface CampaignListProps {
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: CampaignListApiResponse;
  pageSize: string;
  pageNum: string;
  handleButton: (e: React.MouseEvent<HTMLDivElement>) => void;
  setPageNum: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CampaignList: React.FC<CampaignListProps> = (
  {
    theadStyle,
    tbodyStyle,
    apiResponse,
    pageSize,
    pageNum,
    handleButton,
    setPageNum,
    setLoading,
  },
  context: GetServerSidePropsContext,
) => {
  const [campaigns, setCampaigns] = useState<CampaignArgs[]>(
    apiResponse.result ?? [],
  );
  console.log("campaigns", campaigns);
  const loadMoreRecords = async () => {
    const newData = await fetchGetCampaignList(pageNum, pageSize, context);
    const newRecords = newData.data?.result || [];
    setCampaigns((prev) => [...prev, ...newRecords]);
    setPageNum((prev) => (parseInt(prev) + 1).toString());

    // Update hasMore based on whether we've reached the total count
    const totalCount = newData.data?.total_count || 0;
    const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
    setHasMore(totalCount > stackedDataAmount);
  };

  const router = useRouter();
  const [isCampaignPage, setIsCampaignPage] = useState(false);
  const [activeStatusMap, setActiveStatusMap] = useState<{
    [key: string]: boolean;
  }>({});

  const { containerRef, isLoading, hasMore, setHasMore } = useInfiniteScroll(
    loadMoreRecords,
    {},
  );

  useEffect(() => {
    setIsCampaignPage(router.pathname.includes("/campaign"));

    if (Array.isArray(apiResponse)) {
      const initialStatus = apiResponse.reduce(
        (acc, campaign) => ({ ...acc, [campaign.id]: campaign.active }),
        {} as { [key: string]: boolean },
      );
      setActiveStatusMap(initialStatus);
    }
  }, [router.pathname, apiResponse]);

  const handleCampaignClick = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    setLoading(true);
    try {
      router.replace(`/campaign/details?campaign_id=${id}`, undefined, {
        scroll: false, // Keep scrolling disabled
      });
    } catch (e) {
      alert(
        "캠페인 상세정보를 가져오는 도중 문제가 생겼습니다. 나중에 다시 시도해주세요.",
      );
    }
  };

  const toggleCampaignActiveStatus = (
    campaignId: string,
    newStatus: boolean,
  ) => {
    setActiveStatusMap((prevState) => ({
      ...prevState,
      [campaignId]: newStatus,
    }));
  };

  return (
    <>
      <div className="mb-2 w-full pb-2">
        <div className="mb-2 flex w-full items-center border-b-[1px] pb-2">
          <div className="w-[80%]">
            <div className="text-lg font-bold">캠페인</div>
            <div className="text-sm font-normal text-gray-500">
              현재 사용중인 캠페인 목록이에요.
            </div>
          </div>
          {!isCampaignPage && (
            <div
              id="more_campaign"
              className="w-[20%] cursor-pointer justify-center pr-1 text-right text-sm text-blue-400"
              onClick={handleButton}
            >
              더보기
            </div>
          )}
        </div>
      </div>
      <div ref={containerRef} className="h-full w-full overflow-y-auto py-2">
        <table className="hidden w-full border border-gray-100 text-center lg:table">
          <thead>
            <tr className="bg-gray-100">
              <th className={theadStyle}>캠페인 ID</th>
              <th className={theadStyle}>캠페인 명</th>
              <th className={theadStyle}>타입</th>
              <th className={theadStyle}>캠페인 기간</th>
              <th className={theadStyle}>활성화</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <tr
                  className="cursor-pointer"
                  key={campaign.id}
                  id={`${campaign.id}`}
                  onClick={handleCampaignClick}
                >
                  <td className={tbodyStyle}>{campaign.id}</td>
                  <td className={tbodyStyle}>{campaign.title}</td>
                  <td className={tbodyStyle}>
                    <div className="flex w-full justify-center">
                      <div
                        className={`${
                          campaign.period_type === "LIMITED"
                            ? "bg-yellow-200 text-yellow-600"
                            : "bg-green-200 text-green-600"
                        } w-fit rounded-md px-2 py-1 text-sm font-semibold`}
                      >
                        {campaign.period_type === "LIMITED"
                          ? "기간 제한"
                          : "무기한"}
                      </div>
                    </div>
                  </td>
                  <td className={tbodyStyle}>
                    {new Date(campaign.start_date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    ~{" "}
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
                  </td>
                  <td
                    className="border-b border-gray-200 px-2 py-2 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {typeof campaign.active +
                      "campaign active," +
                      campaign.active}
                    <CampaignActiveButton
                      view="PC"
                      campaign={campaign}
                      activeStatus={
                        activeStatusMap[campaign.id!.toString()] ?? false
                      }
                      toggleCampaignActiveStatus={toggleCampaignActiveStatus}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={tbodyStyle} colSpan={5}>
                  생성된 캠페인이 없어요.
                  <br />
                  새로운 캠페인을 생성해주세요.
                </td>
              </tr>
            )}
            {isLoading && (
              <div className="py-4 text-center text-gray-500">로딩 중...</div>
            )}
          </tbody>
        </table>
        {!hasMore && campaigns.length > 0 && (
          <div className="py-4 text-center text-gray-500">
            모든 데이터를 불러왔습니다.
          </div>
        )}
        {/* Mobile-friendly layout */}
        <div className="block lg:hidden">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="mb-4 w-full cursor-pointer space-y-1 rounded-xl bg-gray-100 p-4 text-gray-600"
                id={`${campaign.id}`}
                onClick={handleCampaignClick}
              >
                <div className="mb-2 flex w-full justify-between border-b pb-1 font-bold text-black">
                  <div>{campaign.title}</div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <CampaignActiveButton
                      view="MOBILE"
                      campaign={campaign}
                      activeStatus={activeStatusMap[campaign.id]}
                      toggleCampaignActiveStatus={toggleCampaignActiveStatus}
                    />
                  </div>
                </div>
                <div className="flex pr-2 text-sm">
                  <div className="w-[100px] font-semibold">타입:</div>
                  {campaign.period_type === "LIMITED" ? "기간 제한" : "무기한"}
                </div>
                <div className="flex pr-2 text-sm">
                  <div className="w-[100px] font-semibold">활성 기간:</div>
                  <div>
                    {new Date(campaign.start_date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {" ~ "}
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
            ))
          ) : (
            <div className="text-center text-gray-500">
              사용중인 캠페인이 없습니다. 새로운 캠페인을 생성해보세요.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CampaignList;
