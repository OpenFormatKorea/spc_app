import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";
import { CampaignArgs } from "@/pages/campaign/lib/types";
import { useRef, KeyboardEvent } from "react";
import Calendar from "react-calendar";
interface DashboarDetailsProps {
  campaignArgs: CampaignArgs;
  setPeriod_type: (value: string) => void;
  setDescription: (value: string) => void;
  setActive: (value: boolean) => void;
  setTitle: (value: string) => void;
  setStart_date: (value: string) => void;
  setEnd_date: (value: string) => void;
  // setNewStartDate: (value: Date) => void;
  // setNewEndDate: (value: Date) => void;
}

const CampaignDetails: React.FC<DashboarDetailsProps> = ({
  campaignArgs,
  setPeriod_type,
  setDescription,
  setActive,
  setTitle,
  setStart_date,
  setEnd_date,
  // setNewStartDate,
  // setNewEndDate,
}) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriod_type(e.target.value);
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
      <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
        <a className="w-[100px] text-md font-bold">리퍼럴 명: </a>
        <InputTextBox
          type="text"
          id="title"
          placeholder="캠페인 명을 입력하세요."
          value={campaignArgs.title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
        <a className="w-[100px] text-md font-bold">리퍼럴 설명: </a>
        <InputTextBox
          type="text"
          id="description"
          placeholder="캠페인 설명을 입력하세요."
          value={campaignArgs.description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="inputForm p-2 flex space-x-4 items-center h-[60px] ">
        <a className="w-[100px] text-md font-bold">기간 종류: </a>
        <InputRadioBox
          label="무기한"
          name="period_type"
          value="UNLIMITED"
          checked={campaignArgs.period_type === "UNLIMITED"}
          onChange={handleRadioChange}
        />
        <InputRadioBox
          label="기간 제한"
          name="period_type"
          value="LIMITED"
          checked={campaignArgs.period_type === "LIMITED"}
          onChange={handleRadioChange}
        />
      </div>
      <div className="inputForm p-2 flex space-x-4 items-center h-[60px]">
        <a className="w-[100px] text-md font-bold">캠페인 기간: </a>
        <div>
          {/* <Calendar onChange={(date) => setNewStartDate(date as Date)} value={campaignArgs.newStart_date} /> */}
          <input
            id="start_date"
            className="text-md text-gray-500 h-[30px] p-2"
            value={campaignArgs.start_date}
            onChange={(e) => setStart_date(e.target.value)}
          />
        </div>
        ~
        <div>
          {/* <Calendar onChange={(date) => setNewEndDate(date as Date)} value={campaignArgs.newEnd_date} /> */}
          <input
            id="end_date"
            className="text-md text-gray-500 h-[30px] p-2"
            value={campaignArgs.end_date}
            onChange={(e) => setEnd_date(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
        <a className="w-[100px] text-md font-bold">리퍼럴 활성화: </a>
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
  );
};
export default CampaignDetails;
