interface DashboardContentsProps {
  children: React.ReactNode;
}

const CampaignContents: React.FC<DashboardContentsProps> = ({ children }) => {
  return (
    <div className="campaign-container shadow-sm rounded-lg p-6 border-gray-200 border bg-white mt-4 m-2 w-full lg:w-[50%]">
      {children}
    </div>
  );
};
export default CampaignContents;
