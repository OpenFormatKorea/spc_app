import { authenticateUserforHeader } from "@/lib/auth";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import router from "next/router";
interface DashboardContentsProps {
  children: React.ReactNode;
}

const DashboardContents: React.FC<DashboardContentsProps> = ({ children }) => {
  return (
    <div className="body-container shadow-sm rounded-lg p-3 border-gray-200 border flex-1 bg-blue-50 m-6 max-w-fit min-w-[400px] h-50">
      {children}
    </div>
  );
};
export default DashboardContents;
