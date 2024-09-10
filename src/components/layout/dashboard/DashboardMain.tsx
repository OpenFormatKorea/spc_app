interface MainProps {
  title: string;
  children: React.ReactNode;
  onclick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onclickText: string;
  buttonId: string;
}
import AddIcon from "@mui/icons-material/Add";
const DashboardMain: React.FC<MainProps> = ({ title, children, onclick, onclickText, buttonId }) => {
  return (
    <div className="flex flex-col pt-[60px] lg:pl-[245px] pl-0 min-h-screen min-w-[400px]">
      <div className="w-full bg-gray-100 p-6 sm:p-8 flex-grow">
        <div className="subject-container flex items-center justify-between px-1">
          <a className="text-[24px] flex items-center justify-between sm:text-[30px] font-bold min-w-[270px] h-[42px]">
            {title}
          </a>

          {onclickText && (
            <div className="button-container w-full sm:w-auto text-right sm:ml-auto items-center flex">
              {buttonId === "create_item" && (
                <button
                  className="border p-2 text-white rounded-lg cursor-pointer bg-gray-400 mx-2"
                  onClick={onclick}
                  id={"cancel_create_item"}
                >
                  뒤로가기
                </button>
              )}

              <button
                className={`border p-2 text-white rounded-lg cursor-pointer flex items-center ${
                  buttonId === "cancel_modify_campaign" || buttonId === "back_campaign_details"
                    ? "bg-gray-400"
                    : "bg-blue-500"
                }`}
                onClick={onclick}
                id={buttonId}
              >
                {onclickText == "새 캠페인" ? (
                  <div className="pr-2 flex items-center">
                    <AddIcon fontSize="small" />
                  </div>
                ) : (
                  <></>
                )}

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
