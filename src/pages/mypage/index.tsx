import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { GetServerSidePropsContext } from "next";

const handleSubmit = async (event: React.FormEvent) => {
  const { id } = event.currentTarget;
  console.log("id", id);
};
const DetailsItem = (apiResponse: any, context: GetServerSidePropsContext) => {
  return (
    <DashboardContainer title="마이 페이지">
      <div className="flex flex-col sm:flex-row md:flex-row w-full justify-center md:space-x-4 lg:space-x-4">
        <ContentsContainer variant="campaign">my page</ContentsContainer>
        <ContentsContainer variant="campaign">test</ContentsContainer>
      </div>
    </DashboardContainer>
  );
};

export default DetailsItem;
