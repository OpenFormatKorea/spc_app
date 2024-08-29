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
import { useRouter } from "next/router";
import RewardComponent from "@/components/layout/item/RewardComponent";
import RewardCard from "@/components/layout/item/RewardCard";
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { fetchCreateItem, fetchGetItemDetails, fetchModifyItem } from "@/pages/item/lib/apis";
import { authenticateUserforHeader } from "@/lib/auth";
import { getShopIdFromCookies } from "@/lib/helper";
import { title } from "process";
import ItemDetails from "@/components/layout/item/ItemDetails";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { item_id }: any = context.query;
  const authResponse = authenticateUserforHeader(context);
  const IDetailApiResponse = await fetchGetItemDetails(item_id, context);
  const shop_id = getShopIdFromCookies(context);
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
        authResponse: authResponse,
        apiResponse: IDetailApiResponse,
      },
    };
  }
};

const DetailsItem = (apiResponse: any, context: GetServerSidePropsContext) => {
  const router = useRouter();

  const [title, setTitle] = useState(apiResponse.title);
  const [campaign_id, setCampaign_id] = useState("");
  const [products, setProducts] = useState<ProductsArgs[]>(apiResponse.products);
  const [promotions, setPromotions] = useState<PromotionsArgs[]>(apiResponse.promotions);
  const [kakaoArgs, setKakaoArgs] = useState<KakaoArgs>(apiResponse.kakaoArgs || {});
  const [kakao_message, setKakao_message] = useState<string>(apiResponse.kakao_message || "");
  const [rewards, setRewards] = useState<RewardsArgs[]>(apiResponse.rewards);
  const [item_type, setItem_type] = useState<ItemType>(apiResponse.item_type);
  const [reward_type, setReward_Type] = useState<RewardType>(apiResponse.reward_type);

  const itemArgs: ItemArgs = {
    title: title,
    item_type: item_type,
    kakao_args: kakaoArgs,
    products: products,
    promotions: promotions,
    rewards: rewards,
    campaign_id: campaign_id,
  };

  useEffect(() => {
    setKakaoArgs({ message: kakao_message });
  }, [kakao_message]);

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;
    if (id === "modify_item") {
      const result = await fetchModifyItem(itemArgs, context);
      console.log("itemArgs", itemArgs);
      if (result.status === 200) {
        alert(result.message);
        if (result.success) {
          router.push("/campaign");
        }
      } else {
        alert("리퍼럴 생성을 실패 하였습니다. 상태 코드: " + result.status);
        return false;
      }
    }
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
    <DashboardContainer title={"리퍼럴 상세"} onclick={handleSubmit} onclickText="수정하기" buttonId="modify_item">
      <div className="flex flex-col md:flex-row w-full justify-center ">
        <ContentsContainer variant="campaign">
          <ItemDetails
            item_type={item_type}
            itemArgs={itemArgs}
            kakao_message={kakao_message}
            setItem_type={setItem_type}
            setTitle={setTitle}
            setProducts={setProducts}
            setPromotions={setPromotions}
            setKakao_message={setKakao_message}
            handleKeyDown={handleKeyDown}
          />
        </ContentsContainer>
        <ContentsContainer variant="campaign">
          <RewardComponent
            handleKeyDown={handleKeyDown}
            reward_type={reward_type}
            setRewardType={setReward_Type}
            rewards={rewards}
            setRewards={setRewards}
          />
          <div className="w-full">
            <RewardCard rewards={rewards} setRewards={setRewards} />
          </div>
        </ContentsContainer>
      </div>
    </DashboardContainer>
  );
};

export default DetailsItem;
