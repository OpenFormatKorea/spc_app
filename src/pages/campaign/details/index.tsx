import CampaignDetails from "@/components/layout/campaign/CampaignDetails";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import { getShopIdFromCookies } from "@/lib/helper";
import { fetchGetCampaignDetails, fetchModifyCampaign } from "@/pages/campaign/lib/apis";
import { CampaignArgs } from "@/pages/campaign/lib/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Calendar from "react-calendar";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { camapaign_id }: any = context.query;
  const response = await fetchGetCampaignDetails(camapaign_id, context);
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
        apiResponse: response,
        campaign_id: camapaign_id,
      },
    };
  }
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

const DetailsCampaign = (
  { apiResponse, camapaign_id }: { apiResponse: CampaignArgs; camapaign_id: string },
  context: GetServerSidePropsContext
) => {
  const [title, setTitle] = useState(apiResponse.title);
  const [description, setDescription] = useState(apiResponse.description);
  const [period_type, setPeriod_type] = useState(apiResponse.period_type);
  const [start_date, setStart_date] = useState(apiResponse.start_date);
  const [end_date, setEnd_date] = useState(apiResponse.end_date);
  const [active, setActive] = useState(apiResponse.active);
  // const [newStart_date, setNewStartDate] = useState(apiResponse.newStart_date);
  // const [newEnd_date, setNewEndDate] = useState(apiResponse.newEnd_date);

  const router = useRouter();
  // useEffect(() => {
  //   console.log("Received API Details Response:", apiResponse);
  // }, [apiResponse]);

  const campaignArgs: CampaignArgs = {
    title: title,
    description: description,
    period_type: period_type,
    start_date: start_date,
    end_date: end_date,
    active: active,
    // newStart_date: newStart_date,
    // newEnd_date: newEnd_date,
  };

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;

    if (id === "modify_campaign") {
      if (infoCheck(campaignArgs)) {
        const result = await fetchModifyCampaign(camapaign_id, campaignArgs, context);
        alert(result.message);
        if (result.success) {
          router.push("/campaign/details/" + camapaign_id);
        } else {
          console.log("캠페인 생성을 실패 하였습니다.");
          return false;
        }
      }
    } else if (id === "cancel_modify_campaign") {
      const confirmed = window.confirm("뒤로 가시겠습니까?");
      if (confirmed) {
        router.push("/campaign");
      }
    }
    // else if (id === "delete_campaign") {
    //   const confirmed = window.confirm("정말 삭제 하시겠습니까?");
    //   if (confirmed) {
    //     alert("OOKK");
    //     const result = await fetchDeleteCampaign(campaign_num, context);
    //     alert(result.message);
    //     if (result.success) {
    //       console.log("캠페인을 삭제 하였습니다.");
    //       router.push("/campaign");
    //     } else {
    //       console.log("캠페인 삭제를 실패 하였습니다.");
    //       return false;
    //     }
    //   }
    // }
  };
  return (
    <DashboardContainer
      title={"캠페인 상세 정보"}
      onclick={handleSubmit}
      onclickText="수정하기"
      buttonId="modify_campaign"
    >
      <DashboardContents>
        <CampaignDetails
          campaignArgs={campaignArgs}
          setPeriod_type={setPeriod_type}
          setDescription={setDescription}
          setActive={setActive}
          setTitle={setTitle}
          setStart_date={setStart_date}
          setEnd_date={setEnd_date}
          // setNewStartDate={setNewStartDate}
          // setNewEndDate={setNewEndDate}
        />
      </DashboardContents>
      <div className="button-container w-full text-right">
        <button
          id="cancel_modify_campaign"
          className="border m-2 mt-4 p-2 bg-gray-400 text-white rounded-lg"
          onClick={handleSubmit}
        >
          뒤로가기
        </button>
        <button
          id="delete_campaign"
          className="border m-2 mt-4 p-2 bg-red-500 text-white rounded-lg"
          onClick={handleSubmit}
        >
          삭제하기
        </button>
      </div>
    </DashboardContainer>
  );
};

export default DetailsCampaign;
