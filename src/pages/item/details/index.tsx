import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemTypeDetails from "@/components/layout/item/item/ItemTypeDetails";
import ItemDetails from "@/components/layout/item/item/ItemDetails";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import {
  fetchGetCouponCodeList,
  fetchGetItemDetails,
  fetchGetProductCodeList,
} from "@/lib/item/apis";
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
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { withAuth } from "@/hoc/withAuth";
import RewardComponentDetails from "@/components/layout/item/reward/details/RewardComponentDetails";
import RewardNewCardDetails from "@/components/layout/item/reward/details/RewardNewCardDetails";
import { ApiResponse } from "@/lib/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { item_id, campaign_id }: any = context.query;
  const couponResponse = await fetchGetCouponCodeList(context);
  const IDetailApiResponse = await fetchGetItemDetails(
    item_id,
    campaign_id,
    context,
  );
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
      couponResponse: couponResponse,
    },
  };
};

const DetailsItem = ({
  apiResponse,
  campaign_id,
  couponResponse,
}: {
  apiResponse: any;
  campaign_id: string;
  couponResponse: ApiResponse;
}) => {
  const [title, setTitle] = useState(apiResponse.title);
  const [productInputs, setProductInputs] = useState<ProductsArgs[]>([
    {
      product_model_code: "",
      product_model_name: "",
      images: [{ posThumb: "" }, { thumb: "" }],
    },
  ]);
  const rewards = apiResponse.rewards || [];

  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>([
    { description: "" },
  ]);
  const [couponInputs, setCouponInputs] = useState<CouponsArgs[]>([]);
  const [selectedCouponItems, setSelectedCouponItems] = useState<CouponsArgs[]>(
    [],
  );
  const [kakaoShareArgs, setKakaoShareArgs] = useState<KakaoShareArgs>(
    apiResponse.kakao_args,
  );
  const [newRewards, setNewRewards] = useState<RewardsArgs[]>([]);
  const [item_type, setItem_type] = useState<ItemType>(apiResponse.item_type);
  const [active, setActive] = useState(apiResponse.active);
  const [reward_type, setReward_Type] = useState<RewardType>(
    apiResponse.rewards[0]?.reward_type || RewardType.CO,
  );
  const [description, setDescription] = useState<string>(
    apiResponse.promotions?.description || "",
  );
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
    router.push(`/campaign/details?campaign_id=${campaign_id}`);
  };
  const handleChangeModify = () => {
    router.push(`/campaign/details?campaign_id=${campaign_id}`);
  };
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedProductItems, setSelectedProductItems] = useState<
  //   ProductsArgs[]
  // >([]);
  const closeModal = () => setIsModalOpen(false);
  const openModal = () =>
    reward_type ? setIsModalOpen(true) : alert("리워드 종류를 선택해주세요.");
  const disableInput = false;

  useEffect(() => {
    if (apiResponse) {
      setLoading(false);
    }
  }, [apiResponse]);
  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <LoadingSpinner />
        </div>
      )}
      <DashboardContainer>
        <div className="flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <span className="text-2xl font-bold">아이템 상세</span>
          </div>
        </div>
        <div className="flex w-full flex-col justify-center lg:flex-row lg:space-x-4">
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
              disableInput={true}
            />

            <RewardComponentDetails
              apiResponse={couponResponse}
              handleKeyDown={handleKeyDown}
              reward_type={reward_type}
              selectedCouponItems={selectedCouponItems}
              couponInputs={couponInputs}
              setRewardType={setReward_Type}
              disableInput={disableInput}
              setSelectedCouponItems={setSelectedCouponItems}
              setCouponInputs={setCouponInputs}
              setRewards={setNewRewards}
              rewards={rewards}
            />

            <RewardNewCardDetails
              rewards={newRewards}
              setRewards={setNewRewards}
            />
          </ContentsContainer>
        </div>
        <div className="button-container flex w-full justify-between gap-2 pt-4 lg:justify-end">
          <button
            className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-gray-400 p-2 text-white lg:w-fit"
            onClick={handleSubmit}
            id="cancel_create_item"
          >
            뒤로가기
          </button>
          <button
            className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-blue-500 p-2 text-white lg:w-fit"
            id="modify_item"
          >
            수정하기
          </button>
        </div>
      </DashboardContainer>
    </>
  );
};

export default withAuth(DetailsItem);
