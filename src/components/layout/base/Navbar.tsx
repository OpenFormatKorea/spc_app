import Navmenu from "@/components/layout/base/Navmenu";
import { useRouter } from "next/router";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/dashboard");
  };

  return (
    <nav className="bg-sky-900 w-[250px] fixed h-[100%] lg:block hidden lg:w-[250px] lg:fixed lg:h-[100%]">
      <div className="flex items-center justify-center h-[70px] p-3">
        <img src="/svg/spc_logo.svg" alt="Logo" className="h-[100%] cursor-pointer" onClick={handleClick} />
      </div>
      <div className="pt-4">
        <Navmenu menutitle="대시보드" link="/dashboard" />
        <Navmenu menutitle="캠페인" link="/campaign" />
      </div>
    </nav>
  );
};

export default Navbar;
