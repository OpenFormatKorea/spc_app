interface MainProps {
  //title: string;
  children: React.ReactNode;
}
const DashboardMain: React.FC<MainProps> = ({
  //title,
  children,
}) => {
  return (
    <div className="flex flex-col bg-gray-400 pt-[60px] lg:pt-0 lg:pl-[245px] pl-0 min-h-screen min-w-[400px]">
      <div className="w-full p-4 flex-grow flex">
        <div className="dashboard-main-box bg-gray-100 rounded-xl p-6 flex-grow">{children}</div>
      </div>
    </div>
    // <div className="flex flex-col pt-[60px] lg:pl-[245px] pl-0 min-h-screen min-w-[400px]">
    //   <div className="w-full bg-gray-100 p-6 sm:p-8 flex-grow">
    //     <div className="subject-container flex items-center justify-between px-1">
    //       <a className="text-[24px] flex items-center justify-between sm:text-[30px] font-bold min-w-[270px] h-[42px]">
    //         {title}
    //       </a>
    //     </div>
    //     {children}
    //   </div>
    // </div>
  );
};
export default DashboardMain;
