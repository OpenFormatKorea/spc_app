import Header from "@/components/layout/base/Header";
import DashboardMain from "@/components/layout/dashboard/DashboardMain";
import Navbar from "@/components/layout/base/Navbar";
interface DashboarContainerProps {
  children: React.ReactNode;
  title: string;
}

const DashboardContainer: React.FC<DashboarContainerProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <Header title={title} />
      <DashboardMain title={title} children={children} />
    </div>
  );
};
export default DashboardContainer;
