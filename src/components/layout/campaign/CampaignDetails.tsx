import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";
import { CampaignArgs, PeriodType } from "@/pages/campaign/lib/types";
import { useRef, KeyboardEvent } from "react";
import Calendar from "react-calendar";

interface CampaignDetailsProps {
  campaignArgs: CampaignArgs;
  setPeriod_type: (value: PeriodType) => void;
  setDescription: (value: string) => void;
  setActive: (value: boolean) => void;
  setTitle: (value: string) => void;
  setStart_date: (value: string) => void;
  setEnd_date: (value: any) => void;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  campaignArgs,
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
    <div className="contents-container w-full justify-center items-center">
      <div className="mb-10 font-bold text-xl flex w-full">캠페인 상세정보</div>
      <div className="inputForm flex flex-col text-left w-full">
        <label className="text-md font-bold mb-4">캠페인 명</label>
        <InputTextBox
          type="text"
          id="title"
          placeholder="캠페인 명을 입력하세요."
          value={campaignArgs.title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="inputForm flex flex-col text-left w-full">
        <label className="text-md font-bold my-4">캠페인 설명</label>
        <InputTextBox
          type="text"
          id="description"
          placeholder="캠페인 설명을 입력하세요."
          value={campaignArgs.description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="inputForm flex flex-col text-left w-full mb-2">
        <label className="text-md font-bold my-4">기간 종류</label>
        <div className="flex justify-between w-[250px] lg:w-[300px]">
          <InputRadioBox
            label="무기한"
            name="period_type"
            value={PeriodType.UL}
            checked={campaignArgs.period_type === PeriodType.UL}
            onChange={handleRadioChange}
          />
          <InputRadioBox
            label="기간 제한"
            name="period_type"
            value="LIMITED"
            checked={campaignArgs.period_type === PeriodType.L}
            onChange={handleRadioChange}
          />
        </div>
      </div>
      <div className="flex flex-col w-full text-left">
        <label className="text-md font-bold my-4">캠페인 기간</label>
        <div className="lg:flex sm:items-center w-full gap-2">
          <InputTextBox
            type="text"
            id="start_date"
            placeholder="캠페인 시작일을 선택하세요."
            value={campaignArgs.start_date}
            onChange={(e) => setStart_date(e.target.value)}
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
          />
        </div>
      </div>
      <div className="inputForm flex flex-col text-left w-full">
        <label className="text-md font-bold my-4">캠페인 활성화</label>
        <div className="flex justify-between w-[250px] lg:w-[300px] ">
          <InputRadioBox
            label="활성화"
            name="active"
            value="true"
            checked={campaignArgs.active === true}
            onChange={handleActiveRadioChange}
          />
          <InputRadioBox
            label="비활성화"
            name="active"
            value="false"
            checked={campaignArgs.active === false}
            onChange={handleActiveRadioChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
