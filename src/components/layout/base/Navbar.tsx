import Navmenu from "@/components/layout/base/Navmenu";
import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { handleLogo, handleSignOut } from "@/lib/common";
interface NavbarProps {
  shop_id: string;
}

const Navbar: React.FC<NavbarProps> = ({ shop_id }: { shop_id: string }) => {
  return (
    <nav className="fixed hidden h-[100%] w-[250px] lg:fixed lg:block lg:h-[100%] lg:w-[250px]">
      <div className="flex h-[70px] items-center justify-center p-3">
        <a onClick={handleLogo}>
          <img
            src="/images/incento_logo.png"
            alt="Incento Logo"
            className="mr-4 h-[] cursor-pointer"
          />
        </a>
      </div>
      <div className="pt-4">
        <div className={`pb-4 pl-4 text-sm text-white`}>main</div>
        <div className="main-menu pl-3">
          <Navmenu menutitle="대시보드" link="/dashboard" />
          <Navmenu menutitle="캠페인" link="/campaign" />
        </div>
        <div className={`py-4 pl-4 text-sm text-white`}>setting</div>
        <div className="main-menu pl-3">
          <Navmenu menutitle="마이 페이지" link="/mypage" />
        </div>
        <div className="setting-menu absolute bottom-[5%] w-full">
          <div className="flex w-full flex-col justify-center p-3">
            <label className="text-xs text-white"> SHOP ID</label>
            <label className="text-xs text-white">{shop_id}</label>
          </div>
          <div
            className="text-md flex h-[55px] w-full cursor-pointer items-center p-4 text-white transition-all duration-300"
            onClick={handleSignOut}
          >
            <div className="flex items-center pl-2">
              <LogoutIcon fontSize="small" />
              <div className="text-md w-full pl-3 text-left">
                <span>로그아웃</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
