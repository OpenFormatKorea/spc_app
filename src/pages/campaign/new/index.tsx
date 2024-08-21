import CampaignDetails from "@/components/layout/campaign/CampaignDetails";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import { fetchCreateCampaign } from "@/pages/campaign/lib/apis";
import { CampaignArgs, PeriodType } from "@/pages/campaign/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useRef, useState, KeyboardEvent } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const NewCampaign = (context: GetServerSidePropsContext) => {
  //table style string
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [period_type, setPeriod_type] = useState(PeriodType.UL);
  const [start_date, setStart_date] = useState("2024-08-14 00:00:00");
  const [end_date, setEnd_date] = useState("2024-08-16 00:00:00");
  const [active, setActive] = useState(true);
  // const [newStart_date, setNewStartDate] = useState(new Date());
  // const [newEnd_date, setNewEndDate] = useState(new Date());

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

  const campaignArgs: CampaignArgs = {
    // shop_id: shop_id,
    title: title,
    description: description,
    period_type: period_type,
    start_date: start_date,
    end_date: end_date,
    active: active,
    // newStart_date: newStart_date,
    // newEnd_date: newEnd_date,
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;

    if (id === "create_campaign") {
      if (infoCheck(campaignArgs)) {
        const result = await fetchCreateCampaign(campaignArgs, context);

        if (result.status === 200) {
          alert(result.message);
          if (result.success) {
            router.push("/campaign");
          }
        } else {
          alert("캠페인 생성을 실패 하였습니다. 상태 코드: " + result.status);
          console.log("캠페인 생성을 실패 하였습니다. 상태 코드:", result.status);
          return false;
        }
      } else {
        console.log("입력한 정보가 유효하지 않습니다.");
        return false;
      }
    }
  };
  return (
    <DashboardContainer
      title={"새 캠페인 생성"}
      onclick={handleSubmit}
      onclickText="저장하기"
      buttonId="create_campaign"
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
    </DashboardContainer>
  );
};

export default NewCampaign;
