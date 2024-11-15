import { UserSearchList } from "@/lib/admin/types";
import Modal from "@/components/layout/base/Modal";

interface UserDetailsProps {
  apiResponse: UserSearchList;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsProps> = ({
  apiResponse,
  isOpen,
  onClose,
}) => {
  const campaignRecord: UserSearchList = apiResponse ?? {};
  const id = campaignRecord.id ?? "";
  const user_id = campaignRecord.user_id ?? "";
  const status = campaignRecord.status ?? "";
  const shop_id = campaignRecord.shop ?? "";
  const reward_eligibility = campaignRecord.reward_eligibility ?? "";
  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-center text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 text-sm border-b justify-center border-gray-200 whitespace-normal break-words break-all text-center h-full";
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="w-full pb-2 text-left text-xl font-bold">
          유저 상세 정보
        </h1>

        <div className="my-2 flex max-h-[550px] w-full flex-col items-center overflow-x-hidden overflow-y-scroll lg:max-w-full">
          <div className="flex w-full flex-col rounded-lg bg-white p-3">
            <h1 className="text-md w-full pb-2 text-left font-semibold text-gray-500">
              {user_id}님의 상세 정보 입니다
            </h1>

            <div className="block w-full py-3">
              <table className="table w-full border border-gray-100 text-center">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={theadStyle}>ID</th>
                    <th className={theadStyle}>사용자 ID</th>
                    <th className={theadStyle}>활성화</th>
                    <th className={theadStyle}>숍 ID</th>
                    <th className={theadStyle}>
                      리워드 지급
                      <br />
                      가능 여부
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={id}>
                    <td className={tbodyStyle}>{id}</td>
                    <td className={tbodyStyle}>{user_id}</td>
                    <td className={tbodyStyle}>
                      <div className="flex items-center justify-center">
                        {status === "ACTIVE" ? (
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
                        {reward_eligibility === "ALL" ? (
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
                    <td className={tbodyStyle}>{shop_id}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
