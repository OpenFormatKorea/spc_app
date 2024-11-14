import { useMemo } from "react";
import {
  CampaignRecordApiResponse,
  CampaignRecordsProps,
} from "@/lib/campaign/types";
import BigModal from "@/components/layout/base/BigModal";

interface CampaignRecordProps {
  apiResponse: CampaignRecordApiResponse;
  isOpen: boolean;
  onClose: () => void;
}

const CampaignRecord: React.FC<CampaignRecordProps> = ({
  apiResponse,
  isOpen,
  onClose,
}) => {
  const campaignRecordsArray = apiResponse.data ?? { result: [] };
  const campaignRecords = useMemo(
    () =>
      Array.isArray(campaignRecordsArray.result)
        ? campaignRecordsArray.result
        : [],
    [apiResponse],
  );
  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-center text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 text-sm border-b justify-center border-gray-200 whitespace-normal break-words break-all text-center h-full";
  return (
    <BigModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="w-full pb-2 text-left text-xl font-bold">
          리워드 지급내역
        </h1>

        <div className="my-2 flex max-h-[550px] w-full flex-col items-center overflow-x-hidden overflow-y-scroll lg:max-w-full">
          <div className="flex w-full flex-col rounded-lg bg-white p-3">
            <h1 className="text-md w-full pb-2 text-left font-semibold text-gray-500">
              리워드 지급 내역 리스트입니다
            </h1>

            <div className="block w-full py-3">
              <table className="table w-full border border-gray-100 text-center">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={theadStyle}>ID</th>
                    <th className={theadStyle}>샵 ID</th>
                    <th className={theadStyle}>지급방식</th>
                    <th className={theadStyle}>지급대상</th>
                    <th className={theadStyle}>주문번호</th>
                    <th className={theadStyle}>지급여부</th>
                    {/* <th className={theadStyle}>message</th> */}
                    <th className={theadStyle}>자동/수동지급</th>
                    <th className={theadStyle}>지급날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignRecords.map((record: CampaignRecordsProps) => (
                    <tr key={record.id}>
                      <td className={tbodyStyle}>{record.id}</td>
                      <td className={tbodyStyle}>{record.shop_id}</td>
                      <td className={tbodyStyle}>
                        <div className="flex items-center justify-center">
                          {record.reward_trigger === "SIGNUP" ? (
                            <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-orange-400">
                              회원가입
                            </div>
                          ) : (
                            <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-green-400">
                              구매
                            </div>
                          )}
                        </div>
                      </td>
                      <td className={tbodyStyle}>
                        <div className="flex items-center justify-center">
                          {record.reward_target === "referrer" ? (
                            <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-blue-400">
                              추천인
                            </div>
                          ) : (
                            <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-gray-500">
                              피추천인
                            </div>
                          )}
                        </div>
                      </td>

                      <td className={tbodyStyle}>{record.order_number}</td>
                      <td className={tbodyStyle}>
                        <div className="flex items-center justify-center">
                          {record.status === "SUCCESS" ? (
                            <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-blue-400">
                              지급완료
                            </div>
                          ) : (
                            <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-red-400">
                              지급실패
                            </div>
                          )}
                        </div>
                      </td>
                      {/* <td className={tbodyStyle}>{record.message}</td> */}
                      <td className={tbodyStyle}>
                        <div className="flex items-center justify-center">
                          {record.processed_by === "SYSTEM" ? (
                            <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-blue-400">
                              자동지급
                            </div>
                          ) : (
                            <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-200 p-1 font-bold text-yellow-400">
                              수동지급
                            </div>
                          )}
                        </div>
                      </td>
                      <td className={tbodyStyle}>
                        {new Date(record.created_at).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </td>
                    </tr>
                  ))}
                  {!campaignRecords.length && (
                    <tr>
                      <td className={tbodyStyle} colSpan={9}>
                        현재 추가가능한 상품이 없어요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* 
        <button className="mt-4 w-full rounded-lg bg-blue-500 p-2 text-white">
          캠페인 테스트 버튼
        </button> */}
      </div>
    </BigModal>
  );
};

export default CampaignRecord;
