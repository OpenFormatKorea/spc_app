import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons for menu
import { authenticateUserforHeader } from "@/lib/auth";
import { deleteCookie, getCookie } from "cookies-next";
import router from "next/router";
import Navmenu from "@/components/layout/base/Navmenu";

interface HeaderProps {
  title: string;
}

const headerBtnstyle = "p-2 cursor-pointer bg-white rounded-lg text-xs text-center min-w-[65px]";

export const handleSignOut = async (event?: React.FormEvent) => {
  if (event) event.preventDefault();

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-sky-600 fixed top-0 w-full lg:w-[calc(100%-250px)] lg:ml-[250px]">
      <div className="flex items-center h-[60px] px-6 w-full">
        <div className="flex items-center lg:hidden">
          {/* Logo visible only on mobile */}
          <img src="/svg/spc_logo.svg" alt="Logo" className="h-[40px] cursor-pointer mr-4" />
        </div>
        <h2 className="font-semibold text-lg min-w-[150px] mr-auto text-white">{title}</h2>
        <div className="space-x-2 hidden lg:flex">
          <div className="p-2 cursor-pointer bg-white rounded-lg text-xs text-center min-w-[65px]">My Page</div>
          <div
            className="p-2 cursor-pointer bg-white rounded-lg text-xs text-center min-w-[65px]"
            onClick={handleSignOut}
          >
            Sign out
          </div>
        </div>
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-sky-600 text-white lg:hidden flex flex-col items-start p-4">
          <Navmenu menutitle="대시보드" link="/dashboard" />
          <Navmenu menutitle="캠페인" link="/campaign" />
          <div className="border-t border-white my-2 w-full"></div>
          <Navmenu menutitle="My Page" link="/mypage" />
          <div
            className="py-2 cursor-pointer"
            onClick={(event) => {
              handleSignOut(event);
              toggleMenu();
            }}
          >
            Sign out
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
