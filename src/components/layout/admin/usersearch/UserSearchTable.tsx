import { UserSearchList } from "@/lib/admin/types";

interface UserSearchTableProps {
  tbodyStyle: string;
  userSearchResults: UserSearchList[];
  handleUserDetail: (userId: string) => void;
}

const UserSearchTable: React.FC<UserSearchTableProps> = ({
  tbodyStyle,
  userSearchResults,
  handleUserDetail,
}) => {
  return (
    <>
      {userSearchResults.length > 0 ? (
        userSearchResults.map((user: UserSearchList) => (
          <tr
            onClick={() => handleUserDetail(user.user_id)}
            className="h-[3vh] cursor-pointer"
          >
            <td className={tbodyStyle}>{user.id}</td>
            <td className={tbodyStyle}>{user.user_id}</td>
            <td className={tbodyStyle}>
              <div className="flex items-center justify-center">
                {user.status === "ACTIVE" ? (
                  <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-green-400">
                    활성화
                  </div>
                ) : (
                  <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-orange-400">
                    비활성화
                  </div>
                )}
              </div>
            </td>
            <td className={tbodyStyle}>
              <div className="flex items-center justify-center">
                {user.reward_eligibility === "ALL" ? (
                  <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-blue-400">
                    지급가능
                  </div>
                ) : (
                  <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-red-400">
                    지급불가능
                  </div>
                )}
              </div>
            </td>
            <td className={tbodyStyle}>{user.shop}</td>
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
    </>
  );
};

export default UserSearchTable;
