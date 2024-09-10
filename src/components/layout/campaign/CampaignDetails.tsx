import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";
import CampaignActiveButton from "@/components/layout/campaign/CampaignActiveButton";
import { CampaignArgs, PeriodType } from "@/lib/campaign/types";
import React, { useRef, KeyboardEvent, useState, useEffect } from "react";

interface CampaignDetailsProps {
  page_type: "NEW" | "DETAILS";
  campaignArgs: CampaignArgs;
  setPeriod_type: (value: PeriodType) => void;
  setDescription: (value: string) => void;
  setActive: (value: boolean) => void;
  setTitle: (value: string) => void;
  setStart_date: (value: string) => void;
  setEnd_date: (value: any) => void;
  campaign_id?: string;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  page_type,
  campaignArgs,
  campaign_id,
  setPeriod_type,
  setDescription,
  setActive,
  setTitle,
  setStart_date,
  setEnd_date,
}) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriod_type(e.target.value as PeriodType);
  };

  const handleActiveRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActive(e.target.value === "true");
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
    <div className="contents-container w-full justify-center">
      <h1 className="font-bold text-base pb-2 border-b mb-4 w-full flex justify-between items-center">
        <div>
          <div className="text-xl">캠페인 상세정보</div>
          <div className="font-normal text-sm text-gray-500 pt-2">상세 정보 옵션</div>
        </div>
        {page_type === "DETAILS" ? (
          <div>
            <CampaignActiveButton
              campaign={{
                id: Number(campaign_id),
                title: campaignArgs.title,
                description: campaignArgs.description,
                period_type: campaignArgs.period_type,
                start_date: campaignArgs.start_date,
                end_date: campaignArgs.end_date,
                active: campaignArgs.active,
              }}
            />
          </div>
        ) : (
          <></>
        )}
      </h1>

      <div className="inputForm flex flex-col text-left w-full pb-2">
        <label className="text-md font-bold pb-2">캠페인 명</label>
        <InputTextBox
          type="text"
          id="title"
          placeholder="캠페인 명을 입력하세요."
          value={campaignArgs.title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={false}
        />
      </div>
      <div className="inputForm flex flex-col text-left w-full">
        <label className="text-md font-bold py-2">캠페인 설명</label>
        <InputTextBox
          type="text"
          id="description"
          placeholder="캠페인 설명을 입력하세요."
          value={campaignArgs.description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={false}
        />
      </div>
      <div className="inputForm flex flex-col text-left w-full pb-2">
        <label className="text-md font-bold py-2">기간 종류</label>
        <div className="flex justify-between w-[250px] lg:w-[300px]">
          <InputRadioBox
            label="무기한"
            name="period_type"
            value={PeriodType.UL}
            checked={campaignArgs.period_type === PeriodType.UL}
            onChange={handleRadioChange}
            disabled={false}
          />
          <InputRadioBox
            label="기간 제한"
            name="period_type"
            value="LIMITED"
            checked={campaignArgs.period_type === PeriodType.L}
            onChange={handleRadioChange}
            disabled={false}
          />
        </div>
      </div>
      <div className="flex flex-col w-full text-left">
        <label className="text-md font-bold py-2">캠페인 기간</label>
        <div className="lg:flex sm:items-center w-full gap-2">
          <InputTextBox
            type="text"
            id="start_date"
            placeholder="캠페인 시작일을 선택하세요."
            value={campaignArgs.start_date}
            onChange={(e) => setStart_date(e.target.value)}
            disabled={false}
          />

          <div className="text-md sm:my-2 sm:w-full lg:w-[25px] sm:text-center sm:flex sm:items-center sm:justify-center">
            ~
          </div>
          <InputTextBox
            type="text"
            id="end_date"
            placeholder="캠페인 시작일을 선택하세요."
            value={campaignArgs.end_date}
            onChange={(e) => setEnd_date(e.target.value)}
            disabled={false}
          />
        </div>
      </div>
      {page_type === "NEW" ? (
        <>
          <div className="inputForm flex flex-col text-left w-full">
            <label className="text-md font-bold py-4">캠페인 활성화</label>
            <div className="flex justify-between w-[250px] lg:w-[300px] ">
              <InputRadioBox
                label="활성화"
                name="active"
                value="true"
                checked={campaignArgs.active === true}
                onChange={handleActiveRadioChange}
                disabled={false}
              />
              <InputRadioBox
                label="비활성화"
                name="active"
                value="false"
                checked={campaignArgs.active === false}
                onChange={handleActiveRadioChange}
                disabled={false}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CampaignDetails;
