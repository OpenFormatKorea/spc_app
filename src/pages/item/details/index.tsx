import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemTypeDetails from "@/components/layout/item/ItemTypeDetails";
import RewardComponent from "@/components/layout/item/RewardList";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ItemDetails from "@/components/layout/item/ItemDetails";
import RewardCard from "@/components/layout/item/RewardCard";
import { useState, useRef, KeyboardEvent } from "react";
import { fetchGetItemDetails } from "@/lib/item/apis";
import { getShopIdFromCookies } from "@/lib/helper";
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
} from "@/lib/item/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { item_id, campaign_id }: any = context.query;
  const shop_id = getShopIdFromCookies(context);
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
      shop_id,
      campaign_id,
    },
  };
};

const DetailsItem = ({ apiResponse, campaign_id }: { apiResponse: any; shop_id: string; campaign_id: string }) => {
  const response = apiResponse;
  const page_type = "DETAILS"; // Assuming this value is being used

  const [title, setTitle] = useState(response.title);
  const [kakaoShareArgs, setKakaoShareArgs] = useState<KakaoShareArgs>(response.kakao_args);
  const [rewards, setRewards] = useState<RewardsArgs[]>(response.rewards || []);
  const [item_type, setItem_type] = useState<ItemType>(response.item_type);
  const [active, setActive] = useState(response.active);
  const [reward_type, setReward_Type] = useState<RewardType>(response.reward_type || "");
  const [image, setImage] = useState<string>(kakaoShareArgs.image);
  const [shop_logo, setShop_logo] = useState<string>(kakaoShareArgs.shop_logo);

  const [productInputs, setProductInputs] = useState<ProductsArgs[]>(
    response.products?.length > 0
      ? [...response.products]
      : [
          {
            product_model_code: "",
            product_model_name: "",
            images: [{ posThumb: "" }, { thumb: "" }],
          },
        ]
  );
  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>(
    response.promotions?.length > 0 ? [...response.promotions] : [{ description: "" }]
  );

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

  const onChangeImage = (imgType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        if (imgType === "image") {
          setImage(reader.result);
        } else if (imgType === "shop_logo") {
          setShop_logo(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

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

      <div className="flex flex-col sm:flex-row w-full justify-center md:space-x-4 lg:space-x-4">
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
            productInputs={productInputs}
            promotionInputs={promotionInputs}
            setItem_type={setItem_type}
            setProductInputs={setProductInputs}
            setPromotionInputs={setPromotionInputs}
            disableInput={true}
          />

          <RewardComponent
            page_type="DETAILS"
            handleKeyDown={handleKeyDown}
            reward_type={reward_type}
            setRewardType={setReward_Type}
            rewards={rewards}
            setRewards={setRewards}
            disableInput={true}
          />

          <RewardCard rewards={rewards} setRewards={setRewards} page_type="DETAILS" />
        </ContentsContainer>
      </div>
    </DashboardContainer>
  );
};

export default DetailsItem;
