import { authenticateUserforHeader } from "@/lib/auth";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import router from "next/router";
interface DashboardContentsProps {
  children: React.ReactNode;
}

const CampaignContents: React.FC<DashboardContentsProps> = ({ children }) => {
  return (
    <div className="campaign-container shadow-sm rounded-lg p-6 border-gray-200 border bg-white mt-4 mx-2 w-[50%] ">
      {children}
    </div>
  );
};
export default CampaignContents;
