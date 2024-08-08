import { authenticateUserforHeader } from "@/lib/auth";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import router from "next/router";
interface HeaderProps {
  title: string;
}

export const handleSignOut = async (event: React.FormEvent) => {
  const username = getCookie("username");
  if (username) {
    deleteCookie("username");
    console.log(username + " 님 로그아웃");
    router.push("/home");
  } else {
    alert("로그아웃을 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.");
  }
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-gray-200 flex items-center h-[70px] w-[100%]">
      <div className="flex-grow flex items-center justify-between">
        <h2 className="font-semibold text-lg min-w-[300px] pl-3 bg-red-300">{title}</h2>
        <div className="flex">
          <div className="p-2 mr-2 cursor-pointer bg-white rounded-lg">My Page</div>
          <div className="p-2 mr-2 cursor-pointer bg-white rounded-lg" onClick={handleSignOut}>
            Sign out
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
