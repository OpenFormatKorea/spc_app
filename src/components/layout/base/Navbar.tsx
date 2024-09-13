import Navmenu from "@/components/layout/base/Navmenu";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = () => {
  const router = useRouter();
  const handleLogo = () => {
    router.push("/dashboard");
  };

  const isActive = false;

  const handleSignOut = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();

    const access = getCookie("access");
    if (access) {
      deleteCookie("access");
      deleteCookie("refresh");
      deleteCookie("shop_id");
      router.push("/home");
    } else {
      alert("로그아웃을 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.");
    }
  };
  return (
    <nav className=" w-[250px] fixed h-[100%] lg:block hidden lg:w-[250px] lg:fixed lg:h-[100%]">
      <div className="flex items-center justify-center h-[70px] p-3">
        <a onClick={handleLogo}>
          <img src="/images/incento_logo.png" alt="Incento Logo" className="h-[] cursor-pointer mr-4" />
        </a>
      </div>
      <div className="pt-4">
        {" "}
        <div className={`pl-4 pb-4 text-sm text-white `}>main</div>
        <div className="main-menu pl-3">
          <Navmenu menutitle="대시보드" link="/dashboard" />
          <Navmenu menutitle="캠페인" link="/campaign" />
        </div>
        <div className={`pl-4 py-4 text-sm text-white `}>setting</div>
        <div className="main-menu pl-3">
          <Navmenu menutitle="마이 페이지" link="/mypage" />
        </div>
        <div className="setting-menu absolute bottom-[5%] w-full">
          <div
            className="h-[55px] flex items-center text-md cursor-pointer transition-all duration-300 text-white w-full p-4"
            onClick={handleSignOut}
          >
            <div className="pl-2 flex items-center">
              <LogoutIcon fontSize="small" />
              <div className="w-full text-left pl-3 text-md">
                <a>로그아웃</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
