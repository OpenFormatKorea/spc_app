import DatePicker from "@/components/base/DatePicker";
import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";
import CampaignActiveButton from "@/components/layout/campaign/CampaignActiveButton";
import { CampaignArgs, PeriodType } from "@/lib/campaign/types";
import React, { useRef, KeyboardEvent, useState, useEffect } from "react";

interface CampaignDetailsProps {
  page_type: "NEW" | "DETAILS";
  campaignArgs: CampaignArgs;
  period_type: PeriodType;
  setPeriod_type: (value: PeriodType) => void;
  setDescription: (value: string) => void;
  setActive: (value: boolean) => void;
  setTitle: (value: string) => void;
  setStart_date: (value: string) => void;
  setEnd_date: (value: string | null) => void;
  campaign_id?: string;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  page_type,
  campaignArgs,
  campaign_id,
  period_type,
  setPeriod_type,
  setDescription,
  setActive,
  setTitle,
  setStart_date,
  setEnd_date,
}) => {
  const [activeStatus, setActiveStatus] = useState<boolean>(campaignArgs.active);
  const [endDateActiveStatus, setEndDateActiveStatus] = useState<boolean>(period_type !== PeriodType.UL);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (period_type === PeriodType.UL) {
      setEnd_date(null);
      setEndDateActiveStatus(true);
    } else {
      setEnd_date(campaignArgs.end_date || null);
      setEndDateActiveStatus(false);
    }
  }, [period_type, campaignArgs.end_date, setEnd_date]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => setPeriod_type(e.target.value as PeriodType);

  const handleActiveRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => setActive(e.target.value === "true");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  const toggleCampaignActiveStatus = (_: string, newStatus: boolean) => setActiveStatus(newStatus);

  return (
    <div className="w-full pb-2 mb-2">
      <div className="flex w-full pb-2 border-b-[1px] mb-2 items-center">
        <div className="w-full">
          <div className="font-normal text-sm text-gray-500">상세 정보 옵션</div>
        </div>
        {page_type === "DETAILS" && (
          <div>
            <CampaignActiveButton
              view="PC"
              campaign={{ ...campaignArgs, id: Number(campaign_id) }}
              activeStatus={activeStatus}
              toggleCampaignActiveStatus={toggleCampaignActiveStatus}
            />
          </div>
        )}
      </div>
      <div className="inputForm flex flex-col text-left w-full pb-2">
        <label className="text-xs pt-2 text-gray-500">캠페인 명</label>
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

      <div className="inputForm flex flex-col text-left w-full pb-2">
        <label className="text-xs pt-4 text-gray-500">캠페인 설명</label>
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
        <label className="text-xs pt-4 pb-2 text-gray-500">기간 종류</label>
        <div className="flex justify-between w-full md:w-[300px] lg:w-[300px]">
          <InputRadioBox
            label="기간 제한"
            name="period_type"
            value={PeriodType.L}
            checked={period_type === PeriodType.L}
            onChange={handleRadioChange}
            disabled={false}
          />
          <InputRadioBox
            label="무기한"
            name="period_type"
            value={PeriodType.UL}
            checked={campaignArgs.period_type === PeriodType.UL}
            onChange={handleRadioChange}
            disabled={false}
          />
        </div>
      </div>

      {/* <div className="inputForm flex flex-col text-left w-full pb-2">
        <label className="text-xs pt-4 text-gray-500">캠페인 기간</label>
        <div className="lg:flex sm:items-center w-full gap-2">
          <InputTextBox
            type="text"
            id="start_date"
            placeholder="캠페인 시작일을 선택하세요."
            value={campaignArgs.start_date}
            onChange={(e) => setStart_date(e.target.value)}
            disabled={false}
          />
          <div className="text-md sm:my-2 sm:w-full lg:w-[25px] sm:text-center flex justify-center">~</div>
          <InputTextBox
            type="text"
            id="end_date"
            placeholder={
              period_type === PeriodType.L ? "캠페인 종료일을 선택하세요." : "무기한일 경우 시작일만 선택 가능합니다."
            }
            value={period_type === PeriodType.L ? campaignArgs.end_date : ""}
            onChange={(e) => setEnd_date(e.target.value)}
            disabled={endDateActiveStatus}
          />
        </div>
      </div> */}
      <div className="inputForm flex flex-col text-left w-[50%] pb-2">
        <label className="text-xs pt-4 text-gray-500">캠페인 기간</label>
        <div className="sm:items-center w-full gap-2">
          <DatePicker label="캠페인 시작일" value={campaignArgs.start_date} onChange={setStart_date} disabled={false} />
          {period_type === PeriodType.L && (
            <DatePicker
              label="캠페인 종료일"
              value={period_type === PeriodType.L ? campaignArgs.end_date : null}
              onChange={setEnd_date}
              disabled={endDateActiveStatus}
            />
          )}
        </div>
      </div>

      {page_type === "NEW" && (
        <div className="inputForm flex flex-col text-left w-full pb-2">
          <label className="text-xs pt-4 pb-2 text-gray-500">캠페인 활성화</label>
          <div className="flex justify-between w-[250px] lg:w-[300px]">
            <InputRadioBox
              label="활성화"
              name="active"
              value="true"
              checked={campaignArgs.active}
              onChange={handleActiveRadioChange}
              disabled={false}
            />
            <InputRadioBox
              label="비활성화"
              name="active"
              value="false"
              checked={!campaignArgs.active}
              onChange={handleActiveRadioChange}
              disabled={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
