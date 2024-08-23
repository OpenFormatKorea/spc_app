import React, { useState, useEffect, KeyboardEvent } from "react";
import InputTextBox from "@/components/base/InputText";
import { RewardArgs, RewardType } from "@/pages/item/lib/types";
import InputRadioBox from "@/components/base/InputRadio";
import RewardCard from "@/components/layout/item/RewardCardComponent";
import Modal from "@/components/base/modal";

interface NewRewardComponentProps {
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const NewRewardComponent: React.FC<NewRewardComponentProps> = ({ handleKeyDown }) => {
  const inputformClass = "inputformClass flex flex-col text-left w-full mb-2";
  const labelClass = "labelClass text-sm font-bold mt-4";
  const [rewardType, setRewardType] = useState<RewardType>(RewardType.CO);
  const [referralTitle, setReferralTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRewardTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRewardType(e.target.value as RewardType);
  };

  return (
    <>
      <div className={inputformClass}>
        <label className={labelClass}>리워드</label>
        <div className="flex justify-between w-[250px] lg:w-[300px] ">
          <InputRadioBox
            label="쿠폰"
            name="reward_type"
            value={RewardType.CO}
            checked={rewardType === RewardType.CO}
            onChange={handleRewardTypeRadioChange}
          />
          <InputRadioBox
            label="포인트"
            name="reward_type"
            value={RewardType.PO}
            checked={rewardType === RewardType.PO}
            onChange={handleRewardTypeRadioChange}
          />
          <button className="bg-blue-500 text-white px-2 py-1 rounded-lg w-fit" onClick={openModal}>
            추가
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <RewardCard reward_type={rewardType} handleKeyDown={handleKeyDown}></RewardCard>
      </Modal>
    </>
  );
};

export default NewRewardComponent;
