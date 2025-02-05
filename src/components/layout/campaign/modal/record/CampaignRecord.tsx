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
        <div className="my-2 flex max-h-[550px] w-full flex-col items-center lg:max-w-full">
          <div className="flex w-full flex-col overflow-x-hidden overflow-y-scroll bg-white p-[8px]">
            <table className="table w-full border border-gray-100 text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className={theadStyle}>ID</th>
                  <th className={theadStyle}>샵 ID</th>
                  <th className={theadStyle}>지급방식</th>
                  <th className={theadStyle}>지급대상</th>
                  <th className={theadStyle}>주문번호</th>
                  <th className={theadStyle}>지급여부</th>
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
                          <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-orange-400 p-1 font-bold text-white">
                            회원가입
                          </div>
                        ) : (
                          <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-green-400 p-1 font-bold text-white">
                            구매
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={tbodyStyle}>
                      <div className="flex items-center justify-center">
                        {record.reward_target === "referrer" ? (
                          <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-blue-400 p-1 font-bold text-white">
                            추천인
                          </div>
                        ) : (
                          <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-500 p-1 font-bold text-white">
                            피추천인
                          </div>
                        )}
                      </div>
                    </td>

                    <td className={tbodyStyle}>{record.order_number}</td>
                    <td className={tbodyStyle}>
                      <div className="flex items-center justify-center">
                        {record.status === "SUCCESS" ? (
                          <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-blue-400 p-1 font-bold text-white">
                            지급완료
                          </div>
                        ) : (
                          <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-red-400 p-1 font-bold text-white">
                            지급실패
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={tbodyStyle}>
                      <div className="flex items-center justify-center">
                        {record.processed_by === "SYSTEM" ? (
                          <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-blue-400 p-1 font-bold text-white">
                            자동지급
                          </div>
                        ) : (
                          <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-yellow-400 p-1 font-bold text-white">
                            수동지급
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={tbodyStyle}>
                      {new Date(record.created_at).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
        {/* 
        <button className="mt-4 w-full rounded-lg bg-blue-500 p-2 text-white">
          캠페인 테스트 버튼
        </button> */}
      </div>
    </BigModal>
  );
};

export default CampaignRecord;
