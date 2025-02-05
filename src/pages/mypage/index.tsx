import ContentsContainer from "@/components/layout/base/ContentsContainer";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import MyPageDetails from "@/components/layout/mypage/MyPageDetails";
import { withAuth } from "@/hoc/withAuth";
import { fetchGetUserInfo } from "@/lib/mypage/apis";
import { UserInfoProps } from "@/lib/mypage/types";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { GetServerSideProps } from "next";
import router from "next/router";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetchGetUserInfo(context);
  return { props: { data } };
};
const DetailsMyPage = (data: UserInfoProps) => {
  const userInfo = data.data;
  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;
    if (id === "back_dashboard") {
      router.push("/dashboard");
    }
  };
  return (
    <DashboardContainer>
      <div className="mb-[8px] flex h-[42px] w-full items-center justify-between">
        <div className="subject-container flex w-full">
          <div className="text-2xl font-bold">마이 페이지</div>
        </div>

        <div className="button-container flex w-full justify-end">
          <button
            className="flex cursor-pointer items-center justify-center rounded-lg border bg-gray-400 p-2 text-white"
            onClick={handleSubmit}
            id="back_dashboard"
          >
            <ArrowBackIosIcon fontSize="small" />
            <span className="ml-1 hidden">뒤로가기</span>
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center sm:flex-row md:flex-row md:space-x-4 lg:space-x-4">
        <ContentsContainer variant="dashboard">
          <MyPageDetails
            username={userInfo.username}
            email={userInfo.email}
          ></MyPageDetails>
        </ContentsContainer>
      </div>
    </DashboardContainer>
  );
};
export default withAuth(DetailsMyPage);
