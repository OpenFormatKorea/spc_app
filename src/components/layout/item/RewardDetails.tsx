import InputRadioBox from "@/components/base/InputRadio";
import InputSelectBox from "@/components/base/InputSelectBox";
import InputTextBox from "@/components/base/InputText";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import ItemDetails from "@/components/layout/item/ItemDetails";
import { ItemArgs, ItemType, RewardType } from "@/pages/item/lib/types";
import { useRef, KeyboardEvent } from "react";
import Calendar from "react-calendar";
interface ItemDetailsProps {
  itemArgs: ItemArgs;
  setItem_type: (value: ItemType) => void;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setReward_type: (value: RewardType) => void;
  setCampaign_id: (value: string) => void;
  setActive: (value: boolean) => void;
}

const RewardDetails: React.FC<ItemDetailsProps> = ({
  itemArgs,
  setItem_type,
  setTitle,
  setDescription,
  setReward_type,
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
    <>
      <div className="contents-container w-[50%] justify-center items-center">
        <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
          <a className="w-[100px] text-md font-bold">아이템 명: </a>
        </div>
        <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
          <a className="w-[100px] text-md font-bold">리퍼럴 종류: </a>
        </div>
        여기는 리퍼럴 종류 따라 프로덕트 / 프로모션 내용 넣도록
        <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
          <a className="w-[100px] text-md font-bold">리퍼럴 종류: </a>
        </div>
        <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
          <a className="w-[100px] text-md font-bold">리퍼럴 종류: </a>
        </div>
        <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
          <a className="w-[100px] text-md font-bold">리퍼럴 종류: </a>
        </div>
        <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
          <a className="w-[100px] text-md font-bold">리퍼럴 종류: </a>
        </div>
      </div>
    </>
  );
};
export default RewardDetails;
