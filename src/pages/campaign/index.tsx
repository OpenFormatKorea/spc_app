import DashboardContainer from "@/components/layout/base/DashboardContainer";

// src/pages/index.tsx
const Dashboard: React.FC = () => {
  return (
    <DashboardContainer title={"대시보드"}>
      <div className="inline-block w-full">
        <div className="h2-header p-2 w-100 h-14 flex items-center font-bold">
          <h2>Hello, World!</h2>
        </div>
        <div className="body-containter p-2 w-100 h-[50%] bg-blue-100 flex-grow flex flex-col overflow-auto">
          THIS IS THE BODY PART
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
