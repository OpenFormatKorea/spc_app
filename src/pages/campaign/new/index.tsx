import CampaignDetails from "@/components/layout/campaign/CampaignDetails";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { fetchCreateCampaign } from "@/pages/campaign/lib/apis";
import { CampaignArgs, PeriodType } from "@/pages/campaign/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useRef } from "react";

const NewCampaign = (context: GetServerSidePropsContext) => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [periodType, setPeriodType] = useState(PeriodType.UL);
  const [startDate, setStartDate] = useState("2024-08-14 00:00:00");
  const [endDate, setEndDate] = useState("2024-08-16 00:00:00");
  const [active, setActive] = useState(true);

  // Function to validate campaign information
  const isCampaignInfoValid = (info: CampaignArgs): boolean => {
    if (!info.title) {
      alert("캠페인 명을 입력 해주세요.");
      return false;
    }
    if (!info.description) {
      alert("캠페인 설명을 입력 해주세요.");
      return false;
    }
    if (!info.start_date) {
      alert("캠페인 시작 시간을 선택 해주세요.");
      return false;
    }
    if (info.period_type === PeriodType.L && !info.end_date) {
      alert("캠페인 종료 시간을 선택 해주세요.");
      return false;
    }
    return true;
  };

  // Campaign arguments
  const campaignArgs: CampaignArgs = {
    title,
    description,
    period_type: periodType,
    start_date: startDate,
    end_date: endDate,
    active,
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;

    if (id === "create_campaign") {
      if (isCampaignInfoValid(campaignArgs)) {
        const result = await fetchCreateCampaign(campaignArgs, context);

        if (result.status === 200) {
          alert(result.message);
          if (result.success) {
            router.push("/campaign");
          }
        } else {
          alert(`캠페인 생성을 실패 하였습니다. 상태 코드: ${result.status}`);
          console.error("캠페인 생성을 실패 하였습니다. 상태 코드:", result.status);
        }
      } else {
        console.error("입력한 정보가 유효하지 않습니다.");
      }
    }
  };

  return (
    <DashboardContainer title="새 캠페인 생성" onclick={handleSubmit} onclickText="저장하기" buttonId="create_campaign">
      <ContentsContainer variant="dashboard">
        <CampaignDetails
          page_type="NEW"
          campaignArgs={campaignArgs}
          setPeriod_type={setPeriodType}
          setDescription={setDescription}
          setActive={setActive}
          setTitle={setTitle}
          setStart_date={setStartDate}
          setEnd_date={setEndDate}
        />
      </ContentsContainer>
    </DashboardContainer>
  );
};

export default NewCampaign;
