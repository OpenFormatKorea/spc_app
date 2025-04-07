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
import { handleGoBack } from "@/lib/common";

const NewCampaign = (context: GetServerSidePropsContext) => {
  const router = useRouter();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const getFormattedDate = (date: string): string => {
    const targetDate = date === "today" ? today : tomorrow;
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    const hours = String(targetDate.getHours()).padStart(2, "0");
    const minutes = String(targetDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  };

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [period_type, setPeriod_type] = useState(PeriodType.L);
  const [start_date, setStart_date] = useState(getFormattedDate("today"));
  const [end_date, setEnd_date] = useState<string | null>(
    getFormattedDate("tomorrow"),
  );
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

  const handleSubmit = async () => {
    if (!loading && confirm("새로운 캠페인을 생성하시곘습니까?")) {
      setLoading(true);
      try {
        if (isCampaignInfoValid(campaignArgs)) {
          const result = await fetchCreateCampaign(campaignArgs, context);
          if (result.status === 200) {
            alert(result.message);
            if (result.success) {
              router.push("/campaign");
            }
          } else {
            alert(
              `캠페인 생성을 실패 하였습니다. 상태 코드: ${result.status}, 에러 메시지: ${result.message}`,
            );
          }
        }
      } catch (error) {
        console.error("Error creating campaign:", error);
      } finally {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <LoadingSpinner />
        </div>
      )}
      <DashboardContainer>
        <div className="mb-[8px] flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <span className="text-[24px] font-bold">새 캠페인 생성</span>
          </div>
          <div className="button-container flex w-full justify-end">
            <button
              className="flex cursor-pointer items-center justify-center rounded-lg border bg-gray-400 p-2 text-white"
              onClick={() => handleGoBack(router)}
            >
              <ArrowBackIosIcon fontSize="small" />
              <span className="hidden lg:ml-1 lg:block">뒤로가기</span>
            </button>
          </div>
        </div>
        <ContentsContainer variant="campaign">
          <div className="mb-3 flex h-full w-full flex-col items-center justify-between overflow-y-auto">
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
          </div>
          <div className="button-container flex w-full items-center justify-center pt-4">
            <button
              className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-blue-500 p-[5px] text-white"
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
