import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { CampaignArgs, PeriodType } from "@/lib/campaign/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { fetchCreateCampaign } from "@/lib/campaign/apis";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { withAuth } from "@/hoc/withAuth";
import CampaignNew from "@/components/layout/campaign/CampaignNew";

const NewCampaign = (context: GetServerSidePropsContext) => {
  const router = useRouter();

  const today = new Date();
  const getFormattedDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  };
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [period_type, setPeriod_type] = useState(PeriodType.L);
  const [start_date, setStart_date] = useState(getFormattedDate);
  const [end_date, setEnd_date] = useState<string | null>(getFormattedDate);
  const [active, setActive] = useState(false);

  // Validate campaign information
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
    const startDateTime = new Date(info.start_date).getTime();
    const endDateTime = new Date(info.end_date || "").getTime();
    if (info.period_type === PeriodType.L && startDateTime >= endDateTime) {
      alert("캠페인 시작 시간은 종료 시간보다 빨라야 합니다.");
      return false;
    }
    return true;
  };

  const campaignArgs: CampaignArgs = {
    title,
    description,
    period_type: period_type,
    start_date: start_date,
    end_date: end_date,
    active,
  };

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    if (id === "create_campaign") {
      if (loading == false) {
        setLoading(true);
        if (isCampaignInfoValid(campaignArgs)) {
          const result = await fetchCreateCampaign(campaignArgs, context);
          if (result.status === 200) {
            setLoading(false);
            alert(result.message);
            if (result.success) {
              router.push("/campaign");
            }
          } else {
            setLoading(false);
            alert(`캠페인 생성을 실패 하였습니다. 상태 코드: ${result.status}`);
          }
        }
      }
    } else if (id === "cancel_modify_campaign") {
      router.push("/campaign");
    }
  };

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <LoadingSpinner />
        </div>
      )}
      <DashboardContainer>
        <div className="mb-3 flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <span className="text-2xl font-bold">새 캠페인 생성</span>
          </div>

          <div className="button-container flex w-full justify-end">
            <button
              className="flex cursor-pointer items-center justify-center rounded-lg border bg-gray-400 p-2 text-white"
              onClick={handleSubmit}
              id="cancel_modify_campaign"
            >
              <ArrowBackIosIcon fontSize="small" />
              <span className="hidden lg:ml-1 lg:block">뒤로가기</span>
            </button>
          </div>
        </div>
        <ContentsContainer variant="campaign">
          <CampaignNew
            page_type="NEW"
            campaignArgs={campaignArgs}
            period_type={period_type}
            setPeriod_type={setPeriod_type}
            setDescription={setDescription}
            setActive={setActive}
            setTitle={setTitle}
            setStart_date={setStart_date}
            setEnd_date={setEnd_date}
          />
          <div className="button-container flex w-full items-center justify-center pt-4">
            <button
              className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-blue-500 p-2 text-white"
              onClick={handleSubmit}
              id="create_campaign"
            >
              저장하기
            </button>
          </div>
        </ContentsContainer>
      </DashboardContainer>
    </>
  );
};

export default withAuth(NewCampaign);
