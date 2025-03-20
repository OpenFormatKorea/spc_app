import DatePicker from "@/components/base/DatePicker";
import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";
import CampaignActiveButton from "@/components/layout/campaign/CampaignActiveButton";
import { CampaignArgs, PeriodType } from "@/lib/campaign/types";
import React, { useRef, KeyboardEvent, useState, useEffect } from "react";

interface CampaignNewProps {
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

const CampaignNew: React.FC<CampaignNewProps> = ({
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
  const [activeStatus, setActiveStatus] = useState<boolean>(
    campaignArgs.active,
  );
  const [endDateActiveStatus, setEndDateActiveStatus] = useState<boolean>(
    period_type !== PeriodType.UL,
  );
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

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPeriod_type(e.target.value as PeriodType);
  const handleActiveRadioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActive(e.target.value === "true");
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  const toggleCampaignActiveStatus = (campaignId: string, newStatus: boolean) =>
    setActiveStatus(newStatus);

  return (
    <>
      <div className="w-full pb-[5px]">
        <div className="mb-2 flex w-full items-center border-b-[1px] pb-[5px]">
          <div className="flex w-full items-center gap-4">
            <div className="text-[16px] font-bold text-black">
              {page_type === "DETAILS"
                ? "캠페인 상세 정보"
                : "캠페인 옵션 추가"}
            </div>
          </div>

          {page_type === "DETAILS" && (
            <div>
              <CampaignActiveButton
                view="PC"
                campaign={{ ...campaignArgs, id: campaign_id }}
                activeStatus={activeStatus}
                toggleCampaignActiveStatus={toggleCampaignActiveStatus}
              />
            </div>
          )}
        </div>
        <div className="inputForm flex w-full flex-col pb-[5px] text-left">
          <label className="pt-[5px] text-[12px] text-gray-500">
            캠페인 명
          </label>
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

        <div className="inputForm flex w-full flex-col pb-[5px] text-left">
          <label className="pt-[10px] text-[12px] text-gray-500">
            캠페인 설명
          </label>
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

        <div className="inputForm flex w-full flex-col pb-[5px] text-left">
          <label className="py-[5px] text-[12px] text-gray-500">
            기간 종류
          </label>
          <div className="flex w-full justify-between md:w-[300px] lg:w-[300px]">
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
        <div className="inputForm flex w-full flex-col pb-[5px] text-left">
          <label className="pt-[10px] text-[12px] text-gray-500">
            캠페인 기간
          </label>
          <div className="flex w-full flex-wrap items-center justify-center gap-2">
            <DatePicker
              label="캠페인 시작일"
              value={campaignArgs.start_date}
              onChange={setStart_date}
              disabled={false}
            />
            {period_type === PeriodType.L && (
              <DatePicker
                label="캠페인 종료일"
                value={
                  period_type === PeriodType.L ? campaignArgs.end_date : null
                }
                onChange={setEnd_date}
                disabled={endDateActiveStatus}
              />
            )}
          </div>
        </div>

        {page_type === "NEW" && (
          <div className="inputForm flex w-full flex-col text-left">
            <label className="pb-[5px] pt-[10px] text-[12px] text-gray-500">
              캠페인 활성화
            </label>
            <div className="flex w-[250px] justify-between lg:w-[300px]">
              <InputRadioBox
                label="활성화"
                name="active"
                value="true"
                checked={campaignArgs.active}
                onChange={handleActiveRadioChange}
                disabled={true}
              />
              <InputRadioBox
                label="비활성화"
                name="active"
                value="false"
                checked={!campaignArgs.active}
                onChange={handleActiveRadioChange}
                disabled={true}
              />
            </div>
            <label className="pt-[5px] text-[12px] text-gray-400">
              - 캠페인 생성 시에는 기본값이 비활성화로 지정됩니다.
            </label>
          </div>
        )}
      </div>
    </>
  );
};

export default CampaignNew;
