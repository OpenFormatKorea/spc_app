// src/pages/home.tsx
import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import { getShopIdFromCookies } from "@/lib/helper";
import { fetchCreateCampaign } from "@/pages/campaign/lib/apis";
import { CampaignArgs } from "@/pages/campaign/lib/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useRef, useState, KeyboardEvent } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const NewCampaign = (context: GetServerSidePropsContext) => {
  //table style string
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [period_type, setPeriod_type] = useState("UNLIMITED");
  const [start_date, setStart_date] = useState("2024-08-14 00:00:00");
  const [end_date, setEnd_date] = useState("2024-08-16 00:00:00");
  const [active, setActive] = useState(true);
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriod_type(e.target.value);
  };
  const handleActiveRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActive(e.target.value === "true");
  };

  const infoCheck = (info: CampaignArgs) => {
    if (!info.title) {
      alert("리퍼럴 명을 입력 해주세요.");
      return false;
    } else if (!info.description) {
      alert("리퍼럴 설명을 입력 해주세요.");
      return false;
    } else if (!info.start_date) {
      alert("리퍼럴 시작 시간을 선택 해주세요.");
      return false;
    } else if (period_type === "LIMITED" && !info.end_date) {
      alert("리퍼럴 종료 시간을 선택 해주세요.");
      return false;
    } else {
      return true;
    }
  };

  const campaignArgs: CampaignArgs = {
    // shop_id: shop_id,
    title: title,
    description: description,
    period_type: period_type,
    start_date: start_date,
    end_date: end_date,
    active: active,
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission behavior if it's in a form element
      if (buttonRef.current) {
        buttonRef.current.click(); // Trigger the click event on the login button
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;

    if (id === "create_campaign") {
      if (infoCheck(campaignArgs)) {
        const result = await fetchCreateCampaign(campaignArgs, context);
        alert(result.message);
        if (result.success) {
          router.push("/campaign");
        }
      } else {
        console.log("리퍼럴 생성을 실패 하였습니다.");
        return false;
      }
    }
  };
  return (
    <DashboardContainer
      title={"새 리퍼럴 생성"}
      onclick={handleSubmit}
      onclickText="저장하기"
      buttonId="create_campaign"
    >
      <DashboardContents>
        <div className="contents-container w-full justify-center items-center">
          <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
            <a className="w-[100px] text-md font-bold">리퍼럴 명: </a>
            <InputTextBox
              type="text"
              id="title"
              placeholder="리퍼럴 명을 입력하세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="inputForm p-2 flex space-x-4 items-center h-[60px] text-left">
            <a className="w-[100px] text-md font-bold">리퍼럴 설명: </a>
            <InputTextBox
              type="text"
              id="description"
              placeholder="리퍼럴 설명을 입력하세요."
              value={description}
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
              checked={period_type === "UNLIMITED"}
              onChange={handleRadioChange}
            />
            <InputRadioBox
              label="기간 제한"
              name="period_type"
              value="LIMITED"
              checked={period_type === "LIMITED"}
              onChange={handleRadioChange}
            />
          </div>
          <div className="inputForm p-2 flex space-x-4 items-center h-[60px]">
            <a className="w-[100px] text-md font-bold">캠페인 기간: </a>
            <div>
              <input
                id="start_date"
                className="text-md text-gray-500 h-[30px] p-2"
                value={start_date}
                onChange={(e) => setStart_date(e.target.value)}
              />
            </div>
            ~
            <div>
              <input
                id="end_date"
                className="text-md text-gray-500 h-[30px] p-2"
                value={end_date}
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
              checked={active === true}
              onChange={handleActiveRadioChange}
            />
            <InputRadioBox
              label="비활성화"
              name="active"
              value="false"
              checked={active === false}
              onChange={handleActiveRadioChange}
            />
          </div>
        </div>
      </DashboardContents>
    </DashboardContainer>
  );
};

export default NewCampaign;
