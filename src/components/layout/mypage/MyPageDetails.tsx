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
      <div className="">
        <span className="text-2xl font-bold">{username}님, 안녕하세요!</span>
      </div>
      <div className="py-1">
        <span className="text-sm text-gray-500">* 내 정보를 확인해보세요</span>
      </div>
      <div className="rounded-lg bg-gray-100 p-4">
        <div className="">
          <span className="text-lg font-bold">내 정보</span>
        </div>
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
