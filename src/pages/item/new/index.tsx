import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import ItemDetails from "@/components/layout/item/ItemDetails";
import ItemTypeComponent from "@/components/layout/item/ItemTypeComponent";
import RewardDetails from "@/components/layout/item/RewardDetails";
import { fetchCreateItem } from "@/pages/campaign/lib/apis";
import {
  ItemType,
  RewardType,
  ItemArgs,
  KakaoArgs,
  ProductsArgs,
  PromotionsArgs,
  RewardArgs,
} from "@/pages/item/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useRef, KeyboardEvent } from "react";

const NewItem = (context: GetServerSidePropsContext) => {
  //table style string
  const router = useRouter();

  const [item_type, setItem_type] = useState<ItemType>(ItemType.PM);
  const [title, setTitle] = useState("");
  const [kakao_message, setKakao_message] = useState("");
  const [products, setProducts] = useState<ProductsArgs[]>([]);
  const [promotions, setPromotions] = useState<PromotionsArgs[]>([]);
  const [rewards, setRewards] = useState<RewardArgs[]>([]);
  const [campaign_id, setCampaign_id] = useState("");
  const [coupon_code, setCoupon_code] = useState("");
  const [point_amount, setPoint_amount] = useState(0);
  const [active, setActive] = useState<boolean>(true);

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
  const kakao_args: KakaoArgs = {
    message: kakao_message,
  };

  const itemArgs: ItemArgs = {
    title: title,
    item_type: item_type,
    kakao_args: kakao_args,
    products: products,
    promotions: promotions,
    rewards: rewards,
    campaign_id: campaign_id,
    active: active,
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission behavior if it's in a form element
      if (buttonRef.current) {
        buttonRef.current.click(); // Trigger the click event on the login button
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;

    if (id === "create_campaign") {
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
  return (
    <DashboardContainer title={"새 리퍼럴 생성"} onclick={handleSubmit} onclickText="저장하기" buttonId="new_item">
      <DashboardContents>
        <ItemDetails
          itemArgs={itemArgs}
          setItem_type={setItem_type}
          setTitle={setTitle}
          setCampaign_id={setCampaign_id}
          setActive={setActive}
        />
      </DashboardContents>
      <DashboardContents>
        {/* <RewardDetails
          itemArgs={itemArgs}
          setItem_type={setItem_type}
          setTitle={setTitle}
          item_type={item_type}
          setDescription={setDescription}
          setReward_type={setReward_type}
          setCampaign_id={setCampaign_id}
          setActive={setActive}
        /> */}
      </DashboardContents>
    </DashboardContainer>
  );
};

export default NewItem;
