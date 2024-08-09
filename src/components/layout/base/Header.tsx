import { authenticateUserforHeader } from "@/lib/auth";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import router from "next/router";
interface HeaderProps {
  title: string;
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

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-[#20b7ec] fixed top-0 left-0 ml-[200px]" style={{ width: "calc(100% - 200px)" }}>
      <div className="flex items-center h-[60px] px-4">
        <h2 className="font-semibold text-lg min-w-[150px] mr-auto text-white">{title}</h2>
        <div className="flex space-x-2">
          <div className="p-2 cursor-pointer bg-white rounded-lg text-sm text-center w-[72px]">My Page</div>
          <div className="p-2 cursor-pointer bg-white rounded-lg text-sm text-center w-[72px]" onClick={handleSignOut}>
            Sign out
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
