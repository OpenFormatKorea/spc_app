import React, { useState, KeyboardEvent, useEffect } from "react";
import { RewardsArgs, RewardType } from "@/pages/item/lib/types";
import InputRadioBox from "@/components/base/InputRadio";
import Modal from "@/components/base/Modal";
import RewardModal from "@/components/layout/item/RewardModal";

interface RewardComponentProps {
  page_type: "DETAILS" | "NEW";

  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  reward_type: RewardType;
  setRewardType: (value: RewardType) => void;
}

const RewardComponent: React.FC<RewardComponentProps> = ({ page_type, handleKeyDown, reward_type, setRewardType }) => {
  const [rewards, setRewards] = useState<RewardsArgs[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disableInput, setDisableInput] = useState(false);

  const inputformClass = "flex flex-col text-left w-full lg:max-w-[350px] min-w-[300px] mb-4";
  const labelClass = "font-gray-600 text-sm font-bold text-left w-full mt-4";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRewardTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRewardType(e.target.value as RewardType);
  };
  useEffect(() => {
    if (page_type === "DETAILS") {
      setDisableInput(true);
    } else {
      setDisableInput(false);
    }
  }, [page_type]);
  return (
    <>
      <h1 className="font-bold text-xl pb-2 border-b-[1px]">리워드 옵션</h1>
      <div className={inputformClass}>
        <label className={labelClass}>리워드 종류</label>
        <div className="flex space-x-20 text-left w-full">
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
            className={`${
              disableInput ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 cursor-pointer"
            } text-white px-2 py-1 rounded-lg w-fit`}
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
