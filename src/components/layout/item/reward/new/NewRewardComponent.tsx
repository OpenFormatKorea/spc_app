import React, { useState, KeyboardEvent, useEffect } from "react";
import { CouponsArgs, RewardsArgs, RewardType } from "@/lib/item/types";
import InputRadioBox from "@/components/base/InputRadio";
import { ApiResponse } from "@/lib/types";
import InputNumberTextBox from "@/components/base/InputNumberText";
import NewRewardModal from "@/components/layout/item/reward/new/NewRewardModal";
import CouponList from "@/components/layout/item/modal/CouponList";
import {
  inputFormClass,
  labelClass,
  radioButtonLabelClass,
} from "@/interfaces/tailwindCss";

interface NewRewardComponentProps {
  apiResponse: ApiResponse;
  page: number;
  page_size: number;
  newCouponList: CouponsArgs[];
  setNewCouponList: (value: CouponsArgs[]) => void;
  reward_type: RewardType;
  setRewardType: (value: RewardType) => void;
  setRewards: React.Dispatch<React.SetStateAction<RewardsArgs[]>>;
  disableInput: boolean;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const NewRewardComponent: React.FC<NewRewardComponentProps> = ({
  apiResponse,
  page,
  page_size,
  newCouponList,
  setNewCouponList,
  reward_type,
  setRewards,
  setRewardType,
  disableInput,
  handleKeyDown,
}) => {
  const [point_amount, setPointAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [currentCouponList, setCurrentCouponList] = useState<CouponsArgs[]>([]); // 가장 마지막 업데이트 - > 이거 이후로 final로 데이터 넘어감
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

  useEffect(() => {
    if (reward_type === RewardType.CO) {
      setPointAmount("");
    } else if (reward_type === RewardType.PO) {
      setCurrentCouponList([]);
    }
  }, [reward_type]);

  useEffect(() => {
    if (!Array.isArray(newCouponList)) return;
    setCurrentCouponList(newCouponList);
  }, [newCouponList]);
  return (
    <>
      <h1 className="border-b-[1px] pb-[5px] text-[18px] font-bold">리워드</h1>
      <div className={inputFormClass}>
        <label className={radioButtonLabelClass}>리워드 종류</label>
        <div className="flex h-[42px] w-full items-center justify-between">
          <div className="flex w-full gap-[10px] text-left">
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
              className={
                "min-w-[45px] cursor-pointer rounded-lg border bg-blue-500 p-1 text-center text-white"
              }
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
                <div className="mt-2 flex h-fit w-full flex-wrap justify-center break-words rounded-lg bg-gray-100 p-2 pb-3 text-[14px]">
                  {newCouponList.length !== 0 ? (
                    newCouponList.map((newCoupon) => {
                      return (
                        newCoupon && (
                          <div
                            key={newCoupon.coupon_code}
                            className="mr-1 mt-1 h-fit w-fit rounded-md bg-blue-300 p-1 text-[14px] text-white"
                          >
                            {newCoupon.coupon_code} - {newCoupon.coupon_name}
                          </div>
                        )
                      );
                    })
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
          {(newCouponList.length !== 0 || point_amount !== "") && (
            <button
              id="create_item_container"
              className={`w-full border p-2 ${
                newCouponList.length === 0 && point_amount === ""
                  ? "cursor-not-allowed bg-gray-400"
                  : "cursor-pointer bg-blue-500"
              } min-w-[45px] items-center justify-center rounded-lg text-center text-white`}
              onClick={openRewardModal}
              disabled={newCouponList.length === 0 && point_amount === ""}
            >
              리워드 추가
            </button>
          )}
        </div>
      </div>
      <CouponList
        apiResponse={apiResponse}
        newCouponList={newCouponList}
        setNewCouponList={setNewCouponList}
        currentCouponList={currentCouponList}
        onClose={closeModal}
        isOpen={isModalOpen}
        page={page}
        page_size={page_size}
      />
      {disableInput === false && (
        <>
          <NewRewardModal
            reward_type={reward_type}
            handleKeyDown={handleKeyDown}
            newCouponList={newCouponList}
            setNewCouponList={setNewCouponList}
            setRewards={setRewards}
            point_amount={point_amount}
            setPointAmount={setPointAmount}
            isOpen={isRewardModalOpen}
            onClose={closeRewardModal}
          />
        </>
      )}
    </>
  );
};

export default NewRewardComponent;
