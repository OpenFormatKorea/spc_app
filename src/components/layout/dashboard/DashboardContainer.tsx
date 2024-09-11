import Header from "@/components/layout/base/Header";
import DashboardMain from "@/components/layout/dashboard/DashboardMain";
import Navbar from "@/components/layout/base/Navbar";
interface DashboarContainerProps {
  children: React.ReactNode;
}

const DashboardContainer: React.FC<DashboarContainerProps> = ({ children }) => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <Header />
      <DashboardMain children={children} />
    </div>
  );
};
export default DashboardContainer;
