import Footer from "@/components/layout/base/Footer";
import Header from "@/components/layout/base/Header";
import DashboardMain from "@/components/layout/dashboard/DashboardMain";
import Navbar from "@/components/layout/base/Navbar";
import { Main } from "next/document";
interface DashboarContainerProps {
  children: React.ReactNode;
  title: string;
}

const DashboardContainer: React.FC<DashboarContainerProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Header title={title} />
      <DashboardMain children={children} />
      {/* <Footer /> */}
    </div>
  );
};
export default DashboardContainer;
