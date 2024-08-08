import Footer from "@/components/layout/base/Footer";
import Header from "@/components/layout/base/Header";
import Navbar from "@/components/layout/base/Navbar";
interface DashboarContainerProps {
  children: React.ReactNode;
  title: string;
}

const DashboardContainer: React.FC<DashboarContainerProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="pl-[200px] flex-grow flex flex-col overflow-auto">
        <Header title={title} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  );
};
export default DashboardContainer;
