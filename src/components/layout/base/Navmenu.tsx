import React, { useState } from "react";
import { useRouter } from "next/router";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
interface NavmenuProps {
  menutitle: string;
  link: string;
  submenus?: Array<{ title: string; link: string }>;
}

const Navmenu: React.FC<NavmenuProps> = ({ link, menutitle, submenus }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = () => router.push(link);

  // Determine active state based on current route
  const isActive = router.pathname.startsWith(link);

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
      case "유저검색":
        return isActive ? (
          <SearchIcon fontSize="small" />
        ) : (
          <SearchOutlinedIcon fontSize="small" />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="mx-auto flex w-full flex-col text-[13px] text-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Menu Item */}
      <div
        className={`flex h-[55px] w-full cursor-pointer items-center justify-center transition-all duration-300`}
        onClick={handleClick}
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
          {renderIcon()}
          <div className="w-full pl-3 text-left">
            <span>{menutitle}</span>
          </div>
        </div>
      </div>

      {/* Submenus */}
      {submenus && isActive && (
        <div className="mt-2 pl-10">
          {submenus.map((submenu) => (
            <a
              key={submenu.link}
              href={submenu.link}
              className={`block w-full py-1 text-[14px] ${
                router.pathname === submenu.link ? "font-bold" : "font-normal"
              }`}
            >
              - {submenu.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navmenu;
