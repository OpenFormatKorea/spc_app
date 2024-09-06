import React, { useState } from "react";
import { useRouter } from "next/router";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import CampaignDetails from "@/components/layout/campaign/CampaignDetails";
import { fetchDeleteCampaign, fetchGetCampaignDetails, fetchModifyCampaign } from "@/pages/campaign/lib/apis";
import { fetchGetItemList } from "@/pages/item/lib/apis";
import { CampaignArgs } from "@/pages/campaign/lib/types";
import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { authenticateUserforHeader } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import ItemList from "@/components/layout/item/ItemList";
import ContentsContainer from "@/components/layout/base/ContentsContainer";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { campaign_id }: any = context.query;
  const shop_id: any = getShopIdFromCookies(context);

  const authResponse = authenticateUserforHeader(context);
  const itemListApiResponse = await fetchGetItemList(campaign_id, context);
  const cDetailApiResponse = await fetchGetCampaignDetails(campaign_id, shop_id, context);
  console.log("cDetailApiResponse", cDetailApiResponse);
  if (cDetailApiResponse == null || cDetailApiResponse.shop_id != shop_id) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        itemListApiResponse: itemListApiResponse,
        authResponse: authResponse,
        cDetailApiResponse: cDetailApiResponse,
        campaign_id: campaign_id,
      },
    };
  }
};

const DetailsCampaign = (
  {
    campaign_id,
    itemListApiResponse,
    cDetailApiResponse,
  }: {
    campaign_id: string;
    itemListApiResponse: ApiResponse;
    cDetailApiResponse: CampaignArgs;
  },
  context: GetServerSidePropsContext
) => {
  const [title, setTitle] = useState(cDetailApiResponse.title);
  const [description, setDescription] = useState(cDetailApiResponse.description);
  const [period_type, setPeriod_type] = useState(cDetailApiResponse.period_type);
  const [start_date, setStart_date] = useState(cDetailApiResponse.start_date);
  const [end_date, setEnd_date] = useState(cDetailApiResponse.end_date);
  const [active, setActive] = useState(cDetailApiResponse.active);

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
    if (id === "modify_campaign") {
      if (infoCheck(campaignArgs)) {
        const result = await fetchModifyCampaign(campaign_id, campaignArgs, context);

        if (result.status === 200) {
          alert("캠페인을 수정 하였습니다.");
          router.push("/campaign/details?campaign_id=" + campaign_id);
        } else {
          alert("캠페인 수정을 실패 하였습니다. 상태 코드: " + result.status);
        }
      }
    } else if (id === "cancel_modify_campaign") {
      router.push("/campaign");
    } else if (id === "delete_campaign") {
      if (confirm("정말 삭제 하시겠습니까?")) {
        const result = await fetchDeleteCampaign(campaign_id, context);
        if (result.status === 200) {
          alert("캠페인을 삭제 하였습니다.");
          router.push("/campaign");
        } else {
          alert("캠페인 삭제를 실패 하였습니다. 상태 코드: " + result.status);
        }
      }
    }
  };

  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "more_campaign") {
      router.push("campaign");
    } else if (id === "create_item") {
      router.push("/item/new?campaign_id=" + campaign_id);
    }
  };

  const theadStyle = "px-1 py-2 text-center border-b border-gray-200 text-sm text-gray-700";
  const tbodyStyle = "px-2 py-2 text-sm border-b border-gray-200 whitespace-normal break-words break-all";
  return (
    <DashboardContainer
      title={"캠페인 상세 정보"}
      onclick={handleSubmit}
      onclickText="뒤로가기"
      buttonId="cancel_modify_campaign"
    >
      <div className="flex flex-col md:flex-row w-full md:space-x-4 lg:space-x-4">
        <ContentsContainer variant="campaign">
          <CampaignDetails
            page_type="DETAILS"
            campaign_id={campaign_id}
            campaignArgs={campaignArgs}
            setPeriod_type={setPeriod_type}
            setDescription={setDescription}
            setActive={setActive}
            setTitle={setTitle}
            setStart_date={setStart_date}
            setEnd_date={setEnd_date}
          />
          <div className="flex items-center justify-end mt-4 gap-x-2">
            <button
              id="delete_campaign"
              className="border p-2 bg-red-500 text-white rounded-lg cursor-pointer"
              onClick={handleSubmit}
            >
              삭제하기
            </button>
            <button
              id="modify_campaign"
              className="border p-2 bg-blue-500 text-white rounded-lg  cursor-pointer"
              onClick={handleSubmit}
            >
              수정하기
            </button>
          </div>
        </ContentsContainer>
        <ContentsContainer variant="campaign">
          <ItemList
            theadStyle={theadStyle}
            tbodyStyle={tbodyStyle}
            apiResponse={itemListApiResponse}
            handleButton={handleButton}
            campaign_id={campaign_id}
          />
        </ContentsContainer>
      </div>
    </DashboardContainer>
  );
};
export default DetailsCampaign;
