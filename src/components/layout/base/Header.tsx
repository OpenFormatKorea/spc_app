import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons for menu
import Navmenu from "@/components/layout/base/Navmenu";
import LogoutIcon from "@mui/icons-material/Logout";
import { handleLogo, handleSignOut } from "@/lib/common";

interface HeaderProps {
  shop_id: any;
}

const Header: React.FC<HeaderProps> = ({ shop_id }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 z-10 w-full opacity-95 lg:hidden">
      <div className="flex h-[60px] w-full items-center bg-gray-400 px-6">
        <div className="flex items-center lg:hidden">
          <a onClick={handleLogo}>
            <img
              src="/images/incento_logo.png"
              alt="Incento Logo"
              className="mr-4 h-[25px] cursor-pointer"
            />
          </a>
        </div>

        <div className="ml-auto mr-0 flex items-center lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="flex flex-col items-start bg-gray-400 p-4 text-white lg:hidden">
          <Navmenu menutitle="대시보드" link="/dashboard" />

          <Navmenu
            menutitle="캠페인"
            link="/campaign"
            submenus={[
              { title: "캠페인 리스트", link: "/campaign" },
              { title: "캠페인 생성", link: "/campaign/new" },
              { title: "캠페인 상세 리포트", link: "/campaign/report" },
              { title: "캠페인 지표", link: "/campaign/stats" },
            ]}
          />

          <div className="my-2 w-full border-t border-white"></div>

          <Navmenu menutitle="유저검색" link="/admin/usersearch" />
          <Navmenu menutitle="마이 페이지" link="/admin/mypage" />

          <div
            className={`mx-auto flex h-[55px] w-full cursor-pointer items-center justify-center text-[13px] text-white transition-all duration-300`}
          >
            <div
              className="flex w-[95%] items-center justify-center rounded-xl p-2 transition-all duration-300"
              onClick={(event) => {
                handleSignOut(event);
                toggleMenu();
              }}
            >
              <LogoutIcon fontSize="small" />
              <div className="w-full pl-3 text-left">
                <a>로그아웃</a>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col justify-center px-5">
            <span className="text-[12px] text-white">SHOP ID</span>
            <span id="shop_id" className="flex text-[12px] text-white">
              {shop_id}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
