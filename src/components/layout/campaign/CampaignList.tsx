import CampaignActiveButton from "@/components/layout/campaign/CampaignActiveButton";
import { ApiResponse } from "@/lib/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface CampaignListProps {
  theadStyle: string;
  tbodyStyle: string;
  apiResponse: ApiResponse;
  handleButton: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ theadStyle, tbodyStyle, apiResponse, handleButton }) => {
  const router = useRouter();
  const [isCampaignPage, setIsCampaignPage] = useState(false);
  const [activeStatusMap, setActiveStatusMap] = useState<{ [key: string]: boolean }>({});
  useEffect(() => {
    setIsCampaignPage(router.pathname.includes("/campaign"));

    // Initialize active status map from the campaign data
    const initialStatus = Array.isArray(apiResponse)
      ? apiResponse.reduce(
          (acc, campaign) => {
            acc[campaign.id] = campaign.active;
            return acc;
          },
          {} as { [key: string]: boolean }
        )
      : {};

    setActiveStatusMap(initialStatus);
  }, [router.pathname, apiResponse]);
  const handleCampaignClick = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    router.replace(`/campaign/details?campaign_id=${id}`, undefined, { shallow: true, scroll: false });
  };

  const toggleCampaignActiveStatus = (campaignId: string, newStatus: boolean) => {
    setActiveStatusMap((prevState) => ({
      ...prevState,
      [campaignId]: newStatus,
    }));
  };

  const campaigns = Array.isArray(apiResponse) ? apiResponse : [];

  return (
    <>
      <div className="w-full pb-2 mb-2">
        <div className="flex w-full pb-2 border-b-[1px] mb-2 items-center">
          <div className="w-[80%]">
            <div className="font-bold text-lg">캠페인</div>
            <div className="font-normal text-sm text-gray-500">현재 사용중인 캠페인 목록이에요.</div>
          </div>
          {!isCampaignPage && (
            <div
              id="more_campaign"
              className="w-[20%] text-right text-sm pr-1 justify-center cursor-pointer text-blue-400"
              onClick={handleButton}
            >
              더보기
            </div>
          )}
        </div>
      </div>
      <div className="py-2 w-full">
        <table className="w-full border border-gray-100 text-center hidden lg:table">
          <thead>
            <tr className="bg-gray-100">
              <th className={theadStyle}>캠페인 ID</th>
              <th className={theadStyle}>캠페인 명</th>
              <th className={theadStyle}>타입</th>
              <th className={theadStyle}>캠페인 생성일</th>
              <th className={theadStyle}>활성화</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, i) => (
              <tr className="cursor-pointer" key={campaign.id || i} id={campaign.id} onClick={handleCampaignClick}>
                <td className={tbodyStyle}>{campaign.id}</td>
                <td className={tbodyStyle}>{campaign.title}</td>
                <td className={tbodyStyle}>
                  {campaign.period_type === "LIMITED" ? (
                    <div className="w-full flex justify-center">
                      <div className="bg-yellow-200 w-fit px-2 py-1 rounded-md text-yellow-600 font-semibold text-sm">
                        기간 제한
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex justify-center">
                      <div className="bg-green-200 w-fit px-2 py-1 rounded-md text-green-600 font-semibold text-sm">
                        무기한
                      </div>
                    </div>
                  )}
                </td>
                <td className={tbodyStyle}>
                  {new Date(campaign.start_date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  ~{" "}
                  {campaign.end_date && campaign.end_date !== ""
                    ? new Date(campaign.end_date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </td>
                <td className="px-2 py-2 text-sm border-b border-gray-200" onClick={(e) => e.stopPropagation()}>
                  <CampaignActiveButton
                    view="PC"
                    campaign={campaign}
                    activeStatus={activeStatusMap[campaign.id]}
                    toggleCampaignActiveStatus={toggleCampaignActiveStatus}
                  />
                </td>
              </tr>
            ))}
            {!campaigns.length && (
              <tr>
                <td className={tbodyStyle} colSpan={4}>
                  생성된 캠페인이 없어요.
                  <br />
                  새로운 캠페인은 생성해주세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile-friendly layout */}
        <div className="block lg:hidden">
          {campaigns.map((campaign, i) => {
            return (
              <div
                key={campaign.id || i}
                className="shadow-sm bg-gray-100 p-4 mb-4 rounded-xltext-gray-600 space-y-1 cursor-pointer"
                id={campaign.id}
                onClick={handleCampaignClick}
              >
                <div
                  className="font-bold mb-2 text-black w-full pb-1 border-b flex justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div> {campaign.title}</div>
                  <div>
                    <CampaignActiveButton
                      view="MOBILE"
                      campaign={campaign}
                      activeStatus={activeStatusMap[campaign.id]}
                      toggleCampaignActiveStatus={toggleCampaignActiveStatus}
                    />
                  </div>
                </div>
                <div className="text-sm flex pr-2">
                  <div className="w-[100px]">
                    <strong>타입: </strong>
                  </div>
                  {campaign.period_type === "LIMITED" ? "기간 제한" : "무기한"}
                </div>

                <div className="text-sm flex pr-2">
                  <div className="w-[100px]">
                    <strong>활성 기간: </strong>
                  </div>
                  <div>
                    <div>
                      {new Date(campaign.start_date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div>~</div>
                    <div>
                      {campaign.end_date && campaign.end_date !== ""
                        ? new Date(campaign.end_date).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {!campaigns.length && (
            <div className="text-center text-gray-500">사용중인 캠페인이 없습니다. 새로운 캠페인을 생성해보세요.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default CampaignList;
