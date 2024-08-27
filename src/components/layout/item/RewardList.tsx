import React, { useState, KeyboardEvent } from "react";
import { RewardsArgs, RewardType } from "@/pages/item/lib/types";
import InputRadioBox from "@/components/base/InputRadio";
import Modal from "@/components/base/Modal";
import RewardCard from "@/components/layout/item/RewardCondition";

interface RewardComponentProps {
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  reward_type: RewardType;
  setRewardType: (value: RewardType) => void;
}

const RewardComponent: React.FC<RewardComponentProps> = ({ handleKeyDown, reward_type, setRewardType }) => {
  const [rewards, setRewards] = useState<RewardsArgs[]>([]);

  // 인풋 클래스 관련
  const inputformClass = "flex flex-col text-left w-full lg:max-w-[350px] min-w-[300px] mb-4";
  const labelClass = "font-gray-600 text-sm font-bold text-left w-full mt-4";
  // 모달 오픈 관련
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  // 리워드 타입 라디오버튼
  const handleRewardTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRewardType(e.target.value as RewardType);
  };

  return (
    <>
      <h1 className="font-bold text-xl pb-2 border-b-[1px]">리워드 옵션</h1>
      <div className={inputformClass}>
        <label className={labelClass}>리워드 종류</label>
        <div className="flex space-x-20 text-left w-full lg:max-w-[458px]">
          <InputRadioBox
            label="쿠폰"
            name="reward_type"
            value={RewardType.CO}
            checked={reward_type === RewardType.CO}
            onChange={handleRewardTypeRadioChange}
          />
          <InputRadioBox
            label="포인트"
            name="reward_type"
            value={RewardType.PO}
            checked={reward_type === RewardType.PO}
            onChange={handleRewardTypeRadioChange}
          />

          <button className="bg-blue-500 text-white px-2 py-1 rounded- lg w-fit" onClick={openModal}>
            추가
          </button>
        </div>
        <div></div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <RewardCard
          reward_type={reward_type}
          handleKeyDown={handleKeyDown}
          isOpen={isModalOpen}
          onClose={closeModal}
          setRewards={setRewards}
        />
      </Modal>
    </>
  );
};

export default RewardComponent;
