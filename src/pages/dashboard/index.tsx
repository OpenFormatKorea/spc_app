import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import { authenticateUserforHeader } from "@/lib/auth";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return authenticateUserforHeader(context);
};

// src/pages/index.tsx
const Dashboard: React.FC = () => {
  //table style string
  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700";
  const tbodyStyle = "px-6 py-4 border-b border-gray-200";
  const router = useRouter();
  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "more_campaign") {
      router.push("campaign");
    }
  };
  return (
    <DashboardContainer title={"대시보드"} onclick={handleButton} onclickText="" buttonId="dashboard">
      <div className="contents-container w-full justify-center">
        <DashboardContents>
          <div className="font-bold text-xl flex w-full">
            <div className="w-[50%]">리퍼럴 목록</div>
            <div
              id="more_campaign"
              className="w-[50%] text-right text-sm pr-1 justify-center cursor-pointer text-blue-400"
              onClick={handleButton}
            >
              더보기
            </div>
          </div>
          <div className="">현재 사용중인 리퍼럴 목록입니다.</div>
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
        <div className="flex">
          <DashboardContents>children</DashboardContents>
          <DashboardContents>children</DashboardContents>
        </div>
        <div className="flex">
          <DashboardContents>
            <div>SUBJECT</div>
            <div>description</div>
            <table className="min-w-full bg-white border border-gray-200 ">
              <thead>
                <tr className="bg-gray-200">
                  <th className={theadStyle}>Name</th>
                  <th className={theadStyle}>Age</th>
                  <th className={theadStyle}>Country</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tbodyStyle}>John Doe</td>
                  <td className={tbodyStyle}>28</td>
                  <td className={tbodyStyle}>USA</td>
                </tr>
                <tr>
                  <td className={tbodyStyle}>Jane Smith</td>
                  <td className={tbodyStyle}>34</td>
                  <td className={tbodyStyle}>Canada</td>
                </tr>
                <tr>
                  <td className={tbodyStyle}>Emily Johnson</td>
                  <td className={tbodyStyle}>22</td>
                  <td className={tbodyStyle}>UK</td>
                </tr>
              </tbody>
            </table>
          </DashboardContents>
          <DashboardContents>
            <div>SUBJECT</div>
            <div>description</div>
            <table className="min-w-full bg-white border border-gray-200 ">
              <thead>
                <tr className="bg-gray-200">
                  <th className={theadStyle}>Name</th>
                  <th className={theadStyle}>Age</th>
                  <th className={theadStyle}>Country</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tbodyStyle}>John Doe</td>
                  <td className={tbodyStyle}>28</td>
                  <td className={tbodyStyle}>USA</td>
                </tr>
                <tr>
                  <td className={tbodyStyle}>Jane Smith</td>
                  <td className={tbodyStyle}>34</td>
                  <td className={tbodyStyle}>Canada</td>
                </tr>
                <tr>
                  <td className={tbodyStyle}>Emily Johnson</td>
                  <td className={tbodyStyle}>22</td>
                  <td className={tbodyStyle}>UK</td>
                </tr>
              </tbody>
            </table>
          </DashboardContents>
        </div>
        <DashboardContents>
          <div>SUBJECT</div>
          <div>description</div>
          <table className="min-w-full bg-white border border-gray-200 ">
            <thead>
              <tr className="bg-gray-200">
                <th className={theadStyle}>Name</th>
                <th className={theadStyle}>Age</th>
                <th className={theadStyle}>Country</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tbodyStyle}>John Doe</td>
                <td className={tbodyStyle}>28</td>
                <td className={tbodyStyle}>USA</td>
              </tr>
              <tr>
                <td className={tbodyStyle}>Jane Smith</td>
                <td className={tbodyStyle}>34</td>
                <td className={tbodyStyle}>Canada</td>
              </tr>
              <tr>
                <td className={tbodyStyle}>Emily Johnson</td>
                <td className={tbodyStyle}>22</td>
                <td className={tbodyStyle}>UK</td>
              </tr>
            </tbody>
          </table>
        </DashboardContents>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
