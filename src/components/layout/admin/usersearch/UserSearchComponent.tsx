import UserSearchTable from "@/components/layout/admin/usersearch/UserSearchTable";
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
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
  setLoading,
  fetchUserSearch,
}) => {
  const theadStyle =
    "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";
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
  // const useScrollPosition = (elementId: string) => {
  //   const [isBottom, setIsBottom] = useState(false);
  //   useEffect(() => {
  //     const element = document.getElementById(elementId);
  //     if (!element) return;
  //     const handleScroll = () => {
  //       const isAtBottom =
  //         element.scrollTop + element.clientHeight >= element.scrollHeight - 5;
  //       setIsBottom(isAtBottom);
  //     };
  //     element.addEventListener("scroll", handleScroll, { passive: true });
  //     return () => {
  //       element.removeEventListener("scroll", handleScroll);
  //     };
  //   }, []);

  //   return isBottom;
  // };
  const { isBottom, scrollRef } = useScrollPosition(true);
  console.log(scrollRef);
  const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
  const totalCount = apiResponse.total_count || 0;
  const getNextPage = totalCount > stackedDataAmount;
  const [isLoading, setIsLoading] = useState(false);

  const fetchNextPage = async () => {
    if (!getNextPage || !scrollRef.current || isLoading) return;
    setIsLoading(true);
    const currentPage = (parseInt(pageNum) + 1).toString();

    try {
      const newData = await fetchUserSearch(userId, pageNum, pageSize);
      if (newData.result && newData.result.length > 0) {
        setUserSearchResults((prev) => [...prev, ...(newData.result || [])]);
      }
      setPageNum(currentPage);
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
              tbodyStyle={tbodyStyle}
            />
            {getNextPage ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex h-full items-center justify-center gap-4 py-2 text-center">
                    <label>
                      스크롤하면 더 많은 유저 정보를 보실 수 있습니다.
                    </label>
                  </div>
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
