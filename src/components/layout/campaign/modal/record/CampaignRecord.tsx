import { useMemo } from "react";
import { ProductListArgs } from "@/lib/item/types";
import Modal from "@/components/layout/base/Modal";
import {
  CampaignRecordApiResponse,
  CampaignRecordsProps,
} from "@/lib/campaign/types";

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
  const campaignRecords = useMemo(
    () => (Array.isArray(apiResponse.result) ? apiResponse.result : []),
    [apiResponse],
  );
  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 text-sm border-b border-gray-200 whitespace-normal break-words break-all text-center";
  const labelClass = "text-xs pt-4 text-gray-500";
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="w-full pb-2 text-left text-xl font-bold">상품 선택</h1>

        <div className="my-2 flex max-h-[550px] max-w-[370px] flex-col items-center overflow-y-scroll lg:max-w-full">
          <div className="flex w-full flex-col rounded-lg bg-white p-3">
            <h1 className="text-md w-full pb-2 text-left font-semibold text-gray-500">
              상품을 선택해 주세요
            </h1>

            <div className="block w-full py-3">
              <table className="table w-full border border-gray-100 text-center">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={theadStyle}>
                      {/* <input
                        type="checkbox"
                        id="item_all"
                        name="item_all"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      /> */}
                    </th>
                    <th className={theadStyle}>ID</th>
                    <th className={theadStyle}>shop_id</th>
                    <th className={theadStyle}>reward_trigger</th>
                    <th className={theadStyle}>reward_target</th>
                    <th className={theadStyle}>order_number</th>
                    <th className={theadStyle}>status</th>
                    <th className={theadStyle}>message</th>
                    <th className={theadStyle}>processed_by</th>
                    <th className={theadStyle}>created_at</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignRecords.map((record: CampaignRecordsProps) => (
                    <tr key={record.id}>
                      <td className={`${tbodyStyle} px-2`}>
                        <input
                          type="checkbox"
                          id={`cr_${record.id}`}
                          name={`cr_${record.id}`}
                          // checked={selectedItemList.includes(record.id)}
                          // onChange={handleCheckboxChange(record.id)}
                        />
                      </td>
                      <td className={tbodyStyle}>{record.id}</td>

                      <td className={tbodyStyle}>{record.shop_id}</td>
                      <td className={tbodyStyle}>{record.reward_trigger}</td>
                      <td className={tbodyStyle}>{record.reward_target}</td>
                      <td className={tbodyStyle}>{record.order_number}</td>
                      <td className={tbodyStyle}>{record.status}</td>
                      <td className={tbodyStyle}>{record.message}</td>
                      <td className={tbodyStyle}>{record.processed_by}</td>
                      <td className={tbodyStyle}>{record.created_at}</td>
                    </tr>
                  ))}
                  {!campaignRecords.length && (
                    <tr>
                      <td className={tbodyStyle} colSpan={4}>
                        현재 추가가능한 상품이 없어요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <button className="mt-4 w-full rounded-lg bg-blue-500 p-2 text-white">
          캠페인 테스트 버튼
        </button>
      </div>
    </Modal>
  );
};

export default CampaignRecord;
