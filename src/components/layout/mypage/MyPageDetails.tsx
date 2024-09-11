import { GetServerSidePropsContext } from "next";

interface MyPageProps {
  username: string;
  email: string;
}

const MyPageDetails: React.FC<MyPageProps> = ({ username, email }, context: GetServerSidePropsContext) => {
  return (
    <div className="contents-container w-full justify-center items-center">
      <div className="flex py-1">
        <div className="text-2xl font-bold">{username}</div>
      </div>
      <div className="flex py-1">
        <div>{email}</div>
      </div>
    </div>
  );
};

export default MyPageDetails;
