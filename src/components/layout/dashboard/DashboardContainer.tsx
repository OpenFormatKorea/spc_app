import Header from "@/components/layout/base/Header";
import DashboardMain from "@/components/layout/dashboard/DashboardMain";
import Navbar from "@/components/layout/base/Navbar";
import { GetServerSidePropsContext } from "next";
import { getShopIdFromCookies } from "@/lib/helper";
import { useState, useEffect } from "react";
interface DashboardContainerProps {
  children: React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = (
  { children },
  context: GetServerSidePropsContext,
) => {
  const [shop_id, setShopId] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const shop_id = getShopIdFromCookies(context) || "";
    setShopId(shop_id);
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-gray-400 to-gray-500">
      <Navbar shop_id={shop_id} />
      <Header shop_id={shop_id} />
      <DashboardMain>{children}</DashboardMain>
    </div>
  );
};

export default DashboardContainer;
