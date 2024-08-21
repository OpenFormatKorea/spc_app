import React, { useState } from "react";
import { useRouter } from "next/router";

interface NavmenuProps {
  menutitle: string;
  link: string;
}

const Navmenu: React.FC<NavmenuProps> = ({ link, menutitle }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    router.push(link);
  };

  // Determines if the current route is active
  const isActive = router.pathname.startsWith(link.split("/")[1] ? `/${link.split("/")[1]}` : link);

  return (
    <div
      className={`h-[55px] pl-[20px] flex items-center text-lg cursor-pointer transition-colors duration-300 font-semibold  text-white
        ${isActive ? "lg:bg-yellow-500 bg-[#1a6fb0]" : "lg:bg-yellow-400 bg-[#20b7ec] "}
        w-full
        ${!isActive && "lg:hover:bg-yellow-500 hover:bg-[#1a6fb0]"}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a href={link} className="w-full">
        {menutitle}
      </a>
    </div>
  );
};

export default Navmenu;

// size fix implemented

// import { useState } from "react";
// import { useRouter } from "next/router";

// interface NavmenuProps {
//   menutitle: string;
//   link: string;
//   isExpanded: boolean;
// }

// const Navmenu: React.FC<NavmenuProps> = ({ menutitle, link, isExpanded }) => {
//   const [isHovered, setIsHovered] = useState(false); // State to manage hover
//   const router = useRouter();
//   const isActive = router.pathname === link;

//   const handleClick = () => {
//     if (link.startsWith("http")) {
//       window.open(link, "_blank");
//     } else {
//       router.push(link);
//     }
//   };

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//   };

//   return (
//     <div
//       className={`h-[50px] pl-[20px] flex items-center text-xl cursor-pointer transition-all duration-300 font-semibold ${
//         isActive
//           ? "bg-yellow-500 text-white" // Active state styling
//           : isHovered
//           ? "bg-[rgba(255,255,255,0.5)] text-black" // Hover state styling with semi-transparent background
//           : "bg-white text-gray-700" // Default state styling
//       }`}
//       onClick={handleClick}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       {isExpanded ? `- ${menutitle}` : "-"}
//     </div>
//   );
// };

// export default Navmenu;
