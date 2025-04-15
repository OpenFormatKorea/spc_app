import Navmenu from "@/components/layout/base/Navmenu";
import LogoutIcon from "@mui/icons-material/Logout";
import { handleLogo, handleSignOut } from "@/lib/common";
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
interface NavbarProps {
  shop_id: string;
}

const Navbar: React.FC<NavbarProps> = ({ shop_id }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleMouseEnter = (menu: string) => setIsHovered(menu);
  const handleMouseLeave = () => setIsHovered(null);
  const handleClick = (link: string) => router.push(link);

  // Check active state based on current route for each menu item
  const isActive = (link: string) => router.pathname.startsWith(link);

  const renderIcon = (menuTitle: string, active: boolean) => {
    switch (menuTitle) {
      case "대시보드":
        return active ? (
          <SpaceDashboardIcon fontSize="small" />
        ) : (
          <SpaceDashboardOutlinedIcon fontSize="small" />
        );
      case "캠페인":
        return active ? (
          <ConfirmationNumberIcon fontSize="small" />
        ) : (
          <ConfirmationNumberOutlinedIcon fontSize="small" />
        );
      case "마이 페이지":
        return active ? (
          <ContactPageIcon fontSize="small" />
        ) : (
          <ContactPageOutlinedIcon fontSize="small" />
        );
      case "유저검색":
        return active ? (
          <SearchIcon fontSize="small" />
        ) : (
          <SearchOutlinedIcon fontSize="small" />
        );
      default:
        return null;
    }
  };

  return (
    <nav className="fixed hidden h-[100%] w-[250px] lg:fixed lg:block lg:h-[100%] lg:w-[250px]">
      <div className="flex h-[70px] items-center justify-center p-3">
        <a onClick={handleLogo}>
          <img
            src="/images/incento_logo.png"
            alt="Incento Logo"
            className="mr-4 h-auto cursor-pointer"
          />
        </a>
      </div>
      <div className="pt-4">
        <div className="pb-4 pl-4 text-[14px] text-white">main</div>
        <div className="main-menu pl-3">
          {/* Dashboard */}
          <div
            className="mx-auto flex h-[55px] w-full cursor-pointer items-center justify-center text-[13px] text-white transition-all duration-300"
            onClick={() => handleClick("/dashboard")}
            onMouseEnter={() => handleMouseEnter("대시보드")}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`flex items-center justify-center rounded-xl p-2 transition-all duration-300 ${
                isActive("/dashboard")
                  ? "w-[95%] bg-gray-500"
                  : isHovered === "대시보드"
                    ? "w-[90%] opacity-85"
                    : "h-[55px] w-[100%] p-4"
              }`}
            >
              {renderIcon("대시보드", isActive("/dashboard"))}
              <div className="w-full pl-3 text-left">
                <span>대시보드</span>
              </div>
            </div>
          </div>
          {/* Campaign */}
          <div
            className="mx-auto flex h-[55px] w-full cursor-pointer items-center justify-center text-[13px] text-white transition-all duration-300"
            onClick={() => handleClick("/campaign")}
            onMouseEnter={() => handleMouseEnter("캠페인")}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`flex items-center justify-center rounded-xl p-2 transition-all duration-300 ${
                isActive("/campaign")
                  ? "w-[95%] bg-gray-500"
                  : isHovered === "캠페인"
                    ? "w-[90%] opacity-85"
                    : "h-[55px] w-[100%] p-4"
              }`}
            >
              {renderIcon("캠페인", isActive("/campaign"))}
              <div className="w-full pl-3 text-left">
                <span>캠페인</span>
              </div>
            </div>
          </div>
          {/* Campaign Submenus with Bold Active State */}
          <div className="flex w-full px-10 pb-[5px] text-[14px] text-white">
            <a
              href="/campaign"
              className={`w-full text-[14px] ${router.pathname === "/campaign" ? "font-bold" : ""}`}
            >
              - 캠페인 리스트
            </a>
          </div>
          <div className="flex w-full px-10 pb-[5px] text-[14px] text-white">
            <a
              href="/campaign/new"
              className={`w-full text-[14px] ${router.pathname === "/campaign/new" ? "font-bold" : ""}`}
            >
              - 캠페인 생성
            </a>
          </div>
          {/* <div className="flex w-full px-10 pb-[5px] text-[14px] text-white">
            <a
              href="/campaign/stats"
              className={`w-full text-[14px] ${router.pathname === "/campaign/stats" ? "font-bold" : ""}`}
            >
              - 캠페인 지표
            </a>
          </div> */}
          <div className="flex w-full px-10 pb-[5px] text-[14px] text-white">
            <a
              href="/campaign/report"
              className={`w-full text-[14px] ${router.pathname === "/campaign/report" ? "font-bold" : ""}`}
            >
              - 캠페인 상세 리포트
            </a>
          </div>
          <div className="flex w-full px-10 pb-[5px] text-[14px] text-white">
            <a
              href="/campaign/rewards"
              className={`w-full text-[14px] ${router.pathname === "/campaign/rewards" ? "font-bold" : ""}`}
            >
              - 캠페인 리워드 내역
            </a>
          </div>
        </div>
        <div className="py-4 pl-4 text-[14px] text-white">setting</div>
        <div className="main-menu pl-3">
          <div
            className="mx-auto flex h-[55px] w-full cursor-pointer items-center justify-center text-[13px] text-white transition-all duration-300"
            onClick={() => handleClick("/admin/usersearch")}
            onMouseEnter={() => handleMouseEnter("유저검색")}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`flex items-center justify-center rounded-xl p-2 transition-all duration-300 ${
                isActive("/admin/usersearch")
                  ? "w-[95%] bg-gray-500"
                  : isHovered === "유저검색"
                    ? "w-[90%] opacity-85"
                    : "h-[55px] w-[100%] p-4"
              }`}
            >
              {renderIcon("유저검색", isActive("/admin/usersearch"))}
              <div className="w-full pl-3 text-left">
                <span>유저검색</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-menu pl-3">
        {/* My Page */}
        <div
          className="mx-auto flex h-[55px] w-full cursor-pointer items-center justify-center text-[13px] text-white transition-all duration-300"
          onClick={() => handleClick("/admin/mypage")}
          onMouseEnter={() => handleMouseEnter("마이 페이지")}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`flex items-center justify-center rounded-xl p-2 transition-all duration-300 ${
              isActive("/admin/mypage")
                ? "w-[95%] bg-gray-500"
                : isHovered === "마이 페이지"
                  ? "w-[90%] opacity-85"
                  : "h-[55px] w-[100%] p-4"
            }`}
          >
            {renderIcon("마이 페이지", isActive("/admin/mypage"))}
            <div className="w-full pl-3 text-left">
              <span>마이 페이지</span>
            </div>
          </div>
        </div>

        <div className="setting-menu absolute bottom-[5%] w-full">
          <div className="flex w-full flex-col justify-center p-3">
            <label className="text-[12px] font-bold text-white">SHOP ID</label>
            <label className="text-[12px] text-white">{shop_id}</label>
          </div>
          <div
            className="flex h-[55px] w-full cursor-pointer items-center p-4 text-[13px] text-white transition-all duration-300"
            onClick={handleSignOut}
          >
            <div className="flex items-center pl-2">
              <LogoutIcon fontSize="small" />
              <div className="w-full pl-3 text-left text-[13px]">
                <span>로그아웃</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
