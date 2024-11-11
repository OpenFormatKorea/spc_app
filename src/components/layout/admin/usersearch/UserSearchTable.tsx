import { UserSearchList } from "@/lib/admin/types";

interface UserSearchTableProps {
  tbodyStyle: string;
  userSearchResults: UserSearchList[];
}

const UserSearchTable: React.FC<UserSearchTableProps> = ({
  tbodyStyle,
  userSearchResults,
}) => {
  return (
    <>
      {userSearchResults.length > 0 ? (
        userSearchResults.map((user: UserSearchList) => (
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
    </>
  );
};

export default UserSearchTable;
