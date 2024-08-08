// Navmenu.tsx
import React from "react";
import { useRouter } from "next/router";

interface NavmenuProps {
  menutitle: string;
  link: string;
}

const Navmenu: React.FC<NavmenuProps> = ({ link, menutitle }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(link);
  };

  return (
    <div className="h-[50px] flex items-center justify-center  text-xl cursor-pointer" onClick={handleClick}>
      {menutitle}
    </div>
  );
};

export default Navmenu;
