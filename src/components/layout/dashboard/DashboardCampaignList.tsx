import CampaignActiveButton from "@/components/layout/campaign/CampaignActiveButton";
import { theadStyle, tbodyStyle } from "@/interfaces/tailwindCss";
import { CampaignArgs, CampaignListApiResponse } from "@/lib/campaign/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
interface DashboardCampaignListProps {
  apiResponse: CampaignListApiResponse;
  handleButton: (e: React.MouseEvent<HTMLDivElement>) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardCampaignList: React.FC<DashboardCampaignListProps> = ({
  apiResponse,
  handleButton,
  setLoading,
}) => {
  const router = useRouter();
  const [isCampaignPage, setIsCampaignPage] = useState(false);

  useEffect(() => {
    setIsCampaignPage(router.pathname.includes("/campaign"));
  }, [router.pathname, apiResponse]);

  const campaigns = apiResponse?.result ?? [];
  const [activeStatusMap, setActiveStatusMap] = useState<{
    [key: string]: boolean;
  }>({});
  const dashaboardTheadStyle =
    "p-[4px] border-b border-gray-200 text-[14px] font-semibold text-gray-700 text-center ";
  const dashaboardTbodyStyle =
    "p-1 border-b border-gray-200 whitespace-normal break-words break-all text-[12px] text-center items-center ";
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
            <div className="text-[16px] font-bold">최근 캠페인</div>
            <div className="text-[14px] font-normal text-gray-500">
              최근 10건의 캠페인 목록이에요.
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
      <div className="h-full w-full overflow-y-auto py-2">
        <table className="hidden w-full border border-gray-100 text-center lg:table">
          <thead>
            <tr className="bg-gray-100">
              <th className={dashaboardTheadStyle}>캠페인 ID</th>
              <th className={dashaboardTheadStyle}>캠페인 명</th>
              <th className={dashaboardTheadStyle}>캠페인 등록 계정 ID</th>
              <th className={dashaboardTheadStyle}>타입</th>
              <th className={dashaboardTheadStyle}>캠페인 기간</th>
              <th className={dashaboardTheadStyle}>활성화</th>
              <th className={dashaboardTheadStyle}>캠페인 등록일</th>
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
                <td className={dashaboardTbodyStyle}>{campaign.id}</td>
                <td className={dashaboardTbodyStyle}>{campaign.title}</td>
                <td className={dashaboardTbodyStyle}>
                  {campaign.created_by_username}
                </td>
                <td className={dashaboardTbodyStyle}>
                  <div className="flex w-full justify-center">
                    <div
                      className={`${
                        campaign.period_type === "LIMITED"
                          ? "bg-yellow-200 text-yellow-600"
                          : "bg-green-200 text-green-600"
                      } w-fit rounded-md p-1 text-[14px] font-semibold`}
                    >
                      {campaign.period_type === "LIMITED"
                        ? "기간 제한"
                        : "무기한"}
                    </div>
                  </div>
                </td>
                <td className={dashaboardTbodyStyle}>
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
                  className="border-b border-gray-200 p-[5px] text-[14px]"
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
                <td className={dashaboardTbodyStyle}>
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

export default DashboardCampaignList;
