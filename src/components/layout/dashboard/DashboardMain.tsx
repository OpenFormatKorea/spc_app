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
  );
};
export default DashboardMain;
