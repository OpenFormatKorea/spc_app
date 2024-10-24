import React, { useState, KeyboardEvent } from "react";
import { CouponsArgs, RewardsArgs, RewardType } from "@/lib/item/types";
import InputRadioBox from "@/components/base/InputRadio";
import { ApiResponse } from "@/lib/types";
import InputNumberTextBox from "@/components/base/InputNumberText";
import RewardModalDetails from "@/components/layout/item/reward/details/RewardModalDetails";
import RewardCurrentCardDetails from "@/components/layout/item/reward/details/RewardCurrentCardDetails";
import CouponListDetails from "@/components/layout/item/modal/details/CouponListDetails";

interface RewardComponentDetailsProps {
  apiResponse?: ApiResponse;
  selectedCouponItems: CouponsArgs[];
  setSelectedCouponItems: (value: CouponsArgs[]) => void;
  couponInputs: CouponsArgs[];
  setCouponInputs: (value: CouponsArgs[]) => void;
  reward_type: RewardType;
  setRewardType: (value: RewardType) => void;
  disableInput: boolean;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  rewards: RewardsArgs[];
  selectedRewards: RewardsArgs[];
  setSelectedRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
  newAddedRewards: RewardsArgs[];
  setNewAddedRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
}

const RewardComponentDetails: React.FC<RewardComponentDetailsProps> = ({
  apiResponse,
  setSelectedCouponItems,
  selectedCouponItems,
  couponInputs,
  setCouponInputs,
  reward_type,
  setRewardType,
  handleKeyDown,
  rewards,
  selectedRewards,
  setSelectedRewards,
  newAddedRewards,
  setNewAddedRewards,
}) => {
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-2";
  const radioButtonLabelClass = "text-xs pt-4 pb-2 text-gray-500";
  const labelClass = "text-xs pt-4 text-gray-500";
  const [point_amount, setPointAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  const handleRewardTypeRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRewardType(e.target.value as RewardType);
  };

  const closeModal = () => setIsModalOpen(false);
  const openModal = () =>
    reward_type ? setIsModalOpen(true) : alert("리워드 종류를 선택해주세요.");
  const openRewardModal = () => setIsRewardModalOpen(true);
  const closeRewardModal = () => setIsRewardModalOpen(false);

  return (
    <>
      <h1 className="pb-2 text-xl font-bold">리워드</h1>
      <span className="border-b-[1px] pb-2 text-xs text-gray-500">
        * 이전에 세팅된 리워드의 경우, 수정시 체크박스로 선택한 리워드만
        저장됩니다.
      </span>

      <div className={inputFormClass}>
        <RewardCurrentCardDetails
          rewards={rewards}
          selectedRewards={selectedRewards}
          setSelectedRewards={setSelectedRewards}
        />
        <label className={radioButtonLabelClass}>리워드 종류</label>
        <div className="flex h-[42px] w-full items-center">
          <div className="flex w-full space-x-20 text-left lg:max-w-[458px]">
            <InputRadioBox
              label="쿠폰"
              name="reward_type"
              value={RewardType.CO}
              checked={reward_type === RewardType.CO}
              onChange={handleRewardTypeRadioChange}
              disabled={false}
            />
            <InputRadioBox
              label="포인트"
              name="reward_type"
              value={RewardType.PO}
              checked={reward_type === RewardType.PO}
              onChange={handleRewardTypeRadioChange}
              disabled={false}
            />
          </div>
          {reward_type === RewardType.CO && (
            <button
              id="create_item_container"
              className="min-w-[45px] cursor-pointer rounded-lg border bg-blue-500 p-1 text-center text-white"
              onClick={openModal}
            >
              추가
            </button>
          )}
        </div>

        <div className="contents-container w-full justify-between pb-4">
          {reward_type === RewardType.CO && (
            <div className="flex h-fit w-full flex-col">
              <div className="mb-2 flex w-full flex-col text-left">
                <label className={labelClass}>선택된 쿠폰</label>
                <div className="mt-2 flex h-fit w-full flex-wrap justify-center break-words rounded-xl bg-gray-100 p-2 pb-3 text-sm">
                  {selectedCouponItems.length !== 0 ? (
                    couponInputs.map((inputCoupon) => (
                      <div
                        key={inputCoupon.coupon_code}
                        className="mr-1 mt-1 h-fit w-fit rounded-md bg-blue-300 p-1 text-sm text-white"
                      >
                        {inputCoupon.coupon_name}
                      </div>
                    ))
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center text-gray-600">
                        선택된 쿠폰이 없습니다.
                        <br />
                        상품을 선택해주세요.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {reward_type === RewardType.PO && (
            <div className="flex h-fit w-full flex-col">
              <div className={inputFormClass}>
                <label className={labelClass}>포인트</label>
                <InputNumberTextBox
                  type="text"
                  id="point_amount"
                  placeholder="포인트를 입력해 주세요."
                  value={point_amount}
                  onChange={(e) => setPointAmount(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={false}
                />
              </div>
            </div>
          )}

          <button
            id="create_item_container"
            className={`my-2 flex w-full border p-2 ${
              couponInputs.length === 0 && point_amount === ""
                ? "cursor-not-allowed bg-gray-400"
                : "cursor-pointer bg-blue-500"
            } min-w-[45px] items-center justify-center rounded-lg text-center text-white`}
            onClick={openRewardModal}
            disabled={couponInputs.length === 0 && point_amount === ""}
          >
            리워드 추가
          </button>
        </div>
      </div>

      <CouponListDetails
        apiResponse={apiResponse}
        setSelectedCouponItems={setSelectedCouponItems}
        setCouponInputs={setCouponInputs}
        couponInputs={couponInputs}
        onClose={closeModal}
        isOpen={isModalOpen}
        rewards={rewards}
      />

      <RewardModalDetails
        reward_type={reward_type}
        handleKeyDown={handleKeyDown}
        setRewards={setSelectedRewards}
        point_amount={point_amount}
        couponInputs={couponInputs}
        setPointAmount={setPointAmount}
        isOpen={isRewardModalOpen}
        onClose={closeRewardModal}
        newAddedRewards={newAddedRewards}
        setNewAddedRewards={setNewAddedRewards}
      />
    </>
  );
};

export default RewardComponentDetails;
