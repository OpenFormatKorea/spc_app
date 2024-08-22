interface DashboardContentsProps {
  children: React.ReactNode;
}

const DashboardContents: React.FC<DashboardContentsProps> = ({ children }) => {
  return (
    <div className="body-container shadow-sm rounded-lg p-6 border-gray-200 border bg-white mt-4 w-full ">
      {children}
    </div>
  );
};
export default DashboardContents;
