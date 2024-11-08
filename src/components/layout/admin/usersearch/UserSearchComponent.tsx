import { UserSearchList } from "@/lib/admin/types";
import { removeWhiteSpace } from "@/lib/common";
import { StatsApiResponse } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";

interface UserSearchComponentProps {
  handleSearch: (e: React.MouseEvent<HTMLButtonElement>) => void;
  apiResponse: StatsApiResponse;
  userId: string;
  setUserId: (value: string) => void;
}

const UserSearchComponent: React.FC<UserSearchComponentProps> = (
  { handleSearch, apiResponse, userId, setUserId },
  context: GetServerSidePropsContext,
) => {
  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";

  useEffect(() => {
    const trimmedUserId = removeWhiteSpace(userId);
    if (trimmedUserId !== userId) {
      setUserId(trimmedUserId);
    }
  }, [userId]);

  return (
    <>
      <div className="mb-2 w-full pb-2">
        <div className="mb-2 flex w-full items-center border-b-[1px] pb-2">
          <div className="w-[80%]">
            <div className="text-lg font-bold">유저 검색</div>
            <div className="text-sm font-normal text-gray-500">
              유저 검색을 할 수 있어요.
            </div>
          </div>
        </div>
      </div>
      <div className="searchInputClass">
        <div className="flex w-full items-center justify-end py-2">
          <input
            type="text"
            id="userId"
            placeholder={"유저 아이디를 적어주세요"}
            value={userId}
            className="input-class w-full flex-grow border-b-[1px] py-2 text-sm lg:max-w-[450px]"
            onChange={(e) => setUserId(e.target.value)}
          />
          <button
            className={`min-w-[45px] cursor-pointer rounded-lg border bg-blue-500 p-1 text-center text-white`}
            onClick={handleSearch}
          >
            검색
          </button>
        </div>
        <div className="w-full py-2">
          <table className="w-full border border-gray-100 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className={theadStyle}>캠페인 ID</th>
                <th className={theadStyle}>활성화</th>
                <th className={theadStyle}>SHOP ID</th>
                <th className={theadStyle}>리워드 가능 여부</th>
              </tr>
            </thead>
            <tbody>
              {apiResponse.result && apiResponse.result.length > 0 ? (
                apiResponse.result.map((user: UserSearchList) => (
                  <tr key={user.id}>
                    <td className={tbodyStyle}>{user.user_id}</td>
                    <td className={tbodyStyle}>{user.status}</td>
                    <td className={tbodyStyle}>{user.shop}</td>
                    <td className={tbodyStyle}>{user.reward_eligibility}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className={tbodyStyle} colSpan={5}>
                    유저 데이터가 없습니다. <br />
                    유저를 검색해주세요
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserSearchComponent;
