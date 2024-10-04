import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemTypeDetails from "@/components/layout/item/ItemTypeDetails";
import ItemDetails from "@/components/layout/item/ItemDetails";
import RewardCard from "@/components/layout/item/RewardCard";
import RewardComponent from "@/components/layout/item/RewardComponent";
import { useState, useRef, KeyboardEvent } from "react";
import { fetchGetItemDetails } from "@/lib/item/apis";
import { GetServerSideProps } from "next";
import router from "next/router";
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
  const response = apiResponse;
  console.log("DetailsItem response", response);
  const page_type = "DETAILS";
  const [title, setTitle] = useState(response.title);
  const [productInputs, setProductInputs] = useState<ProductsArgs[]>([
    {
      product_model_code: "",
      product_model_name: "",
      images: [{ posThumb: "" }, { thumb: "" }],
    },
  ]);
  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>([{ description: "" }]);
  const [couponInputs, setCouponInputs] = useState<CouponsArgs[]>([]);
  const selectedProductItem = [
    response.products?.length > 0
      ? {
          product_model_code: response.products.model_code,
          product_model_name: response.products.model_name,
        }
      : {
          product_model_code: "",
          product_model_name: "",
        },
  ];
  const [selectedCouponItems, setSelectedCouponItems] = useState<CouponsArgs[]>([]);
  const [kakaoShareArgs, setKakaoShareArgs] = useState<KakaoShareArgs>(response.kakao_args);
  const [rewards, setRewards] = useState<RewardsArgs[]>(response.rewards || []);
  const [item_type, setItem_type] = useState<ItemType>(response.item_type);
  const [active, setActive] = useState(response.active);
  const [reward_type, setReward_Type] = useState<RewardType>(response.rewards[0]?.reward_type || RewardType.CO);
  const image: string = kakaoShareArgs.image;
  const shop_logo: string = kakaoShareArgs.shop_logo;
  const [description, setDescription] = useState<string>(response.promotions?.description || "");
  const itemArgs: ItemArgs = {
    id: response.id || "",
    title,
    item_type,
    kakao_args: kakaoShareArgs,
    products: productInputs,
    promotions: promotionInputs,
    rewards,
    active,
    campaign_id,
  };

  const onChangeImage = (imgType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {};

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

  const disableInput = page_type === "DETAILS";

  return (
    <>
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
              active={active}
              setItem_type={setItem_type}
              setTitle={setTitle}
              setKakaoShareArgs={setKakaoShareArgs}
              setProductInputs={setProductInputs}
              setPromotionInputs={setPromotionInputs}
              setActive={setActive}
              handleKeyDown={handleKeyDown}
              image={image}
              shop_logo={shop_logo}
              onChangeImage={onChangeImage}
              disableInput={true}
            />
          </ContentsContainer>
          <ContentsContainer variant="campaign">
            <ItemTypeDetails
              page_type="DETAILS"
              item_type={item_type}
              itemArgs={itemArgs}
              description={description}
              selectedProductItems={selectedProductItem}
              setPromotionInputs={setPromotionInputs}
              setDescription={setDescription}
              setItem_type={setItem_type}
              setProductInputs={setProductInputs}
              handleKeyDown={handleKeyDown}
              disableInput={true}
            />
            <RewardComponent
              page_type="DETAILS"
              handleKeyDown={handleKeyDown}
              reward_type={reward_type}
              selectedCouponItems={selectedCouponItems}
              couponInputs={couponInputs}
              setRewardType={setReward_Type}
              disableInput={true}
              setSelectedCouponItems={setSelectedCouponItems}
              setCouponInputs={setCouponInputs}
              setRewards={setRewards}
            />
            <RewardCard rewards={rewards} setRewards={setRewards} page_type="DETAILS" />
          </ContentsContainer>
        </div>
        <div>
          <div className="button-container w-full pt-4 flex justify-between lg:justify-end ">
            <div className="flex space-x-2 w-full lg:w-fit">
              <button
                className="border p-2 w-full lg:w-fit text-white rounded-lg cursor-pointer flex items-center justify-center bg-gray-400"
                onClick={handleSubmit}
                id="cancel_create_item"
              >
                뒤로가기
              </button>
            </div>
          </div>
        </div>
      </DashboardContainer>
    </>
  );
};

export default DetailsItem;
