import Navmenu from "@/components/layout/base/Navmenu";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-yellow-400 w-[200px] fixed h-[100%]">
      <div className="flex items-center justify-center h-[70px]">
        <img src="/images/incento_logo.png" alt="Logo" />
      </div>
      <div className="pt-4">
        <Navmenu menutitle="네이버" link="https://www.naver.com" />
        <Navmenu menutitle="캠페인" link="https://www.daum.net" />
      </div>
    </nav>
  );
};
export default Navbar;
