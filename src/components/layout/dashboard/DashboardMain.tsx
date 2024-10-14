interface MainProps {
  children: React.ReactNode;
}
const DashboardMain: React.FC<MainProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen min-w-full flex-col pl-0 pt-[60px] lg:pl-[245px] lg:pt-0">
      <div className="flex w-full flex-grow p-4">
        <div className="dashboard-main-box flex-grow rounded-xl bg-gray-100 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
export default DashboardMain;
