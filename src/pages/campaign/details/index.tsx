import LoadingSpinner from "@/components/base/LoadingSpinner";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import CampaignDetails from "@/components/layout/campaign/CampaignDetails";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ItemList from "@/components/layout/item/item/ItemList";
import { withAuth } from "@/hoc/withAuth";
import {
  fetchDeleteCampaign,
  fetchGetCampaignDetails,
  fetchModifyCampaign,
} from "@/lib/campaign/apis";
import { CampaignArgs, PeriodType } from "@/lib/campaign/types";
import { getShopIdFromCookies } from "@/lib/helper";
import { fetchGetItemList } from "@/lib/item/apis";
import { ApiResponse } from "@/lib/types";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import CampaignRecord from "@/components/layout/campaign/modal/record/CampaignRecord";
import { handleGoBack } from "@/lib/common";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { campaign_id }: any = context.query;
  const shop_id: any = getShopIdFromCookies(context);
  const itemListApiResponse = await fetchGetItemList(campaign_id, context);
  const cDetailApiResponse = await fetchGetCampaignDetails(
    campaign_id,
    shop_id,
    context,
  );

  if (!cDetailApiResponse || cDetailApiResponse.shop_id !== shop_id) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      itemListApiResponse,
      cDetailApiResponse,
      campaign_id,
    },
  };
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
  context: GetServerSidePropsContext,
) => {
  const router = useRouter();
  const [title, setTitle] = useState(cDetailApiResponse.title);
  const [description, setDescription] = useState(
    cDetailApiResponse.description,
  );
  const [period_type, setPeriod_type] = useState(
    cDetailApiResponse.period_type,
  );
  const [start_date, setStart_date] = useState(cDetailApiResponse.start_date);
  const [end_date, setEnd_date] = useState(cDetailApiResponse.end_date);
  const [active, setActive] = useState(cDetailApiResponse.active);
  const shopId = cDetailApiResponse.shop_id || "";
  const createdAt = cDetailApiResponse.created_at || "";
  const [createdByUserName, setCreatedByUserName] = useState(
    cDetailApiResponse.created_by_username || "",
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const [pageNum, setPageNum] = useState<string>("1");
  const pageSize = "25";

  const campaignArgs: CampaignArgs = {
    title,
    description,
    period_type: period_type,
    start_date: start_date,
    end_date: end_date,
    active: active,
    shop_id: shopId,
    created_by_username: createdByUserName,
    created_at: createdAt,
  };

  useEffect(() => {
    if (period_type === PeriodType.UL) {
      setEnd_date(null);
    } else {
      setEnd_date(cDetailApiResponse.end_date || null);
    }
  }, [period_type, cDetailApiResponse.end_date]);

  useEffect(() => {
    if (itemListApiResponse) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [itemListApiResponse]);

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget as HTMLButtonElement;
    setLoading(true);
    if (
      id === "modify_campaign" &&
      isInfoValid(campaignArgs) &&
      confirm("캠페인을 수정 하시겠습니까?")
    ) {
      const result = await fetchModifyCampaign(
        campaign_id,
        campaignArgs,
        context,
      );
      if (result.status === 200) {
        alert("캠페인을 수정 하였습니다.");
        router.push(`/campaign/details?campaign_id=${campaign_id}`);
      } else {
        alert(`캠페인 수정을 실패 하였습니다. 상태 코드: ${result.status}`);
      }
    } else if (
      id === "delete_campaign" &&
      confirm("캠페인을 정말 삭제 하시겠습니까?")
    ) {
      const result = await fetchDeleteCampaign(campaign_id, context);
      if (result.status === 200) {
        alert("캠페인 삭제를 완료 하였습니다.");
        router.push("/campaign");
      } else {
        alert(`캠페인 삭제를 실패 하였습니다. 상태 코드: ${result.status}`);
      }
    }
    setLoading(false);
  };

  const isInfoValid = (info: CampaignArgs): boolean => {
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
    // Check if start_date is earlier than end_date
    const startDateTime = new Date(info.start_date).getTime();
    const endDateTime = new Date(info.end_date || "").getTime();
    if (info.period_type === PeriodType.L && startDateTime >= endDateTime) {
      alert("캠페인 시작 시간은 종료 시간보다 빨라야 합니다.");
      return false;
    }
    return true;
  };

  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "more_campaign") {
      router.push("/campaign");
    } else if (id === "create_item") {
      router.push(`/item/new?campaign_id=${campaign_id}`);
    }
  };

  useEffect(() => {
    if (itemListApiResponse) {
      setLoading(false);
    }
  }, [itemListApiResponse]);

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
            <span className="text-[24px] font-bold">캠페인 상세 정보</span>
          </div>
          <div className="button-container flex w-full justify-end">
            <button
              className="flex cursor-pointer items-center justify-center rounded-lg border bg-gray-400 p-2 text-white"
              onClick={() => router.push("/campaign")}
            >
              <ArrowBackIosIcon fontSize="small" />
              <span className="hidden lg:ml-1 lg:block">뒤로가기</span>
            </button>
          </div>
        </div>
        <div className="flex w-full flex-col gap-[10px] md:flex-row">
          <ContentsContainer variant="campaign">
            <CampaignDetails
              page_type="DETAILS"
              period_type={period_type}
              campaign_id={campaign_id}
              campaignArgs={campaignArgs}
              setPeriod_type={setPeriod_type}
              setDescription={setDescription}
              setActive={setActive}
              setTitle={setTitle}
              setStart_date={setStart_date}
              setEnd_date={setEnd_date}
              setIsOpen={setIsModalOpen}
            />
          </ContentsContainer>
          <ContentsContainer variant="campaign">
            <div className="mb-3 flex h-full w-full flex-col items-center justify-between overflow-y-auto">
              <ItemList
                apiResponse={itemListApiResponse}
                handleButton={handleButton}
                campaign_id={campaign_id}
              />
            </div>
          </ContentsContainer>
        </div>
        <div className="flex items-center justify-end gap-[10px] p-[5px]">
          <button
            id="delete_campaign"
            className="w-full cursor-pointer rounded-lg border bg-red-500 p-2 text-white lg:w-fit"
            onClick={handleSubmit}
          >
            삭제하기
          </button>
          <button
            id="modify_campaign"
            className="w-full cursor-pointer rounded-lg border bg-blue-500 p-2 text-white lg:w-fit"
            onClick={handleSubmit}
          >
            수정하기
          </button>
        </div>
      </DashboardContainer>
    </>
  );
};

export default withAuth(DetailsCampaign);
