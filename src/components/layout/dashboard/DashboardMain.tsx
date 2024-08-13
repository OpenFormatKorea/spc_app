import { deleteCookie, getCookie, setCookie } from "cookies-next";
import router from "next/router";
interface MainProps {
  title: string;
  children: React.ReactNode;
  onclick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onclickText: string;
  buttonId: string;
}

const DashboardMain: React.FC<MainProps> = ({ title, children, onclick, onclickText, buttonId }) => {
  return (
    <div className="pl-[200px] mt-[60px] flex flex-col" style={{ height: "calc(100vh - 60px)" }}>
      <div className="w-full bg-gray-100 p-10 flex-grow">
        <div className="header-container flex items-center p-2">
          <div className="text-[30px] font-bold w-1/2">
            <h2>{title}</h2>
          </div>
          {onclickText !== "" && (
            <div className="button-container w-full text-right">
              <button className="border p-2 bg-blue-500 text-white rounded-lg" onClick={onclick} id={buttonId}>
                {onclickText}
              </button>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
export default DashboardMain;
