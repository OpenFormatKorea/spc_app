import React, { useState } from "react";
import { useRouter } from "next/router";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
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

  // const isActive = router.pathname.startsWith(link.split("/")[1] ? `/${link.split("/")[1]}` : link);
  const isActive =
    router.pathname.includes("item") && link === "/campaign"
      ? true
      : router.pathname.startsWith(link.split("/")[1] ? `/${link.split("/")[1]}` : link);
  console.log("isActive", isActive);

  return (
    <div
      className={`h-[55px] flex items-center text-md cursor-pointer transition-colors duration-300 text-white w-full p-4
    ${isActive ? "bg-sky-700" : isHovered ? "lg:bg-sky-700 sm:bg-sky-500" : "lg:bg-sky-900 sm:bg-sky-700"}
  `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icon and Menu Title Logic */}
      <div className="p-2 flex items-center">
        {/* Dashboard Menu */}
        {menutitle === "대시보드" && (isActive ? <HomeIcon fontSize="small" /> : <HomeOutlinedIcon fontSize="small" />)}

        {/* Campaign Menu */}
        {menutitle === "캠페인" &&
          (isActive ? (
            <ConfirmationNumberIcon fontSize="small" />
          ) : (
            <ConfirmationNumberOutlinedIcon fontSize="small" />
          ))}
      </div>

      {/* Menu Title */}
      <div className="w-full text-left pl-3">
        <a href={link}>{menutitle}</a>
      </div>
    </div>
  );
};

export default Navmenu;
