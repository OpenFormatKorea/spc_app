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
    <div className="flex flex-col mt-[60px] lg:pl-[250px] pl-0 min-h-screen">
      <div className="w-full bg-gray-100 p-4 sm:p-8 flex-grow">
        <div className="subject-container flex flex-col sm:flex-row sm:items-center justify-between">
          <a className="text-[24px] sm:text-[30px] font-bold">{title}</a>
          {onclickText && (
            <div className="button-container w-full sm:w-auto text-right mt-4 sm:mt-0 sm:ml-auto">
              <button
                className={`border p-2 text-white rounded-lg cursor-pointer ${
                  buttonId === "cancel_modify_campaign" ? "bg-gray-400" : "bg-blue-500"
                }`}
                onClick={onclick}
                id={buttonId}
              >
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
