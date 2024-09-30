import CampaignList from "@/components/layout/campaign/CampaignList";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { authenticateUser, deleteCookies } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { AuthArgs } from "@/lib/auth/types";
import { fetchGetCampaignList } from "@/lib/campaign/apis";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authResponse = authenticateUser(context, "/auth/login");
  const campaignResponse = await fetchGetCampaignList(context);

  return {
    props: {
      apiResponse: campaignResponse,
      authResponse: authResponse,
    },
  };
};

const Dashboard: React.FC<{ apiResponse: ApiResponse; authResponse: AuthArgs }> = ({ apiResponse, authResponse }) => {
  const router = useRouter();

  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";
  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "more_campaign") {
      router.push("/campaign");
    }
  };

  return (
    <DashboardContainer>
      <div className="flex w-full justify-between items-center mb-3 h-[42px]">
        <div className="subject-container flex w-full">
          <a className="text-2xl font-bold">대시보드</a>
        </div>
      </div>
      <div className="contents-container w-full justify-center ">
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
        </div>*/}
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
