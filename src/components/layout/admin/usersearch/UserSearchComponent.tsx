import UserSearchTable from "@/components/layout/admin/usersearch/UserSearchTable";
import { theadStyle } from "@/interfaces/tailwindCss";
import { UserDataApiResponse, UserSearchList } from "@/lib/admin/types";
import { removeWhiteSpace } from "@/lib/common";
import { useScrollPosition } from "@/lib/infinitescrollFunctions";
import { useState, useRef, KeyboardEvent, useEffect } from "react";

interface UserSearchComponentProps {
  handleSearch: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleUserDetail: (userId: string) => void;
  apiResponse: UserDataApiResponse;
  userId: string;
  setUserId: (value: string) => void;
  pageSize: string;
  pageNum: string;
  setPageNum: React.Dispatch<React.SetStateAction<string>>;
  fetchUserSearch: (
    userId: string,
    pageNum: string,
    pageSize: string,
  ) => Promise<UserDataApiResponse>;
}

const UserSearchComponent: React.FC<UserSearchComponentProps> = ({
  handleSearch,
  handleUserDetail,
  apiResponse,
  userId,
  setUserId,
  pageSize,
  pageNum,
  setPageNum,
  fetchUserSearch,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };
  const [userSearchResults, setUserSearchResults] = useState<UserSearchList[]>(
    apiResponse?.result ?? [],
  );

  const { isBottom, scrollRef } = useScrollPosition(true);
  const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
  const [totalCount, setTotalCount] = useState<number>(
    apiResponse.total_count || 0,
  );
  const totalCountRef = useRef<number>(apiResponse.total_count || 0);
  const getNextPage = totalCount > stackedDataAmount;
  const [isLoading, setIsLoading] = useState(false);

  // **Update userSearchResults when newApiResponse changes**
  useEffect(() => {
    setUserSearchResults(apiResponse?.result ?? []);
  }, [apiResponse]);

  const fetchNextPage = async () => {
    if (!getNextPage || !scrollRef.current || isLoading) return;

    setIsLoading(true);
    const nextPageNum = (parseInt(pageNum) + 1).toString(); // 현재 페이지 +1 계산

    try {
      const newData = await fetchUserSearch(userId, nextPageNum, pageSize); // 새로운 페이지 데이터를 fetch

      if (newData.result && newData.result.length > 0) {
        setUserSearchResults((prev) => [...prev, ...(newData.result || [])]); // 새로운 데이터를 기존 데이터에 추가
        setPageNum(nextPageNum); // 페이지 넘버 업데이트
      }

      if (newData.total_count) {
        totalCountRef.current = newData.total_count;
      }
    } catch (error) {
      console.error("Failed to fetch next page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUserId(removeWhiteSpace(userId));
  }, [userId]);

  useEffect(() => {
    if (isBottom) {
      fetchNextPage();
    }
  }, [isBottom]);

  return (
    <>
      <div className="flex w-full pb-[5px]">
        <div className="mb-2 flex w-full items-center border-b-[1px] pb-[5px]">
          <div className="w-[80%]">
            <div className="text-lg font-bold">유저 검색</div>
            <div className="text-sm font-normal text-gray-500">
              유저 검색을 할 수 있어요.
            </div>
          </div>
        </div>
      </div>
      <div className="mb-[10px] flex w-full items-center justify-end gap-2">
        <input
          type="text"
          id="userId"
          placeholder="유저 아이디를 적어주세요"
          value={userId}
          className="input-class w-full flex-grow border-b-[1px] py-2 text-sm lg:max-w-[450px]"
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          ref={buttonRef}
          className="min-w-[45px] cursor-pointer rounded-lg border bg-blue-500 text-center text-white"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>
      <div ref={scrollRef} className="h-full w-full overflow-y-auto py-2">
        <table className="w-full border border-gray-100 text-center lg:table">
          <thead>
            <tr className="bg-gray-100">
              <th className={theadStyle}>ID No.</th>
              <th className={theadStyle}>유저 ID</th>
              <th className={theadStyle}>활성화</th>
              <th className={theadStyle}>리워드 지급 조건</th>
              <th className={theadStyle}>샵 ID</th>
            </tr>
          </thead>
          <tbody>
            <UserSearchTable
              userSearchResults={userSearchResults}
              handleUserDetail={handleUserDetail}
            />
            {getNextPage ? (
              <tr>
                <td colSpan={5} className="p-[10px] text-center">
                  스크롤하면 더 많은 유저리스트를 보실 수 있습니다.{" "}
                  <button
                    onClick={() => fetchNextPage()}
                    className="items-center justify-center rounded-lg border bg-blue-500 px-[6px] py-[4px] text-white hover:bg-blue-700"
                  >
                    더보기
                  </button>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserSearchComponent;
