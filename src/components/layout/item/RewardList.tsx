import React, { useState, KeyboardEvent, useEffect } from "react";
import { RewardsArgs, RewardType } from "@/lib/item/types";
import InputRadioBox from "@/components/base/InputRadio";
import RewardModal from "@/components/layout/item/RewardModal";
import Modal from "@/components/layout/base/Modal";

interface RewardComponentProps {
  disableInput: boolean;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  reward_type: RewardType;
  setRewardType: (value: RewardType) => void;
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}

const RewardComponent: React.FC<RewardComponentProps> = ({
  disableInput,
  handleKeyDown,
  reward_type,
  setRewardType,
  setRewards,
}) => {
  const inputformClass = "inputForm flex flex-col text-left w-full pb-6";
  const radioButtonLabelClass = "text-xs pt-4 pb-2 text-gray-500";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    if (reward_type) {
      // Check if reward_type is not an empty string
      setIsModalOpen(true);
    } else {
      alert("리워드 종류를 선택해주세요.");
    }
  };
  const closeModal = () => setIsModalOpen(false);
  const handleRewardTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRewardType(e.target.value as RewardType);
  };
  return (
    <>
      <h1 className="font-bold text-xl pb-2 border-b-[1px]">리워드</h1>
      <div className={inputformClass}>
        <label className={radioButtonLabelClass}>리워드 종류</label>
        <div className="flex justify-between w-full lg:max-w-[350px] ">
          <InputRadioBox
            label="쿠폰"
            name="reward_type"
            value={RewardType.CO}
            checked={reward_type === RewardType.CO}
            onChange={handleRewardTypeRadioChange}
            disabled={disableInput}
          />
          <InputRadioBox
            label="포인트"
            name="reward_type"
            value={RewardType.PO}
            checked={reward_type === RewardType.PO}
            onChange={handleRewardTypeRadioChange}
            disabled={disableInput}
          />
          <button
            className={`text-white px-2 py-1 rounded-lg w-fit ${
              disableInput ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
            }`}
            disabled={disableInput}
            onClick={openModal}
          >
            추가
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <RewardModal
          reward_type={reward_type}
          handleKeyDown={handleKeyDown}
          onClose={closeModal}
          setRewards={setRewards}
        />
      </Modal>
    </>
  );
};

export default RewardComponent;
