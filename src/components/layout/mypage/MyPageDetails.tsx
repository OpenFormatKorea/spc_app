import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSidePropsContext } from "next";

interface MyPageProps {
  username: string;
  email: string;
}

const MyPageDetails: React.FC<MyPageProps> = ({ username, email }, context: GetServerSidePropsContext) => {
  const shop_id = getShopIdFromCookies(context);
  console.log("shop_id", shop_id);
  return (
    <div className="contents-container w-full justify-center items-center">
      <div className="flex py-1">
        <span className="text-2xl font-bold">{username}</span>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg">
        <div className="py-2">
          <label className="mr-2 text-xs text-gray-500">이메일</label>
          <span className="flex p-2 max-w-[350px] min-h-[40px] items-center bg-white text-gray-600 text-sm">
            {email}
          </span>
        </div>
        <div className="py-2">
          <label className="mr-2 text-xs text-gray-500">SHOP ID:</label>
          <span className="flex p-2 max-w-[350px] min-h-[40px] items-center bg-white text-gray-600 text-sm">
            {shop_id}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyPageDetails;
