import React, { useState } from "react";
import { useRouter } from "next/router";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
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

  return (
    <div
      className="h-[55px] w-full flex items-center justify-center text-md cursor-pointer text-white mx-auto"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`p-2 flex items-center justify-center transition-all duration-300 rounded-xl
      ${isActive ? "bg-sky-700 w-[90%]" : isHovered ? "lg:bg-sky-700 sm:bg-sky-500 w-[90%] opacity-85" : "p-4 h-[55px] w-[100%]"}
    `}
      >
        {/* Render Icons Based on Menu Title */}
        {menutitle === "대시보드" &&
          (isActive ? <SpaceDashboardIcon fontSize="small" /> : <SpaceDashboardOutlinedIcon fontSize="small" />)}
        {menutitle === "캠페인" &&
          (isActive ? (
            <ConfirmationNumberIcon fontSize="small" />
          ) : (
            <ConfirmationNumberOutlinedIcon fontSize="small" />
          ))}
        {menutitle === "마이 페이지" &&
          (isActive ? <ContactPageIcon fontSize="small" /> : <ContactPageOutlinedIcon fontSize="small" />)}

        {/* Menu Title */}
        <div className="w-full text-left pl-3">
          <a href={link}>{menutitle}</a>
        </div>
      </div>
    </div>
  );
};

export default Navmenu;
