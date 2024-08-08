import DashboardContainer from "@/components/layout/base/DashboardContainer";

// src/pages/index.tsx
const Campaign: React.FC = () => {
  return (
    <DashboardContainer title={"캠페인"}>
      <div className="inline-block w-full overflow-auto">
        <div className="h2-header p-4 w-100 h-14 flex items-center font-bold">
          <h2>캠페인 PAGE</h2>
        </div>
        <div className="body-container p-2 m-2 flex flex-wrap w-full h-full overflow-auto">
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
          <div className="example-container min-w-[250px] min-h-[250px] flex-grow m-3 p-4 bg-blue-100">hello</div>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Campaign;
