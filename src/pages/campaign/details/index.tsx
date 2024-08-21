import React, { useState } from "react";
import { useRouter } from "next/router";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import CampaignDetails from "@/components/layout/campaign/CampaignDetails";
import CampaignList from "@/components/layout/campaign/CampaignList";
import {
  fetchDeleteCampaign,
  fetchGetCampaignDetails,
  fetchGetCampaignList,
  fetchModifyCampaign,
} from "@/pages/campaign/lib/apis";
import { CampaignArgs } from "@/pages/campaign/lib/types";
import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { authenticateUserforHeader } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { campaign_id }: any = context.query;
  const campaignResponse = await fetchGetCampaignList(context);
  const authResponse = authenticateUserforHeader(context);

  const response = await fetchGetCampaignDetails(campaign_id, context);
  const shop_id = getShopIdFromCookies(context);
  if (response == null || response.shop_id != shop_id) {
    return {
      redirect: {
        destination: "/campaign",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        campaignApiResponse: campaignResponse,
        authResponse: authResponse,
        apiResponse: response,
        campaign_id: campaign_id,
      },
    };
  }
};

const DetailsCampaign = (
  {
    apiResponse,
    campaign_id,
    campaignApiResponse,
  }: {
    apiResponse: CampaignArgs;
    campaign_id: string;
    campaignApiResponse: ApiResponse;
  },
  context: GetServerSidePropsContext
) => {
  const [title, setTitle] = useState(apiResponse.title);
  const [description, setDescription] = useState(apiResponse.description);
  const [period_type, setPeriod_type] = useState(apiResponse.period_type);
  const [start_date, setStart_date] = useState(apiResponse.start_date);
  const [end_date, setEnd_date] = useState(apiResponse.end_date);
  const [active, setActive] = useState(apiResponse.active);

  const router = useRouter();

  const campaignArgs: CampaignArgs = {
    title: title,
    description: description,
    period_type: period_type,
    start_date: start_date,
    end_date: end_date,
    active: active,
  };

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;
    const shop_id: any = getShopIdFromCookies(context);

    if (id === "modify_campaign") {
      if (infoCheck(campaignArgs)) {
        const result = await fetchModifyCampaign(campaign_id, campaignArgs, context);

        if (result.status === 200) {
          alert(result.message);
          router.push("/campaign/details?campaign_id=" + campaign_id);
        } else {
          alert("캠페인 수정을 실패 하였습니다. 상태 코드: " + result.status);
          console.log("캠페인 수정을 실패 하였습니다. 상태 코드:", result.status);
        }
      }
    } else if (id === "cancel_modify_campaign") {
      const confirmed = window.confirm("뒤로 가시겠습니까?");
      if (confirmed) {
        router.push("/campaign");
      }
    } else if (id === "delete_campaign") {
      const confirmed = window.confirm("정말 삭제 하시겠습니까?");
      if (confirmed) {
        const result = await fetchDeleteCampaign(campaign_id, context);

        if (result.status === 200) {
          alert(result.message);
          console.log("캠페인을 (현재는 임시 !) 삭제 하였습니다.");
          router.push("/campaign");
        } else {
          alert("캠페인 삭제를 실패 하였습니다. 상태 코드: " + result.status);
          console.log("캠페인 삭제를 실패 하였습니다. 상태 코드:", result.status);
        }
      }
    }
  };

  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "more_campaign") {
      router.push("campaign");
    }
  };

  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700";
  const tbodyStyle = "px-6 py-4 border-b border-gray-200";

  return (
    <DashboardContainer
      title={"캠페인 상세 정보"}
      onclick={handleSubmit}
      onclickText="뒤로가기"
      buttonId="cancel_modify_campaign"
    >
      <div className="flex flex-col w-full">
        <DashboardContents>
          <CampaignDetails
            campaignArgs={campaignArgs}
            setPeriod_type={setPeriod_type}
            setDescription={setDescription}
            setActive={setActive}
            setTitle={setTitle}
            setStart_date={setStart_date}
            setEnd_date={setEnd_date}
          />
        </DashboardContents>
        <div className="flex flex-col sm:flex-row justify-end sm:space-x-4 mt-4 sm:mt-8">
          <button
            id="delete_campaign"
            className="border p-2 bg-red-500 text-white rounded-lg w-full sm:w-auto mb-2 sm:mb-0"
            onClick={handleSubmit}
          >
            삭제하기
          </button>
          <button
            id="modify_campaign"
            className="border p-2 bg-blue-400 text-white rounded-lg w-full sm:w-auto"
            onClick={handleSubmit}
          >
            수정하기
          </button>
        </div>
        <DashboardContents>
          <CampaignList
            theadStyle={theadStyle}
            tbodyStyle={tbodyStyle}
            apiResponse={campaignApiResponse}
            handleButton={handleButton}
          />
        </DashboardContents>
      </div>
    </DashboardContainer>
  );
};

const infoCheck = (info: CampaignArgs) => {
  if (!info.title) {
    alert("캠페인 명을 입력 해주세요.");
    return false;
  } else if (!info.description) {
    alert("캠페인 설명을 입력 해주세요.");
    return false;
  } else if (!info.start_date) {
    alert("캠페인 시작 시간을 선택 해주세요.");
    return false;
  } else if (info.period_type === "LIMITED" && !info.end_date) {
    alert("캠페인 종료 시간을 선택 해주세요.");
    return false;
  } else {
    return true;
  }
};

export default DetailsCampaign;
