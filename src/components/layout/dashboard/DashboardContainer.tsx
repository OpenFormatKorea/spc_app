import Footer from "@/components/layout/base/Footer";
import Header from "@/components/layout/base/Header";
import DashboardMain from "@/components/layout/dashboard/DashboardMain";
import Navbar from "@/components/layout/base/Navbar";
import { Main } from "next/document";
interface DashboarContainerProps {
  children: React.ReactNode;
  title: string;
  onclick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onclickText: string;
  buttonId: string;
}

const DashboardContainer: React.FC<DashboarContainerProps> = ({ title, children, onclick, onclickText, buttonId }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <Header title={title} />
      <DashboardMain
        title={title}
        children={children}
        onclick={onclick}
        onclickText={onclickText}
        buttonId={buttonId}
      />
      {/* <Footer /> */}
    </div>
  );
};
export default DashboardContainer;
