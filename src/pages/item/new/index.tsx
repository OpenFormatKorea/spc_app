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
import { useRouter } from "next/router";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import RewardCard from "@/components/layout/item/RewardCard";
import { fetchCreateItem } from "@/pages/item/lib/apis";
import { GetServerSidePropsContext } from "next";
import RewardComponent from "@/components/layout/item/RewardList";

const NewItem = (context: GetServerSidePropsContext) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [campaign_id, setCampaign_id] = useState("");
  const [productInputs, setProductInputs] = useState<ProductsArgs[]>([{ product_model_code: "" }]);
  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>([{ description: "" }]);
  const [kakaoArgs, setKakaoArgs] = useState<KakaoArgs>({ message: "" });
  const [kakao_message, setKakao_message] = useState<string>("");
  const [rewards, setRewards] = useState<RewardsArgs[]>([]);
  const [item_type, setItem_type] = useState<ItemType>(ItemType.PD);
  const [reward_type, setReward_Type] = useState<RewardType>(RewardType.CO);
  const [active, setActive] = useState(false);

  const itemArgs: ItemArgs = {
    title,
    item_type,
    kakao_args: kakaoArgs,
    products: productInputs,
    promotions: promotionInputs,
    rewards,
    campaign_id,
    active,
  };

  const infoCheck = () => {
    if (!title) {
      alert("아이템 명을 입력해주세요.");
      return false;
    }
    if (!kakao_message) {
      alert("카카오 메시지를 입력해주세요.");
      return false;
    }
    if (!productInputs[0].product_model_code && !promotionInputs[0].description) {
      alert("아이템 적용을 원하시는 상품 혹은 프로모션을 추가해주세요.");
      return false;
    }
    if (
      !rewards.length &&
      !confirm("해당 아이템에 아직 리워드가 추가되지 않았어요, 그래도 아이템 생성을 원하시나요?")
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (event.currentTarget.id === "create_item" && infoCheck()) {
      const result = await fetchCreateItem(itemArgs, campaign_id, context);
      if (result.status === 200) {
        alert(result.message);
        if (result.success) {
          router.push("/campaign");
        }
      } else {
        alert(`리퍼럴 생성을 실패하였습니다. 상태 코드: ${result.status}`);
      }
    } else if (event.currentTarget.id === "cancel_create_item") {
      router.push(`/campaign/details?campaign_id=${campaign_id}`);
    }
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  useEffect(() => {
    setKakaoArgs({ message: kakao_message });
  }, [kakao_message]);

  useEffect(() => {
    if (router.isReady) {
      const campaignId = router.query.campaign_id;
      if (typeof campaignId === "string") {
        setCampaign_id(campaignId);
      }
    }
  }, [router.isReady, router.query]);

  return (
    <DashboardContainer title="새 아이템 생성" onclick={handleSubmit} onclickText="저장하기" buttonId="create_item">
      <div className="flex flex-col md:flex-row w-full justify-center lg:space-x-4">
        <ContentsContainer variant="campaign">
          <ItemDetails
            page_type="NEW"
            item_type={item_type}
            itemArgs={itemArgs}
            kakao_message={kakao_message}
            campaign_id={campaign_id}
            productInputs={productInputs}
            promotionInputs={promotionInputs}
            active={active}
            setItem_type={setItem_type}
            setTitle={setTitle}
            setProductInputs={setProductInputs}
            setPromotionInputs={setPromotionInputs}
            setKakao_message={setKakao_message}
            setActive={setActive}
            handleKeyDown={handleKeyDown}
          />
        </ContentsContainer>
        <ContentsContainer variant="campaign">
          <RewardComponent
            page_type="NEW"
            handleKeyDown={handleKeyDown}
            reward_type={reward_type}
            setRewardType={setReward_Type}
          />
          <RewardCard rewards={rewards} setRewards={setRewards} page_type="NEW" />
        </ContentsContainer>
      </div>
    </DashboardContainer>
  );
};

export default NewItem;
