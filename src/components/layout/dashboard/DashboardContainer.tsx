import Header from "@/components/layout/base/Header";
import DashboardMain from "@/components/layout/dashboard/DashboardMain";
import Navbar from "@/components/layout/base/Navbar";
import { getShopIdFromCookies } from "@/lib/helper";
import { fetchGetItemDetails } from "@/lib/item/apis";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const shop_id = getShopIdFromCookies(context);
  return {
    props: {
      shop_id,
    },
  };
};
interface DashboarContainerProps {
  children: React.ReactNode;
  shop_id: string;
}

const DashboardContainer: React.FC<DashboarContainerProps> = ({ children, shop_id }) => {
  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-400 to-gray-500">
      <Navbar shop_id={shop_id} />
      <Header shop_id={shop_id} />
      <DashboardMain children={children} />
    </div>
  );
};
export default DashboardContainer;
