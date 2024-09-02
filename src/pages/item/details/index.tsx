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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { item_id }: any = context.query;
  const IDetailApiResponse = await fetchGetItemDetails(item_id, context);
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
      },
    };
  }
};

const DetailsItem = (apiResponse: any, context: GetServerSidePropsContext) => {
  console.log("apiResponse", apiResponse);
  const response = apiResponse.apiResponse;
  const [title, setTitle] = useState(response.title);
  const [products, setProducts] = useState<ProductsArgs[]>(response.product_item);
  const [promotions, setPromotions] = useState<PromotionsArgs[]>(response.promotion_item);
  const [kakaoArgs, setKakaoArgs] = useState<KakaoArgs>(response.kakao_args || {});
  const [kakao_message, setKakao_message] = useState<string>(kakaoArgs.message || "");
  const [rewards, setRewards] = useState<RewardsArgs[]>(response.rewards || []);
  const [item_type, setItem_type] = useState<ItemType>(response.item_type);
  const [reward_type, setReward_Type] = useState<RewardType>(response.reward_type || "");
  const itemArgs: ItemArgs = {
    title: title,
    item_type: item_type,
    kakao_args: kakaoArgs,
    products: products,
    promotions: promotions,
    rewards: rewards,
    campaign_id: "",
  };

  useEffect(() => {
    setKakaoArgs({ message: kakao_message });
  }, [kakao_message]);

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;
    // if (id === "modify_item") {
    //   const result = await fetchModifyItem(itemArgs, context);
    //   if (result.status === 200) {
    //     alert(result.message);
    //     if (result.success) {
    //       router.push("/campaign");
    //     }
    //   } else {
    //     alert("리퍼럴 수정을 실패 하였습니다. 상태 코드: " + result.status);
    //     return false;
    //   }
    // }
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
    <DashboardContainer title={"아이템 상세"} onclick={handleSubmit} onclickText="수정하기" buttonId="modify_item">
      <div className="flex flex-col md:flex-row w-full justify-center lg:space-x-4">
        <ContentsContainer variant="campaign">
          <ItemDetails
            page_type="DETAILS"
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
          <RewardCard rewards={rewards} setRewards={setRewards} page_type="DETAILS" />
        </ContentsContainer>
      </div>
    </DashboardContainer>
  );
};

export default DetailsItem;
