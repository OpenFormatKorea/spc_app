import React, { useState } from "react";
import { useRouter } from "next/router";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import CampaignDetails from "@/components/layout/campaign/CampaignDetails";
import { CampaignArgs } from "@/lib/campaign/types";
import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ApiResponse } from "@/lib/types";
import ItemList from "@/components/layout/item/ItemList";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { fetchGetCampaignDetails, fetchModifyCampaign, fetchDeleteCampaign } from "@/lib/campaign/apis";
import { fetchGetItemList } from "@/lib/item/apis";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { authenticateUser } from "@/lib/auth";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { campaign_id }: any = context.query;
  const shop_id: any = getShopIdFromCookies(context);
  const authResponse = authenticateUser(context, "/dashboard");
  const itemListApiResponse = await fetchGetItemList(campaign_id, context);
  const cDetailApiResponse = await fetchGetCampaignDetails(campaign_id, shop_id, context);
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

  // Table styles
  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";
  return (
    <DashboardContainer>
      <div className="flex w-full justify-between items-center mb-3 h-[42px]">
        <div className="subject-container flex w-full">
          <a className="text-2xl font-bold">캠페인 상세 정보</a>
        </div>

        <div className="button-container flex justify-end w-full">
          <button
            className="flex items-center justify-center bg-gray-400 text-white border p-2 rounded-lg cursor-pointer"
            onClick={handleSubmit}
            id="cancel_modify_campaign"
          >
            <ArrowBackIosIcon fontSize="small" />
            <span className="ml-1 sm:hidden">뒤로가기</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full md:space-x-4 lg:space-x-4 ">
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
      <div className="flex items-center justify-end mt-6 gap-x-2 gap-y-2">
        <button
          id="delete_campaign"
          className="border p-2 bg-red-500 text-white rounded-lg cursor-pointer w-full lg:w-fit"
          onClick={handleSubmit}
        >
          삭제하기
        </button>
        <button
          id="modify_campaign"
          className="border p-2 bg-blue-500 text-white rounded-lg  cursor-pointer w-full lg:w-fit"
          onClick={handleSubmit}
        >
          수정하기
        </button>
      </div>
    </DashboardContainer>
  );
};
export default DetailsCampaign;
