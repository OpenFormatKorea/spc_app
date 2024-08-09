import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import { authenticateUserforHeader } from "@/lib/auth";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return authenticateUserforHeader(context);
};

// src/pages/index.tsx
const Dashboard: React.FC = () => {
  return (
    <DashboardContainer title={"대시보드"}>
      <div className="contents-container flex flex-wrap w-[100%] h-[100%] justify-center ">
        <DashboardContents>
          <div>SUBJECT</div>
          <div>description</div>
          <table className="min-w-full bg-white border border-gray-200 ">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Age</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                  Country
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">John Doe</td>
                <td className="px-6 py-4 border-b border-gray-200">28</td>
                <td className="px-6 py-4 border-b border-gray-200">USA</td>
              </tr>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">Jane Smith</td>
                <td className="px-6 py-4 border-b border-gray-200">34</td>
                <td className="px-6 py-4 border-b border-gray-200">Canada</td>
              </tr>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">Emily Johnson</td>
                <td className="px-6 py-4 border-b border-gray-200">22</td>
                <td className="px-6 py-4 border-b border-gray-200">UK</td>
              </tr>
            </tbody>
          </table>
        </DashboardContents>
        <DashboardContents>children</DashboardContents>
        <DashboardContents>children</DashboardContents>
        <DashboardContents>children</DashboardContents>
        <DashboardContents>children</DashboardContents>
        <DashboardContents>children</DashboardContents>
        <DashboardContents>
          <div>SUBJECT</div>
          <div>description</div>
          <table className="min-w-full bg-white border border-gray-200 ">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Age</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                  Country
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">John Doe</td>
                <td className="px-6 py-4 border-b border-gray-200">28</td>
                <td className="px-6 py-4 border-b border-gray-200">USA</td>
              </tr>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">Jane Smith</td>
                <td className="px-6 py-4 border-b border-gray-200">34</td>
                <td className="px-6 py-4 border-b border-gray-200">Canada</td>
              </tr>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">Emily Johnson</td>
                <td className="px-6 py-4 border-b border-gray-200">22</td>
                <td className="px-6 py-4 border-b border-gray-200">UK</td>
              </tr>
            </tbody>
          </table>
        </DashboardContents>{" "}
        <DashboardContents>
          <div>SUBJECT</div>
          <div>description</div>
          <table className="min-w-full bg-white border border-gray-200 ">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Age</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                  Country
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">John Doe</td>
                <td className="px-6 py-4 border-b border-gray-200">28</td>
                <td className="px-6 py-4 border-b border-gray-200">USA</td>
              </tr>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">Jane Smith</td>
                <td className="px-6 py-4 border-b border-gray-200">34</td>
                <td className="px-6 py-4 border-b border-gray-200">Canada</td>
              </tr>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">Emily Johnson</td>
                <td className="px-6 py-4 border-b border-gray-200">22</td>
                <td className="px-6 py-4 border-b border-gray-200">UK</td>
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
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Age</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                  Country
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">John Doe</td>
                <td className="px-6 py-4 border-b border-gray-200">28</td>
                <td className="px-6 py-4 border-b border-gray-200">USA</td>
              </tr>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">Jane Smith</td>
                <td className="px-6 py-4 border-b border-gray-200">34</td>
                <td className="px-6 py-4 border-b border-gray-200">Canada</td>
              </tr>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">Emily Johnson</td>
                <td className="px-6 py-4 border-b border-gray-200">22</td>
                <td className="px-6 py-4 border-b border-gray-200">UK</td>
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
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Age</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                  Country
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">John Doe</td>
                <td className="px-6 py-4 border-b border-gray-200">28</td>
                <td className="px-6 py-4 border-b border-gray-200">USA</td>
              </tr>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">Jane Smith</td>
                <td className="px-6 py-4 border-b border-gray-200">34</td>
                <td className="px-6 py-4 border-b border-gray-200">Canada</td>
              </tr>
              <tr>
                <td className="px-6 py-4 border-b border-gray-200">Emily Johnson</td>
                <td className="px-6 py-4 border-b border-gray-200">22</td>
                <td className="px-6 py-4 border-b border-gray-200">UK</td>
              </tr>
            </tbody>
          </table>
        </DashboardContents>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
