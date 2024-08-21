import InputRadioBox from "@/components/base/InputRadio";
import InputSelectBox from "@/components/base/InputSelectBox";
import InputTextBox from "@/components/base/InputText";
import { ItemArgs, ItemType, RewardDetailsArgs, RewardType } from "@/pages/campaign/lib/types";
import { useRef, KeyboardEvent } from "react";
import Calendar from "react-calendar";
interface ItemDetailsProps {
  itemArgs: ItemArgs;
  setItem_type: (value: ItemType) => void;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setReward_type: (value: RewardType) => void;
  setReward_details: (value: RewardDetailsArgs | null) => void;
  setCampaign_id: (value: string) => void;
  setActive: (value: boolean) => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({
  itemArgs,
  setItem_type,
  setTitle,
  setDescription,
  setReward_type,
  setReward_details,
  setCampaign_id,
  setActive,
}) => {
  const handleRewardTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReward_type(e.target.value as RewardType);
  };

  const handleItemTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem_type(e.target.value as ItemType);
  };

  const handleActiveRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActive(e.target.value === "true");
  };

  const handleCampaignIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCampaign_id(e.target.value);
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
    <div className="contents-container w-full justify-center items-center">
      <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
        <a className="w-[100px] text-md font-bold">리퍼럴 종류: </a>
        <InputRadioBox
          label="프로모션"
          name="item_type"
          value={ItemType.PM}
          checked={itemArgs.item_type === ItemType.PM}
          onChange={handleItemTypeRadioChange}
        />
        <InputRadioBox
          label="프로덕트"
          name="item_type"
          value={ItemType.PD}
          checked={itemArgs.item_type === ItemType.PD}
          onChange={handleItemTypeRadioChange}
        />
      </div>
      <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
        <a className="w-[100px] text-md font-bold">리퍼럴 명: </a>
        <InputTextBox
          type="text"
          id="title"
          placeholder="리퍼럴 명을 입력하세요."
          value={itemArgs.title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
        <a className="w-[100px] text-md font-bold">리퍼럴 설명: </a>
        <InputTextBox
          type="text"
          id="description"
          placeholder="리퍼럴 설명을 입력하세요."
          value={itemArgs.description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="inputForm p-2 flex space-x-4 items-center h-[60px] ">
        <a className="w-[100px] text-md font-bold">리워드 타입: </a>
        <InputRadioBox
          label="쿠폰"
          name="reward_type"
          value={RewardType.CO}
          checked={itemArgs.reward_type === RewardType.CO}
          onChange={handleRewardTypeChange}
        />
        <InputRadioBox
          label="포인트"
          name="reward_type"
          value={RewardType.PO}
          checked={itemArgs.reward_type === RewardType.PO}
          onChange={handleRewardTypeChange}
        />
      </div>
      <div className="inputForm p-2 flex space-x-4 items-center h-[60px] ">
        <a className="w-[100px] text-md font-bold">리워드 타입: </a>
        <InputSelectBox id="reward_type" value={RewardType.CO} options={[]} onChange={handleCampaignIdChange} />
      </div>

      <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
        <a className="w-[100px] text-md font-bold">리퍼럴 활성화: </a>
        <InputRadioBox
          label="활성화"
          name="active"
          value="true"
          checked={itemArgs.active === true}
          onChange={handleActiveRadioChange}
        />
        <InputRadioBox
          label="비활성화"
          name="active"
          value="false"
          checked={itemArgs.active === false}
          onChange={handleActiveRadioChange}
        />
      </div>
    </div>
  );
};
export default ItemDetails;
