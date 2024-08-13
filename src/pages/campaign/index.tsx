import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import { useRouter } from "next/router";

// src/pages/index.tsx
const Campaign: React.FC = () => {
  //table style string
  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700";
  const tbodyStyle = "px-6 py-4 border-b border-gray-200";
  const router = useRouter();
  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "new_campaign") {
      router.push("campaign/new");
    }
  };
  return (
    <DashboardContainer title={"캠페인"} onclick={handleButton} onclickText="새 리퍼럴 생성" buttonId="new_campaign">
      <div className="wrapper-container">
        {/* <div className="contents-container w-full justify-center"> */}
        <div className="contents-container w-full justify-center">
          <DashboardContents>
            <div className="font-bold text-xl flex w-full">
              <div className="w-[50%]">리퍼럴 생성하기</div>
              {/* <div
                id="more_campaign"
                className="w-[50%] text-right text-sm pr-1 justify-center cursor-pointer text-blue-400"
                onClick={handleButton}
              >
                더보기
              </div> */}
            </div>
            <div>현재 사용중인 리퍼럴 목록입니다.</div>
            <div className="my-2 w-full">
              <table className="w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-200">
                    <th className={theadStyle}>리퍼럴명</th>
                    <th className={theadStyle}>타입</th>
                    <th className={theadStyle}>활성화</th>
                    <th className={theadStyle}>캠페인 생성일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={tbodyStyle}>예시 캠페인</td>
                    <td className={tbodyStyle}>Product</td>
                    <td className={tbodyStyle}>ON</td>
                    <td className={tbodyStyle}>2024-08-12 12:00:00</td>
                  </tr>
                  <tr>
                    <td className={tbodyStyle}>예시 캠페인2</td>
                    <td className={tbodyStyle}>Promotion</td>
                    <td className={tbodyStyle}>OFF</td>
                    <td className={tbodyStyle}>2024-08-12 12:00:00</td>
                  </tr>
                  <tr>
                    <td className={tbodyStyle}>예시 캠페인3</td>
                    <td className={tbodyStyle}>Product</td>
                    <td className={tbodyStyle}>ON</td>
                    <td className={tbodyStyle}>2024-08-12 12:00:00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DashboardContents>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Campaign;
