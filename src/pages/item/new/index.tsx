import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import ItemDetails from "@/components/layout/item/ItemDetails";
import { fetchCreateItem } from "@/pages/campaign/lib/apis";
import { ItemType, RewardType, RewardDetailsArgs, ItemArgs } from "@/pages/campaign/lib/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useRef, KeyboardEvent } from "react";

const NewItem = (context: GetServerSidePropsContext) => {
  //table style string
  const router = useRouter();

  const [item_type, setItem_type] = useState<ItemType>(ItemType.PM);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [reward_type, setReward_type] = useState<RewardType>(RewardType.CO);
  const [reward_details, setReward_details] = useState<RewardDetailsArgs | null>(null);
  const [campaign_id, setCampaign_id] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  // const [newStart_date, setNewStartDate] = useState(new Date());
  // const [newEnd_date, setNewEndDate] = useState(new Date());

  const infoCheck = (info: ItemArgs) => {
    if (!info.title) {
      alert("리퍼럴 명을 입력 해주세요.");
      return false;
    } else if (!info.description) {
      alert("리퍼럴 설명을 입력 해주세요.");
      return false;
    } else if (!info.reward_details) {
      alert("리워드 내용을 입력 해주세요.");
      return false;
    } else {
      return true;
    }
  };

  const itemArgs: ItemArgs = {
    // shop_id: shop_id,
    item_type: item_type,
    title: title,
    description: description,
    reward_type: reward_type,
    reward_details: reward_details,
    active: active,
    // newStart_date: newStart_date,
    // newEnd_date: newEnd_date,
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
    <DashboardContainer title={"새 리퍼럴 생성"} onclick={handleSubmit} onclickText="저장하기" buttonId=" _item">
      <DashboardContents>
        <ItemDetails
          itemArgs={itemArgs}
          setItem_type={setItem_type}
          setTitle={setTitle}
          setDescription={setDescription}
          setReward_type={setReward_type}
          setReward_details={setReward_details}
          setCampaign_id={setCampaign_id}
          setActive={setActive}
          // setNewStartDate={setNewStartDate}
          // setNewEndDate={setNewEndDate}
        />
      </DashboardContents>
    </DashboardContainer>
  );
};

export default NewItem;
