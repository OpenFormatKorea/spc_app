import React, { useState, useEffect, KeyboardEvent } from "react";
import InputTextBox from "@/components/base/InputText";
import { PaymentFrequencyType, PaymentTimingType, RewardArgs, RewardType, TriggerType } from "@/pages/item/lib/types";
import NewRewardComponent from "@/components/layout/item/NewRewardComponent";
import InputRadioBox from "@/components/base/InputRadio";

interface RewardCardProps {
  reward_type: RewardType;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}
const RewardCard: React.FC<RewardCardProps> = ({ reward_type, handleKeyDown }) => {
  const inputformClass = "inputformClass flex flex-col text-left w-full mb-2";
  const labelClass = "labelClass font-gray-600 text-sm font-bold mt-4 text-left w-full";
  const [reward, setReward] = useState("");
  const [triggerType, setTriggerType] = useState<TriggerType>(TriggerType.SU);
  const [paymentTiming, setPaymentTiming] = useState<PaymentTimingType>(PaymentTimingType.IMM);
  const [payment_frequency, setPaymentFrequency] = useState<PaymentFrequencyType>(PaymentFrequencyType.ONCE);
  // const handleRewardTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setRewardType(e.target.value as RewardType);
  // };
  const handleTriggerRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTriggerType(e.target.value as TriggerType);
  };
  const handlePaymentTimingRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentTiming(e.target.value as PaymentTimingType);
  };
  const onclickAddReferralConditions = () => {
    console.log("DONE");
  };

  return (
    <>
      <div className="items-center justify-center text-center">
        <h1 className="w-full text-left text-2xl font-bold">
          {reward_type === RewardType.CO ? "쿠폰" : "포인트"} 추가 설정
        </h1>
        <div className="flex-col max-h-[500px] overflow-y-scroll pt-4">
          <div className=" rounded-lg border p-3">
            <div className={inputformClass}>
              <label className="font-gray-600 text-lg font-bold mt-2 text-left w-full">추천인</label>
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰 코드" : "지급 포인트 금액"}</label>
              <InputTextBox
                type="text"
                id={reward_type === RewardType.CO ? "coupon_code" : "point_amount"}
                placeholder={
                  reward_type === RewardType.CO ? "쿠폰 코드를 입력하세요." : "원하시는 지급 포인트 금액을 입력하세요."
                }
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 조건</label>
              <div className="flex justify-between w-full mt-2 ">
                <InputRadioBox
                  label="회원가입"
                  name="trigger"
                  value={TriggerType.SU}
                  checked={triggerType === TriggerType.SU}
                  onChange={handleTriggerRadioChange}
                />
                <InputRadioBox
                  label="상품구매"
                  name="trigger"
                  value={TriggerType.PUR}
                  checked={triggerType === TriggerType.PUR}
                  onChange={handleTriggerRadioChange}
                />
                <div />
              </div>
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 시점</label>
              <div className="flex justify-between w-full mt-2 ">
                <InputRadioBox
                  label="즉시 지급"
                  name="payment_timing"
                  value={PaymentTimingType.IMM}
                  checked={paymentTiming === PaymentTimingType.IMM}
                  onChange={handleTriggerRadioChange}
                />
                <InputRadioBox
                  label="추후 지급"
                  name="payment_timing"
                  value={PaymentTimingType.DEL}
                  checked={paymentTiming === PaymentTimingType.DEL}
                  onChange={handlePaymentTimingRadioChange}
                />
                <div />
              </div>
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 시점</label>
              <div className="flex justify-between w-full mt-2 ">
                <InputRadioBox
                  label="한번만"
                  name="payment_frequency"
                  value={PaymentFrequencyType.ONCE}
                  checked={payment_frequency === PaymentFrequencyType.ONCE}
                  onChange={handleTriggerRadioChange}
                />
                <InputRadioBox
                  label="반복"
                  name="payment_frequency"
                  value={PaymentFrequencyType.REP}
                  checked={payment_frequency === PaymentFrequencyType.REP}
                  onChange={handlePaymentTimingRadioChange}
                />
                <InputRadioBox
                  label="무제한"
                  name="payment_frequency"
                  value={PaymentFrequencyType.UNL}
                  checked={payment_frequency === PaymentFrequencyType.UNL}
                  onChange={handlePaymentTimingRadioChange}
                />
              </div>
            </div>
          </div>
          <div className=" rounded-lg border p-3 mt-4">
            <div className={inputformClass}>
              <label className="font-gray-600 text-lg font-bold mt-2 text-left w-full">피추천인</label>
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰 코드" : "지급 포인트 금액"}</label>
              <InputTextBox
                type="text"
                id={reward_type === RewardType.CO ? "coupon_code" : "point_amount"}
                placeholder={
                  reward_type === RewardType.CO ? "쿠폰 코드를 입력하세요." : "원하시는 지급 포인트 금액을 입력하세요."
                }
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 조건</label>
              <div className="flex justify-between w-full mt-2 ">
                <InputRadioBox
                  label="회원가입"
                  name="trigger"
                  value={TriggerType.SU}
                  checked={triggerType === TriggerType.SU}
                  onChange={handleTriggerRadioChange}
                />
                <InputRadioBox
                  label="상품구매"
                  name="trigger"
                  value={TriggerType.PUR}
                  checked={triggerType === TriggerType.PUR}
                  onChange={handleTriggerRadioChange}
                />
                <div />
              </div>
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 시점</label>
              <div className="flex justify-between w-full mt-2 ">
                <InputRadioBox
                  label="즉시 지급"
                  name="payment_timing"
                  value={PaymentTimingType.IMM}
                  checked={paymentTiming === PaymentTimingType.IMM}
                  onChange={handleTriggerRadioChange}
                />
                <InputRadioBox
                  label="추후 지급"
                  name="payment_timing"
                  value={PaymentTimingType.DEL}
                  checked={paymentTiming === PaymentTimingType.DEL}
                  onChange={handlePaymentTimingRadioChange}
                />
                <div />
              </div>
            </div>
            <div className={inputformClass}>
              <label className={labelClass}>{reward_type === RewardType.CO ? "쿠폰" : "포인트"} 지급 시점</label>
              <div className="flex justify-between w-full mt-2 ">
                <InputRadioBox
                  label="한번만"
                  name="payment_frequency"
                  value={PaymentFrequencyType.ONCE}
                  checked={payment_frequency === PaymentFrequencyType.ONCE}
                  onChange={handleTriggerRadioChange}
                />
                <InputRadioBox
                  label="반복"
                  name="payment_frequency"
                  value={PaymentFrequencyType.REP}
                  checked={payment_frequency === PaymentFrequencyType.REP}
                  onChange={handlePaymentTimingRadioChange}
                />
                <InputRadioBox
                  label="무제한"
                  name="payment_frequency"
                  value={PaymentFrequencyType.UNL}
                  checked={payment_frequency === PaymentFrequencyType.UNL}
                  onChange={handlePaymentTimingRadioChange}
                />
              </div>
            </div>
          </div>
        </div>
        <button className="bg-blue-500 text-white rounded-lg p-2 w-full mt-4 " onClick={onclickAddReferralConditions}>
          추가
        </button>
      </div>
    </>
  );
};

export default RewardCard;
