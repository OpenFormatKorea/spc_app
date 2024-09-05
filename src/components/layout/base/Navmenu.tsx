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

  const isActive = router.pathname.startsWith(link.split("/")[1] ? `/${link.split("/")[1]}` : link);

  return (
    <div
      className={`h-[55px] flex items-center text-xl cursor-pointer transition-colors duration-300 font-semibold text-white w-full
      ${isActive ? "bg-sky-700 lg:bg-sky-700 sm:bg-sky-700" : isHovered ? "lg:bg-sky-700 sm:bg-sky-600" : "lg:bg-sky-900 sm:bg-sky-400"}
    `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a href={link} className="w-full text-center">
        {menutitle}
      </a>
    </div>
  );
};

export default Navmenu;
