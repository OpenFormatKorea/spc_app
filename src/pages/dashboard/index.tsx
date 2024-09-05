import CampaignList from "@/components/layout/campaign/CampaignList";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { authenticateUserforHeader } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { AuthArgs } from "@/pages/auth/lib/types";
import { fetchGetCampaignList } from "@/pages/campaign/lib/apis";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getShopIdFromCookies } from "@/lib/helper";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const campaignResponse = await fetchGetCampaignList(context);
  const authResponse = authenticateUserforHeader(context);
  const shop_id = getShopIdFromCookies(context);
  if (!campaignResponse || !shop_id) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  return {
    props: {
      apiResponse: campaignResponse,
      authResponse: authResponse,
    },
  };
};

const Dashboard: React.FC<{ apiResponse: ApiResponse; authResponse: AuthArgs }> = ({ apiResponse, authResponse }) => {
  const router = useRouter();

  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700";
  const tbodyStyle = "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all";

  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "more_campaign") {
      router.push("/campaign");
    }
  };

  useEffect(() => {}, [apiResponse, authResponse]);

  return (
    <DashboardContainer title="대시보드" onclick={handleButton} onclickText="" buttonId="dashboard">
      <div className="contents-container w-full justify-center">
        <ContentsContainer variant="dashboard">
          <CampaignList
            theadStyle={theadStyle}
            tbodyStyle={tbodyStyle}
            apiResponse={apiResponse}
            handleButton={handleButton}
          />
        </ContentsContainer>
        {/* <div className="flex space-x-4">
          <ContentsContainer variant="dashboard">children</ContentsContainer>
          <ContentsContainer variant="dashboard">children</ContentsContainer>
        </div>
        <ContentsContainer variant="dashboard">
          <div className="font-semibold text-lg mb-2">SUBJECT</div>
          <div className="mb-4">description</div>
          <table className="min-w-full bg-white border border-gray-200">
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
        </ContentsContainer> */}
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
