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
      className={`h-[55px] pl-[20px] flex items-center text-lg cursor-pointer transition-colors duration-300 font-semibold  text-white w-full
        ${isActive ? "lg:bg-sky-700 bg-sky-700" : "lg:bg-sky-900 bg-sky-700 "}
        ${!isActive && "lg:bg-sky-900 bg-sky-600 "}
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
