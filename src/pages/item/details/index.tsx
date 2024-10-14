import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemTypeDetails from "@/components/layout/item/item/ItemTypeDetails";
import ItemDetails from "@/components/layout/item/item/ItemDetails";
import RewardComponent from "@/components/layout/item/reward/RewardComponent";
import RewardCard from "@/components/layout/item/reward/RewardCard";
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { fetchGetItemDetails } from "@/lib/item/apis";
import { GetServerSideProps } from "next";
import router, { useRouter } from "next/router";
import {
  ItemType,
  ItemArgs,
  ProductsArgs,
  PromotionsArgs,
  RewardType,
  RewardsArgs,
  KakaoShareArgs,
  CouponsArgs,
} from "@/lib/item/types";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { withAuth } from "@/hoc/withAuth";

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

const DetailsItem = ({ apiResponse, campaign_id }: { apiResponse: any; campaign_id: string }) => {
  const [title, setTitle] = useState(apiResponse.title);
  const [productInputs, setProductInputs] = useState<ProductsArgs[]>([
    {
      product_model_code: "",
      product_model_name: "",
      images: [{ posThumb: "" }, { thumb: "" }],
    },
  ]);
  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>([{ description: "" }]);
  const [couponInputs, setCouponInputs] = useState<CouponsArgs[]>([]);
  const [selectedCouponItems, setSelectedCouponItems] = useState<CouponsArgs[]>([]);
  const [kakaoShareArgs, setKakaoShareArgs] = useState<KakaoShareArgs>(apiResponse.kakao_args);
  const [rewards, setRewards] = useState<RewardsArgs[]>(apiResponse.rewards || []);
  const [item_type, setItem_type] = useState<ItemType>(apiResponse.item_type);
  const [active, setActive] = useState(apiResponse.active);
  const [reward_type, setReward_Type] = useState<RewardType>(apiResponse.rewards[0]?.reward_type || RewardType.CO);
  const [description, setDescription] = useState<string>(apiResponse.promotions?.description || "");
  const [loading, setLoading] = useState(true);

  const image = kakaoShareArgs.image;
  const shop_logo = kakaoShareArgs.shop_logo;
  const itemArgs: ItemArgs = {
    id: apiResponse.id || "",
    title,
    item_type,
    kakao_args: kakaoShareArgs,
    products: productInputs,
    promotions: promotionInputs,
    rewards,
    active,
    campaign_id,
  };

  const handleSubmit = () => {
    const router = useRouter();
    router.push(`/campaign/details?campaign_id=${campaign_id}`);
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  const disableInput = true;

  useEffect(() => {
    if (apiResponse) {
      setLoading(false);
    }
  }, [apiResponse]);
  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <LoadingSpinner />
        </div>
      )}
      <DashboardContainer>
        <div className="flex w-full justify-between items-center mb-3 h-[42px]">
          <div className="subject-container flex w-full">
            <a className="text-2xl font-bold">아이템 상세</a>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row w-full justify-center lg:space-x-4">
          <ContentsContainer variant="campaign">
            <ItemDetails
              page_type="DETAILS"
              itemArgs={itemArgs}
              kakaoShareArgs={kakaoShareArgs}
              campaign_id={campaign_id}
              setItem_type={setItem_type}
              setTitle={setTitle}
              setKakaoShareArgs={setKakaoShareArgs}
              setProductInputs={setProductInputs}
              setPromotionInputs={setPromotionInputs}
              setActive={setActive}
              handleKeyDown={handleKeyDown}
              image={image}
              shop_logo={shop_logo}
              disableInput={disableInput}
            />
          </ContentsContainer>
          <ContentsContainer variant="campaign">
            <ItemTypeDetails
              page_type="DETAILS"
              item_type={item_type}
              itemArgs={itemArgs}
              description={description}
              selectedProductItems={[
                {
                  product_model_code: apiResponse.products?.model_code || "",
                  product_model_name: apiResponse.products?.model_name || "",
                },
              ]}
              setPromotionInputs={setPromotionInputs}
              setDescription={setDescription}
              setItem_type={setItem_type}
              setProductInputs={setProductInputs}
              handleKeyDown={handleKeyDown}
              disableInput={disableInput}
            />
            <RewardComponent
              page_type="DETAILS"
              handleKeyDown={handleKeyDown}
              reward_type={reward_type}
              selectedCouponItems={selectedCouponItems}
              couponInputs={couponInputs}
              setRewardType={setReward_Type}
              disableInput={disableInput}
              setSelectedCouponItems={setSelectedCouponItems}
              setCouponInputs={setCouponInputs}
              setRewards={setRewards}
            />
            <RewardCard rewards={rewards} setRewards={setRewards} page_type="DETAILS" />
          </ContentsContainer>
        </div>
        <div className="button-container w-full pt-4 flex justify-between lg:justify-end">
          <button
            className="border p-2 w-full lg:w-fit text-white rounded-lg cursor-pointer flex items-center justify-center bg-gray-400"
            onClick={handleSubmit}
            id="cancel_create_item"
          >
            뒤로가기
          </button>
        </div>
      </DashboardContainer>
    </>
  );
};

export default withAuth(DetailsItem);
