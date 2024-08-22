import CampaignContents from "@/components/layout/campaign/DashboardContents";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import RewardComponent from "@/components/layout/item/RewardComponent";
import { fetchCreateItem } from "@/pages/campaign/lib/apis";
import {
  ItemType,
  ItemArgs,
  KakaoArgs,
  ProductsArgs,
  PromotionsArgs,
  RewardArgs,
  RewardType,
} from "@/pages/item/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useRef, KeyboardEvent, useEffect } from "react";

const ItemDetails = (context: GetServerSidePropsContext) => {
  //table style string
  const router = useRouter();

  const [item_type, setItem_type] = useState<ItemType>(ItemType.PM);
  const [title, setTitle] = useState("");
  const [products, setProducts] = useState<ProductsArgs[]>([]);
  const [promotions, setPromotions] = useState<PromotionsArgs[]>([]);
  const [kakaoArgs, setKakaoArgs] = useState<KakaoArgs>({ message: "" });
  const [kakao_message, setKakao_message] = useState<string>("");
  const [rewards, setRewards] = useState<RewardArgs[]>([]);
  const [active, setActive] = useState<boolean>(true);
  const [campaign_id, setCampaign_id] = useState("");

  const [reward_type, setReward_Type] = useState<RewardType>(RewardType.CO);
  const [couponInputs, setCouponInputs] = useState<RewardArgs[]>([{ reward_type: RewardType.CO, coupon_code: "" }]);
  const [pointInputs, setPointInputs] = useState<RewardArgs[]>([{ reward_type: RewardType.CO, point_amount: 0 }]);

  const infoCheck = (info: ItemArgs) => {
    if (!info.title) {
      alert("리퍼럴 명을 입력 해주세요.");
      return false;
    } else if (!info.kakao_args) {
      alert("카카오 메세지를 입력 해주세요.");
      return false;
    } else {
      return true;
    }
  };

  const itemArgs: ItemArgs = {
    title: title,
    item_type: item_type,
    kakao_args: kakaoArgs,
    products: products,
    promotions: promotions,
    rewards: rewards,
    campaign_id: campaign_id,
    active: active,
  };

  useEffect(() => {
    setKakaoArgs({ message: kakao_message });
  }, [kakao_message]);

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;

    if (id === "create_item") {
      if (infoCheck(itemArgs)) {
        const result = await fetchCreateItem(itemArgs, context);

        if (result.status === 200) {
          alert(result.message);
          if (result.success) {
            router.push("/campaign");
          }
        } else {
          alert("리퍼럴 생성을 실패 하였습니다. 상태 코드: " + result.status);
          console.log("리퍼럴 생성을 실패 하였습니다. 상태 코드:", result.status);
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
      <div className="flex">
        <CampaignContents>
          <ItemDetails
            itemArgs={itemArgs}
            kakao_message={kakao_message}
            setItem_type={setItem_type}
            setTitle={setTitle}
            setKakao_message={setKakao_message}
            handleKeyDown={handleKeyDown}
          />
        </CampaignContents>
        <CampaignContents>
          <RewardComponent
            setRewards={setRewards}
            handleKeyDown={handleKeyDown}
            reward_type={reward_type}
            couponInputs={couponInputs}
            pointInputs={pointInputs}
            setReward_Type={setReward_Type}
            setCouponInputs={setCouponInputs}
            setPointInputs={setPointInputs}
          />
        </CampaignContents>
      </div>
    </DashboardContainer>
  );
};

export default ItemDetails;
