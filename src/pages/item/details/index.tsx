import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { ItemType, ItemArgs, KakaoArgs, ProductsArgs, PromotionsArgs, RewardType, RewardsArgs } from "@/lib/item/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import ItemDetails from "@/components/layout/item/ItemDetails";
import RewardCard from "@/components/layout/item/RewardCard";
import router from "next/router";
import RewardComponent from "@/components/layout/item/RewardList";
import { fetchGetItemDetails } from "@/lib/item/apis";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { item_id, campaign_id }: any = context.query;

  const IDetailApiResponse = await fetchGetItemDetails(item_id, campaign_id, context);
  if (!IDetailApiResponse) {
    return {
      redirect: {
        destination: "/campaign",
        permanent: false,
      },
    };
  }
  return {
    props: {
      apiResponse: IDetailApiResponse,
      campaign_id,
    },
  };
};

const DetailsItem = (apiResponse: any, context: GetServerSidePropsContext) => {
  const campaign_id = apiResponse.campaign_id;
  const response = apiResponse.apiResponse;
  //const item_id = response.id || "";
  const [title, setTitle] = useState(response.title);
  const [kakaoArgs, setKakaoArgs] = useState<KakaoArgs>(response.kakao_args || {});
  const [kakao_message, setKakao_message] = useState(kakaoArgs.message || "");
  const [rewards, setRewards] = useState<RewardsArgs[]>(response.rewards || []);
  const [item_type, setItem_type] = useState<ItemType>(response.item_type);
  const [active, setActive] = useState(response.active);
  const [reward_type, setReward_Type] = useState<RewardType>(response.reward_type || "");
  const [productInputs, setProductInputs] = useState<ProductsArgs[]>(
    response.products?.length > 0 ? [...response.products] : [{ product_model_code: "" }]
  );
  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>(
    response.promotions?.length > 0 ? [...response.promotions] : [{ description: "" }]
  );
  const itemArgs: ItemArgs = {
    id: response.id || "",
    title,
    item_type,
    kakao_args: kakaoArgs,
    products: [response.products],
    promotions: [response.promotions],
    rewards,
    active,
    campaign_id,
  };
  useEffect(() => {
    setKakaoArgs({ message: kakao_message });
  }, [kakao_message]);

  const handleSubmit = () => {
    router.push(`/campaign/details?campaign_id=${campaign_id}`);
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  return (
    <DashboardContainer>
      <div className="flex w-full justify-between items-center mb-3 h-[42px]">
        <div className="subject-container flex w-full">
          <a className="text-2xl font-bold">아이템 상세</a>
        </div>

        <div className="button-container flex justify-end w-full">
          <button
            className="flex items-center justify-center bg-gray-400 text-white border p-2 rounded-lg cursor-pointer"
            onClick={handleSubmit}
            id="back_campaign_details"
          >
            <ArrowBackIosIcon fontSize="small" />
            <span className="ml-1 sm:hidden">뒤로가기</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row md:flex-row w-full justify-center md:space-x-4 lg:space-x-4">
        <ContentsContainer variant="campaign">
          <ItemDetails
            page_type="DETAILS"
            item_type={item_type}
            itemArgs={itemArgs}
            kakao_message={kakao_message}
            campaign_id={campaign_id}
            productInputs={productInputs}
            promotionInputs={promotionInputs}
            active={active}
            setProductInputs={setProductInputs}
            setPromotionInputs={setPromotionInputs}
            setItem_type={setItem_type}
            setTitle={setTitle}
            setKakao_message={setKakao_message}
            setActive={setActive}
            handleKeyDown={handleKeyDown}
          />
        </ContentsContainer>
        <ContentsContainer variant="campaign">
          <RewardComponent
            page_type="DETAILS"
            handleKeyDown={handleKeyDown}
            reward_type={reward_type}
            setRewardType={setReward_Type}
            rewards={rewards}
            setRewards={setRewards}
          />
          <RewardCard rewards={rewards} setRewards={setRewards} page_type="DETAILS" />
        </ContentsContainer>
      </div>
    </DashboardContainer>
  );
};

export default DetailsItem;
