import CampaignList from "@/components/layout/campaign/CampaignList";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import { authenticateUserforHeader } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { AuthArgs } from "@/pages/auth/lib/types";
import { fetchGetCampaignList } from "@/pages/campaign/lib/apis";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const campaignResponse = await fetchGetCampaignList(context);
  const authResponse = authenticateUserforHeader(context);
  return {
    props: {
      apiResponse: campaignResponse,
      authResponse: authResponse,
    },
  };
};

// src/pages/index.tsx
const Dashboard: React.FC<{ apiResponse: ApiResponse; authResponse: AuthArgs }> = ({ apiResponse, authResponse }) => {
  //table style string
  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700";
  const tbodyStyle = "px-6 py-4 border-b border-gray-200";
  const router = useRouter();
  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "more_campaign") {
      router.push("campaign");
    }
  };
  useEffect(() => {}, [apiResponse, authResponse]);
  return (
    <DashboardContainer title={"대시보드"} onclick={handleButton} onclickText="" buttonId="dashboard">
      <div className="contents-container w-full justify-center">
        <DashboardContents>
          <CampaignList
            theadStyle={theadStyle}
            tbodyStyle={tbodyStyle}
            apiResponse={apiResponse}
            handleButton={handleButton}
          ></CampaignList>
        </DashboardContents>
        <div className="flex">
          <DashboardContents>children</DashboardContents>
          <DashboardContents>children</DashboardContents>
        </div>
        <div className="flex">
          <DashboardContents>
            <div>SUBJECT</div>
            <div>description</div>
            <table className="min-w-full bg-white border border-gray-200 ">
              <thead>
                <tr className="bg-gray-200">
                  <th className={theadStyle}>Name</th>
                  <th className={theadStyle}>Age</th>
                  <th className={theadStyle}>Country</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tbodyStyle}>John Doe</td>
                  <td className={tbodyStyle}>28</td>
                  <td className={tbodyStyle}>USA</td>
                </tr>
                <tr>
                  <td className={tbodyStyle}>Jane Smith</td>
                  <td className={tbodyStyle}>34</td>
                  <td className={tbodyStyle}>Canada</td>
                </tr>
                <tr>
                  <td className={tbodyStyle}>Emily Johnson</td>
                  <td className={tbodyStyle}>22</td>
                  <td className={tbodyStyle}>UK</td>
                </tr>
              </tbody>
            </table>
          </DashboardContents>
          <DashboardContents>
            <div>SUBJECT</div>
            <div>description</div>
            <table className="min-w-full bg-white border border-gray-200 ">
              <thead>
                <tr className="bg-gray-200">
                  <th className={theadStyle}>Name</th>
                  <th className={theadStyle}>Age</th>
                  <th className={theadStyle}>Country</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tbodyStyle}>John Doe</td>
                  <td className={tbodyStyle}>28</td>
                  <td className={tbodyStyle}>USA</td>
                </tr>
                <tr>
                  <td className={tbodyStyle}>Jane Smith</td>
                  <td className={tbodyStyle}>34</td>
                  <td className={tbodyStyle}>Canada</td>
                </tr>
                <tr>
                  <td className={tbodyStyle}>Emily Johnson</td>
                  <td className={tbodyStyle}>22</td>
                  <td className={tbodyStyle}>UK</td>
                </tr>
              </tbody>
            </table>
          </DashboardContents>
        </div>
        <DashboardContents>
          <div>SUBJECT</div>
          <div>description</div>
          <table className="min-w-full bg-white border border-gray-200 ">
            <thead>
              <tr className="bg-gray-200">
                <th className={theadStyle}>Name</th>
                <th className={theadStyle}>Age</th>
                <th className={theadStyle}>Country</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tbodyStyle}>John Doe</td>
                <td className={tbodyStyle}>28</td>
                <td className={tbodyStyle}>USA</td>
              </tr>
              <tr>
                <td className={tbodyStyle}>Jane Smith</td>
                <td className={tbodyStyle}>34</td>
                <td className={tbodyStyle}>Canada</td>
              </tr>
              <tr>
                <td className={tbodyStyle}>Emily Johnson</td>
                <td className={tbodyStyle}>22</td>
                <td className={tbodyStyle}>UK</td>
              </tr>
            </tbody>
          </table>
        </DashboardContents>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
