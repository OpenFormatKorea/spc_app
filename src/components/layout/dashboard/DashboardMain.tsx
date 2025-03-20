interface MainProps {
  children: React.ReactNode;
}
const DashboardMain: React.FC<MainProps> = ({ children }) => {
  return (
    // <div className="flex min-h-screen min-w-full flex-col pl-0 pt-[60px] lg:pl-[245px] lg:pt-[15px]">
    //   <div className="absolute flex w-full flex-grow justify-center overflow-hidden lg:justify-start lg:px-[15px]">
    //     {/* <div className="dashboard-main-box overflow-hidden rounded-xl bg-gray-100 p-[12px] lg:fixed lg:h-[calc(100%-60px)] lg:w-[calc(100%-275px)]"> */}
    //     <div className="dashboard-main-box mx-[15px] h-full w-full rounded-xl bg-gray-100 p-[12px] lg:fixed lg:mx-0 lg:h-[calc(100%-60px)] lg:w-[calc(100%-275px)]">
    //       {children}
    //     </div>
    //   </div>
    // </div>

    <div className="flex min-h-[calc(100vh-60px)] flex-col pt-[60px] lg:pl-[245px] lg:pt-[15px]">
      <div className="absolute flex w-full min-w-[350px] flex-grow justify-center overflow-hidden px-[10px] lg:justify-start lg:px-[15px]">
        <div className="dashboard-main-box h-[calc(100%-250px)] w-full overflow-y-auto rounded-xl bg-gray-100 p-3 lg:fixed lg:mx-0 lg:h-[calc(100%-60px)] lg:w-[calc(100%-280px)] lg:overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
export default DashboardMain;
