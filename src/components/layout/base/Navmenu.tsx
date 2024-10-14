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

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = () => router.push(link);

  // Determine active state based on current route
  const isActive =
    router.pathname.includes("item") && link === "/campaign"
      ? true
      : router.pathname.startsWith(
          link.split("/")[1] ? `/${link.split("/")[1]}` : link,
        );

  // Choose icons based on menu title
  const renderIcon = () => {
    switch (menutitle) {
      case "대시보드":
        return isActive ? (
          <SpaceDashboardIcon fontSize="small" />
        ) : (
          <SpaceDashboardOutlinedIcon fontSize="small" />
        );
      case "캠페인":
        return isActive ? (
          <ConfirmationNumberIcon fontSize="small" />
        ) : (
          <ConfirmationNumberOutlinedIcon fontSize="small" />
        );
      case "마이 페이지":
        return isActive ? (
          <ContactPageIcon fontSize="small" />
        ) : (
          <ContactPageOutlinedIcon fontSize="small" />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`text-md mx-auto flex h-[55px] w-full cursor-pointer items-center justify-center text-white transition-all duration-300`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`flex items-center justify-center rounded-xl p-2 transition-all duration-300 ${
          isActive
            ? "w-[95%] bg-gray-500"
            : isHovered
              ? "w-[90%] opacity-85"
              : "h-[55px] w-[100%] p-4"
        }`}
      >
        {/* Icon */}
        {renderIcon()}
        <div className="w-full pl-3 text-left">
          <span>{menutitle}</span>
        </div>
      </div>
    </div>
  );
};

export default Navmenu;
