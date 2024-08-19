import Navmenu from "@/components/layout/base/Navmenu";
import { Router, useRouter } from "next/router";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    router.push("/dashboard");
  };

  return (
    <nav className="bg-yellow-400 w-[250px] fixed h-[100%]">
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

// import { useState } from "react";
// import { useRouter } from "next/router";
// import Navmenu from "./Navmenu"; // Assuming Navmenu is the component for menu items

// const Navbar: React.FC = () => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const router = useRouter();

//   const handleToggle = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <nav
//       className={`bg-yellow-400 fixed h-[100%] transition-all duration-300 ${isExpanded ? "w-[250px]" : "w-[70px]"}`}
//     >
//       <div className="flex items-center justify-center h-[70px] p-3">
//         <img src="/svg/spc_logo.svg" alt="Logo" className="h-[100%] cursor-pointer" onClick={handleToggle} />
//       </div>
//       <div className="pt-4">
//         <Navmenu menutitle="캠페인" link="/campaign" isExpanded={isExpanded} />
//         <Navmenu menutitle="네이버" link="https://www.naver.com" isExpanded={isExpanded} />
//         {/* Add more Navmenu items as needed */}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
