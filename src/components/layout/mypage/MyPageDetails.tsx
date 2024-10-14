import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSidePropsContext } from "next";

interface MyPageProps {
  username: string;
  email: string;
}

const MyPageDetails: React.FC<MyPageProps> = (
  { username, email },
  context: GetServerSidePropsContext,
) => {
  const shop_id = getShopIdFromCookies(context);
  return (
    <div className="contents-container w-full items-center justify-center">
      <div className="flex py-1">
        <span className="text-2xl font-bold">{username}</span>
      </div>
      <div className="rounded-lg bg-gray-100 p-4">
        <div className="py-2">
          <label className="mr-2 text-xs text-gray-500">이메일</label>
          <span className="flex min-h-[40px] max-w-[350px] items-center bg-white p-2 text-sm text-gray-600">
            {email}
          </span>
        </div>
        <div className="py-2">
          <label className="mr-2 text-xs text-gray-500">SHOP ID:</label>
          <span className="flex min-h-[40px] max-w-[350px] items-center bg-white p-2 text-sm text-gray-600">
            {shop_id}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyPageDetails;
