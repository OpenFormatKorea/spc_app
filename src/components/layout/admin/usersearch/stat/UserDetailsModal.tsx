import { RewardEligibilityType, UserSearchList } from "@/lib/admin/types";
import Modal from "@/components/layout/base/Modal";
import InputRadioBox from "@/components/base/InputRadio";
import { useEffect, useState } from "react";
import { fetchPutReWardEligibility } from "@/lib/admin/apis";
import { GetServerSidePropsContext } from "next";

interface UserDetailsProps {
  apiResponse: UserSearchList;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsProps> = (
  { apiResponse, isOpen, onClose },
  context: GetServerSidePropsContext,
) => {
  const campaignRecord: UserSearchList = apiResponse ?? {};

  const [rewardEligibility, setRewardEligibility] =
    useState<RewardEligibilityType>(campaignRecord.reward_eligibility);
  const [status, setStatus] = useState<string>(campaignRecord.status);
  const id = campaignRecord.id ?? "";
  const user_id = campaignRecord.user_id ?? "";
  const shop_id = campaignRecord.shop ?? "";
  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-center text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 text-sm border-b justify-center border-gray-200 whitespace-normal break-words break-all text-center h-full";

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRewardEligibility(e.target.value as RewardEligibilityType);
  const handleStatusRadioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStatus(e.target.value);

  const fetchData = async () => {
    await fetchPutReWardEligibility(
      user_id,
      rewardEligibility,
      status,
      context,
    );
  };

  const handleChangeReWardEligibility = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    try {
      fetchData();
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      onClose();
      alert("지급 방법이 변경되었습니다.");
      window.location.reload();
    }
  };

  useEffect(() => {
    setRewardEligibility(campaignRecord.reward_eligibility);
    setStatus(campaignRecord.status);
  }, [isOpen]);

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
                    <th className={theadStyle}>리워드 지급 조건</th>
                    <th className={theadStyle}>샵 ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={tbodyStyle}>
                    <td>{id}</td>
                    <td className={tbodyStyle}>{user_id}</td>
                    <td className={tbodyStyle}>
                      <div className="flex items-center justify-center">
                        {campaignRecord.status === "ACTIVE" ? (
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
                      <div className="m-2 flex h-full w-fit min-w-[120px] justify-center rounded-lg bg-gray-200 p-1 font-bold">
                        {campaignRecord.reward_eligibility === "ALL" && (
                          <span className="text-blue-400">모두 지급</span>
                        )}
                        {campaignRecord.reward_eligibility ===
                          "REFERRER_ONLY" && (
                          <span className="text-green-400">추천인 지급</span>
                        )}
                        {campaignRecord.reward_eligibility ===
                          "REFEREE_ONLY" && (
                          <span className="text-orange-400">피추천인 지급</span>
                        )}
                        {campaignRecord.reward_eligibility === "NONE" && (
                          <span className="text-red-400">미지급</span>
                        )}
                      </div>
                    </td>
                    <td className={tbodyStyle}>{shop_id}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex w-full gap-2 py-3 text-sm">
                <div className="w-full items-center">
                  <div>
                    <div className="w-full p-2 text-left font-bold">
                      활성화:{" "}
                    </div>
                    <div className="flex gap-2">
                      <InputRadioBox
                        label="활성화"
                        name="status"
                        value={"ACTIVE"}
                        checked={status === "ACTIVE"}
                        onChange={handleStatusRadioChange}
                        disabled={false}
                      />
                      <InputRadioBox
                        label="비활성화"
                        name="status"
                        value={"DELETED"}
                        checked={status === "DELETED"}
                        onChange={handleStatusRadioChange}
                        disabled={false}
                      />
                    </div>
                    <div className="w-full p-2 text-left font-bold">
                      리워드 지급 조건:{" "}
                    </div>
                    <div className="flex gap-2">
                      <InputRadioBox
                        label="모두 지급"
                        name="rewardEligibility"
                        value={RewardEligibilityType.ALL}
                        checked={
                          rewardEligibility === RewardEligibilityType.ALL
                        }
                        onChange={handleRadioChange}
                        disabled={false}
                      />
                      <InputRadioBox
                        label="추천인 지급"
                        name="rewardEligibility"
                        value={RewardEligibilityType.REFERRER}
                        checked={
                          rewardEligibility === RewardEligibilityType.REFERRER
                        }
                        onChange={handleRadioChange}
                        disabled={false}
                      />
                      <InputRadioBox
                        label="피추천인 지급"
                        name="rewardEligibility"
                        value={RewardEligibilityType.REFEREE}
                        checked={
                          rewardEligibility === RewardEligibilityType.REFEREE
                        }
                        onChange={handleRadioChange}
                        disabled={false}
                      />
                      <InputRadioBox
                        label="미지급"
                        name="rewardEligibility"
                        value={RewardEligibilityType.NONE}
                        checked={
                          rewardEligibility === RewardEligibilityType.NONE
                        }
                        onChange={handleRadioChange}
                        disabled={false}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="mt-auto h-fit w-[50px] rounded-md bg-blue-400 p-1 text-white"
                  onClick={handleChangeReWardEligibility}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
