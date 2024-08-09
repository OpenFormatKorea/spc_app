import Navmenu from "@/components/layout/base/Navmenu";
import { Router, useRouter } from "next/router";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    router.push("/dashboard");
  };

  return (
    <nav className="bg-yellow-400 w-[200px] fixed h-[100%]">
      <div className="flex items-center justify-center h-[70px] p-3">
        <img src="/svg/spc_logo.svg" alt="Logo" className="h-[100%] cursor-pointer" onClick={handleClick} />
      </div>
      <div className="pt-4">
        <Navmenu menutitle="캠페인" link="/campaign" />
        <Navmenu menutitle="네이버" link="https://www.naver.com" />
      </div>
    </nav>
  );
};
export default Navbar;
