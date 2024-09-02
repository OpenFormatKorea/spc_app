import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemDetails from "@/components/layout/item/ItemDetails";
import {
  ItemType,
  ItemArgs,
  KakaoArgs,
  ProductsArgs,
  PromotionsArgs,
  RewardType,
  RewardsArgs,
} from "@/pages/item/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import RewardComponent from "@/components/layout/item/RewardComponent";
import RewardCard from "@/components/layout/item/RewardCard";
import { fetchCreateItem } from "@/pages/item/lib/apis";

const NewItem = (context: GetServerSidePropsContext) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [campaign_id, setCampaign_id] = useState("");
  const [products, setProducts] = useState<ProductsArgs[]>([]);
  const [promotions, setPromotions] = useState<PromotionsArgs[]>([]);
  const [kakaoArgs, setKakaoArgs] = useState<KakaoArgs>({ message: "" });
  const [kakao_message, setKakao_message] = useState<string>("");
  const [rewards, setRewards] = useState<RewardsArgs[]>([]);
  const [item_type, setItem_type] = useState<ItemType>(ItemType.PM);
  const [reward_type, setReward_Type] = useState<RewardType>(RewardType.CO);

  const infoCheck = (info: ItemArgs) => {
    return true;
  };

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
  useEffect(() => {
    if (router.isReady) {
      const campaignId = router.query.campaign_id;
      if (typeof campaignId === "string") {
        setCampaign_id(campaignId);
      } else {
        console.error("campaign_id 타입 에러");
      }
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;

    if (id === "create_item") {
      if (infoCheck(itemArgs)) {
        const result = await fetchCreateItem(itemArgs, context);
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
      } else {
        console.log("입력한 정보가 유효하지 않습니다.");
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
    <DashboardContainer title={"새 리퍼럴 생성"} onclick={handleSubmit} onclickText="저장하기" buttonId="create_item">
      <div className="flex flex-col md:flex-row w-full justify-center lg:space-x-4">
        <ContentsContainer variant="campaign">
          <ItemDetails
            page_type="NEW"
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
          <RewardCard rewards={rewards} setRewards={setRewards} page_type="NEW" />
        </ContentsContainer>
      </div>
    </DashboardContainer>
  );
};

export default NewItem;
