import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons for menu
import Navmenu from "@/components/layout/base/Navmenu";
import LogoutIcon from "@mui/icons-material/Logout";
import { handleLogo, handleSignOut } from "@/lib/common";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className=" fixed top-0 w-full lg:hidden z-10 opacity-95">
      <div className=" bg-gray-400  flex items-center h-[60px] px-6 w-full">
        <div className="flex items-center lg:hidden">
          <a onClick={handleLogo}>
            <img src="/images/incento_logo.png" alt="Incento Logo" className="h-[25px] cursor-pointer mr-4" />
          </a>
        </div>

        <div className="lg:hidden flex items-center mr-0 ml-auto">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-gray-400 text-white lg:hidden flex flex-col items-start p-4">
          <Navmenu menutitle="대시보드" link="/dashboard" />
          <Navmenu menutitle="캠페인" link="/campaign" />
          <div className="border-t border-white my-2 w-full"></div>
          <Navmenu menutitle="마이 페이지" link="/mypage" />
          <div
            className={`h-[55px] w-full flex items-center justify-center text-md cursor-pointer text-white mx-auto transition-all duration-300`}
          >
            <div
              className="p-2 flex items-center justify-center transition-all duration-300 rounded-xl w-[95%]"
              onClick={(event) => {
                handleSignOut(event);
                toggleMenu();
              }}
            >
              <LogoutIcon fontSize="small" />
              <div className="w-full text-left pl-3">
                <a>로그아웃</a>
              </div>
            </div>
          </div>
          {/* <div className="w-full flex flex-col justify-center px-5">
            <label className="text-xs text-white"> SHOP ID</label>
            <label id="shop_id" className="flex text-xs text-white">
              {shop_id}
            </label>
          </div> */}
        </div>
      )}
    </header>
  );
};

export default Header;
