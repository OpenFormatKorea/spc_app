// import { useEffect, useState } from "react";
// import {
//   CampaignApiResponse,
//   CampaignRecordsProps,
//   ReferralItem,
// } from "@/lib/campaign/types";
// import BigModal from "@/components/layout/base/BigModal";
// import { fetchPostCampaignRecords } from "@/lib/campaign/apis";
// import { GetServerSidePropsContext } from "next";
// import { useScrollPosition } from "@/lib/infinitescrollFunctions";

// interface CampaignRecordProps {
//   apiResponse: CampaignApiResponse;
//   isOpen: boolean;
//   onClose: () => void;
//   campaign_id: string;
//   pageSize: string;
//   pageNum: string;
//   setPageNum: React.Dispatch<React.SetStateAction<string>>;
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const CampaignRecord: React.FC<CampaignRecordProps> = (
//   { apiResponse, isOpen, onClose, campaign_id, pageSize, pageNum, setPageNum },
//   context: GetServerSidePropsContext,
// ) => {
//   console.log("campaignRecords apiresponse,", apiResponse);

//   const [campaignRecords, setCampaignRecords] = useState<
//     CampaignRecordsProps[]
//   >(apiResponse?.result ?? []);
//   // 무한 스크롤
//   const { isBottom, scrollRef } = useScrollPosition(isOpen);
//   const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
//   const totalCount = apiResponse?.data?.total_count || 0;
//   const getNextPage = totalCount > stackedDataAmount;
//   const [isLoading, setIsLoading] = useState(false);

//   // const fetchNextPage = async () => {
//   //   if (!getNextPage || !scrollRef.current || isLoading) return;
//   //   setIsLoading(true);
//   //   const currentPage = (parseInt(pageNum) + 1).toString();

//   //   try {
//   //     const newData = await fetchPostCampaignRecords(
//   //       campaign_id,
//   //       currentPage,
//   //       pageSize,
//   //       "",
//   //       "",
//   //       context,
//   //     );
//   //     if (newData.data?.result && newData.data?.result.length > 0) {
//   //       setCampaignRecords((prev) => [...prev, ...newData.data?.result]);
//   //     }
//   //     setPageNum(currentPage);
//   //   } catch (error) {
//   //     console.error("Failed to fetch next page:", error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   if (isBottom) {
//   //     fetchNextPage();
//   //   }
//   // }, [isBottom]);

//   const theadStyle =
//     "px-6 py-3 border-b border-gray-200 text-center text-sm font-medium text-gray-700 text-center";
//   const tbodyStyle =
//     "px-3 py-2 text-sm border-b justify-center border-gray-200 whitespace-normal break-words break-all text-center h-full";
//   return (
//     <BigModal isOpen={isOpen} onClose={onClose}>
//       <div className="flex flex-col items-center justify-center text-center">
//         <h1 className="w-full pb-2 text-left text-xl font-bold">
//           리워드 지급내역
//         </h1>
//         <div className="my-2 flex max-h-[550px] w-full flex-col items-center lg:max-w-full">
//           <div
//             ref={scrollRef}
//             id="CRTableDiv"
//             className="flex w-full flex-col overflow-x-hidden overflow-y-scroll rounded-xl bg-white p-[8px]"
//           >
//             <table className="table w-full border border-gray-100 text-center">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className={theadStyle}>ID</th>
//                   <th className={theadStyle}>샵 ID</th>
//                   <th className={theadStyle}>지급방식</th>
//                   <th className={theadStyle}>지급대상</th>
//                   <th className={theadStyle}>주문번호</th>
//                   <th className={theadStyle}>지급여부</th>
//                   <th className={theadStyle}>자동/수동지급</th>
//                   <th className={theadStyle}>지급날짜</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {campaignRecords.map((record: CampaignRecordsProps) => (
//                   <tr key={record.id}>
//                     <td className={tbodyStyle}>{record.id}</td>
//                     <td className={tbodyStyle}>{record.shop_id}</td>
//                     <td className={tbodyStyle}>
//                       <div className="flex items-center justify-center">
//                         {record.reward_trigger === "SIGNUP" ? (
//                           <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-orange-400 p-1 font-bold text-white">
//                             회원가입
//                           </div>
//                         ) : (
//                           <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-green-400 p-1 font-bold text-white">
//                             구매
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className={tbodyStyle}>
//                       <div className="flex items-center justify-center">
//                         {record.reward_target === "referrer" ? (
//                           <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-blue-400 p-1 font-bold text-white">
//                             추천인
//                           </div>
//                         ) : (
//                           <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-gray-500 p-1 font-bold text-white">
//                             피추천인
//                           </div>
//                         )}
//                       </div>
//                     </td>

//                     <td className={tbodyStyle}>{record.order_number}</td>
//                     <td className={tbodyStyle}>
//                       <div className="flex items-center justify-center">
//                         {record.status === "SUCCESS" ? (
//                           <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-blue-400 p-1 font-bold text-white">
//                             지급완료
//                           </div>
//                         ) : (
//                           <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-red-400 p-1 font-bold text-white">
//                             지급실패
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className={tbodyStyle}>
//                       <div className="flex items-center justify-center">
//                         {record.processed_by === "SYSTEM" ? (
//                           <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-blue-400 p-1 font-bold text-white">
//                             자동지급
//                           </div>
//                         ) : (
//                           <div className="m-2 flex h-full w-fit min-w-[60px] justify-center rounded-lg bg-yellow-400 p-1 font-bold text-white">
//                             수동지급
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className={tbodyStyle}>
//                       {new Date(record.created_at).toLocaleDateString("ko-KR", {
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       })}
//                     </td>
//                   </tr>
//                 ))}
//                 {getNextPage ? (
//                   <tr>
//                     <td colSpan={9} className="py-4 text-center">
//                       스크롤하면 더 많은 캠페인 통계를 보실 수 있습니다.
//                     </td>
//                   </tr>
//                 ) : (
//                   <></>
//                 )}
//                 {!campaignRecords.length && (
//                   <tr>
//                     <td className={tbodyStyle} colSpan={9}>
//                       현재 추가가능한 상품이 없어요.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </BigModal>
//   );
// };

// export default CampaignRecord;
