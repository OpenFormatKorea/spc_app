import { authenticateUserforHeader } from "@/lib/auth";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import router from "next/router";
interface MainProps {
  children: React.ReactNode;
}

export const handleSignOut = async (event: React.FormEvent) => {
  const access = getCookie("access");
  if (access) {
    deleteCookie("access");
    deleteCookie("refresh");
    deleteCookie("shop_id");
    console.log(access + " 님 로그아웃");
    router.push("/home");
  } else {
    alert("로그아웃을 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.");
  }
};

const DashboardMain: React.FC<MainProps> = ({ children }) => {
  return (
    <div className="pl-[200px] mt-[60px]">
      {" "}
      <div className="inline-block w-full">
        <div className="h2-header w-100 h-[50px] flex items-center font-boldv bg-yellow-500 ">
          <h2>Hello, World!</h2>
        </div>
        {children}
      </div>
    </div>
  );
};
export default DashboardMain;
