import CampaignActiveButton from "@/components/layout/campaign/CampaignActiveButton";
import { theadStyle, tbodyStyle } from "@/interfaces/tailwindCss";
import { fetchGetCampaignList } from "@/lib/campaign/apis";
import { CampaignArgs, CampaignListApiResponse } from "@/lib/campaign/types";
import { useScrollPosition } from "@/lib/infinitescrollFunctions";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
interface CampaignListProps {
  apiResponse: CampaignListApiResponse;
  pageSize: string;
  pageNum: string;
  handleButton: (e: React.MouseEvent<HTMLDivElement>) => void;
  setPageNum: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CampaignList: React.FC<CampaignListProps> = (
  { apiResponse, pageSize, pageNum, handleButton, setPageNum, setLoading },
  context: GetServerSidePropsContext,
) => {
  const router = useRouter();
  const [isCampaignPage, setIsCampaignPage] = useState(false);

  useEffect(() => {
    setIsCampaignPage(router.pathname.includes("/campaign"));
  }, [router.pathname, apiResponse]);

  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignArgs[]>(
    apiResponse?.result ?? [],
  );
  const [activeStatusMap, setActiveStatusMap] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const initialStatusMap: { [key: string]: boolean } = {};
    campaigns.forEach((campaign) => {
      if (campaign.id !== undefined) {
        initialStatusMap[campaign.id.toString()] = campaign.active;
      }
    });
    setActiveStatusMap(initialStatusMap);
  }, [campaigns]);

  // 무한 스크롤
  const { isBottom, scrollRef } = useScrollPosition(true);
  const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
  const totalCount = apiResponse?.total_count || 0;
  const getNextPage = totalCount > stackedDataAmount;

  const fetchNextPage = async () => {
    if (!getNextPage || !scrollRef.current || isLoading) return;
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isBottom) {
      fetchNextPage();
    }
  }, [isBottom]);

  const handleCampaignClick = (event: React.MouseEvent<HTMLElement>) => {
    setLoading(true);
    router.push(`/campaign/details?campaign_id=${event.currentTarget.id}`);
  };

  const toggleCampaignActiveStatus = (
    campaignId: string,
    newStatus: boolean,
  ) => {
    setActiveStatusMap((prev) => ({ ...prev, [campaignId]: newStatus }));
  };

  return (
    <>
      <div className="flex w-full pb-[5px]">
        <div className="flex w-full items-center border-b-[1px] pb-[5px]">
          <div className="w-[80%]">
            <div className="text-[16px] font-bold">캠페인</div>
            <div className="text-[14px] font-normal text-gray-500">
              현재 사용중인 캠페인 목록이에요.
            </div>
          </div>
          {!isCampaignPage && (
            <div
              id="more_campaign"
              className="w-[20%] cursor-pointer justify-center pr-1 text-right text-[14px] text-blue-400"
              onClick={handleButton}
            >
              더보기
            </div>
          )}
        </div>
      </div>
      <div ref={scrollRef} className="h-full w-full overflow-y-auto py-2">
        <table className="hidden w-full border border-gray-100 text-center lg:table">
          <thead>
            <tr className="bg-gray-100">
              <th className={theadStyle}>캠페인 ID</th>
              <th className={theadStyle}>캠페인 명</th>
              <th className={theadStyle}>캠페인 등록 계정 ID</th>
              <th className={theadStyle}>타입</th>
              <th className={theadStyle}>캠페인 기간</th>
              <th className={theadStyle}>활성화</th>
              <th className={theadStyle}>캠페인 등록일</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr
                className="cursor-pointer"
                key={campaign.id}
                id={`${campaign.id}`}
                onClick={handleCampaignClick}
              >
                <td className={tbodyStyle}>{campaign.id}</td>
                <td className={tbodyStyle}>{campaign.title}</td>
                <td className={tbodyStyle}>{campaign.created_by_username}</td>
                <td className={tbodyStyle}>
                  <div className="flex w-full justify-center">
                    <div
                      className={`${
                        campaign.period_type === "LIMITED"
                          ? "bg-yellow-200 text-yellow-600"
                          : "bg-green-200 text-green-600"
                      } w-fit rounded-md px-2 py-1 text-[14px] font-semibold`}
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
                  ~
                  {campaign.end_date
                    ? new Date(campaign.end_date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </td>
                <td
                  className="border-b border-gray-200 px-2 py-2 text-[14px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CampaignActiveButton
                    view="PC"
                    campaign={campaign}
                    activeStatus={
                      activeStatusMap[
                        (campaign.id ? campaign.id : "").toString()
                      ]
                    }
                    toggleCampaignActiveStatus={toggleCampaignActiveStatus}
                  />
                </td>
                <td className={tbodyStyle}>
                  {campaign.created_at
                    ? new Date(campaign.created_at).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : ""}
                </td>
              </tr>
            ))}

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
        {/* Mobile-friendly layout */}
        <div className="flex flex-col gap-[10px] lg:hidden">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="w-full cursor-pointer gap-[5px] rounded-xl bg-gray-100 p-4 text-gray-600"
                id={`${campaign.id}`}
                onClick={handleCampaignClick}
              >
                <div className="mb-2 flex w-full justify-between border-b pb-1 font-bold text-black">
                  <div>{campaign.title}</div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <CampaignActiveButton
                      view="MOBILE"
                      campaign={campaign}
                      activeStatus={
                        activeStatusMap[
                          (campaign.id ? campaign.id : "").toString()
                        ] ?? false
                      }
                      toggleCampaignActiveStatus={toggleCampaignActiveStatus}
                    />
                  </div>
                </div>
                <div className="flex pr-2 text-[14px]">
                  <div className="w-[100px] font-semibold">타입:</div>
                  {campaign.period_type === "LIMITED" ? "기간 제한" : "무기한"}
                </div>
                <div className="flex pr-2 text-[14px]">
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
                <div className="flex pr-2 text-[14px]">
                  <div className="w-[100px] font-semibold">등록 계정 ID:</div>
                  {campaign.created_by_username}
                </div>
                <div className="flex pr-2 text-[14px]">
                  <div className="w-[100px] font-semibold">캠페인 등록일:</div>
                  <div>
                    {campaign.created_at
                      ? new Date(campaign.created_at).toLocaleDateString(
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
