import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import {
  ItemType,
  ItemArgs,
  KakaoArgs,
  ProductsArgs,
  PromotionsArgs,
  RewardType,
  RewardsArgs,
} from "@/pages/item/lib/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import RewardComponent from "@/components/layout/item/RewardComponent";
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { fetchGetItemDetails } from "@/pages/item/lib/apis";
import ItemDetails from "@/components/layout/item/ItemDetails";
import RewardCard from "@/components/layout/item/RewardCard";
import router from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { item_id }: any = context.query;
  const { campaign_id }: any = context.query;

  const IDetailApiResponse = await fetchGetItemDetails(item_id, campaign_id, context);
  if (IDetailApiResponse == null) {
    return {
      redirect: {
        destination: "/campaign",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        apiResponse: IDetailApiResponse,
        campaign_id: campaign_id,
      },
    };
  }
};

const DetailsItem = (apiResponse: any, context: GetServerSidePropsContext) => {
  const campaign_id = apiResponse.campaign_id;
  const response = apiResponse.apiResponse;
  const item_id = response.id || "";
  const [title, setTitle] = useState(response.title);
  const [kakaoArgs, setKakaoArgs] = useState<KakaoArgs>(response.kakao_args || {});
  const [kakao_message, setKakao_message] = useState<string>(kakaoArgs.message || "");
  const [rewards, setRewards] = useState<RewardsArgs[]>(response.rewards || []);
  const [item_type, setItem_type] = useState<ItemType>(response.item_type);
  const [active, setActive] = useState(response.active);
  const [reward_type, setReward_Type] = useState<RewardType>(response.reward_type || "");

  const [itemArgs, setItemArgs] = useState<ItemArgs>({
    id: item_id,
    title: title,
    item_type: item_type,
    kakao_args: kakaoArgs,
    products: response.products,
    promotions: response.promotions,
    rewards: rewards,
    active: active,
    campaign_id: campaign_id,
  });

  const [productInputs, setProductInputs] = useState<ProductsArgs[]>(
    Array.isArray(response.products) && response.products.length > 0
      ? [...response.products]
      : [{ product_model_code: "" }] // Default empty product
  );

  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>(
    Array.isArray(response.promotions) && response.promotions.length > 0
      ? [...response.promotions]
      : [{ description: "" }] // Default empty promotion
  );
  useEffect(() => {
    setKakaoArgs({ message: kakao_message });
  }, [kakao_message]);

  const handleSubmit = async (event: React.FormEvent) => {
    router.push("/campaign/details?campaign_id=" + campaign_id);
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  return (
    <DashboardContainer
      title={"아이템 상세"}
      onclick={handleSubmit}
      onclickText="뒤로가기"
      buttonId={"back_campaign_details"}
    >
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