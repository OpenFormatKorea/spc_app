import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import { ApiResponse } from "@/lib/types";
import { fetchGetCampaignInfo } from "@/pages/campaign/lib/apis";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetchGetCampaignInfo(context);
  console.log("GETSERVERSIDE API RESPONSE: ", response);
  return {
    props: {
      apiResponse: response,
    },
  };
};

export const Campaign = ({ apiResponse }: { apiResponse: ApiResponse }) => {
  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700";
  const tbodyStyle = "px-6 py-4 border-b border-gray-200";
  const router = useRouter();
  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "new_campaign") {
      router.push("campaign/new");
    }
  };

  useEffect(() => {
    console.log("Received API Response:", apiResponse);
  }, [apiResponse]);
  // Ensure apiResponse is an array before mapping

  const campaigns = Array.isArray(apiResponse) ? apiResponse : [];
  return (
    <DashboardContainer title={"캠페인"} onclick={handleButton} onclickText="새 리퍼럴 생성" buttonId="new_campaign">
      <div className="wrapper-container">
        <div className="contents-container w-full justify-center">
          <DashboardContents>
            <div className="font-bold text-xl flex w-full">
              <div className="w-[50%]">리퍼럴 생성하기</div>
            </div>
            <div>현재 사용중인 리퍼럴 목록입니다.</div>
            <div className="my-2 w-full">
              <table className="w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-200">
                    <th className={theadStyle}>캠페인 명</th>
                    <th className={theadStyle}>타입</th>
                    <th className={theadStyle}>활성화</th>
                    <th className={theadStyle}>캠페인 생성일</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, i) => (
                    <tr key={i}>
                      <td className={tbodyStyle}>{campaign.title}</td>
                      <td className={tbodyStyle}>{campaign.period_type}</td>
                      <td className={tbodyStyle}>{campaign.active ? "TRUE" : "FALSE"}</td>
                      <td className={tbodyStyle}>
                        {campaign.start_date} ~ {campaign.end_date}
                      </td>
                    </tr>
                  ))}
                  {!campaigns.length && (
                    <tr>
                      <td className={tbodyStyle}></td>
                      <td className={tbodyStyle}></td>
                      <td className={tbodyStyle}></td>
                      <td className={tbodyStyle}></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </DashboardContents>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Campaign;
