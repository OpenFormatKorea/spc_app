import UserSearchTable from "@/components/layout/admin/usersearch/UserSearchTable";
import { UserSearchList } from "@/lib/admin/types";
import { removeWhiteSpace } from "@/lib/common";
import { StatsApiResponse } from "@/lib/types";
import { useState, useEffect, useRef, KeyboardEvent } from "react";

interface UserSearchComponentProps {
  handleSearch: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleUserDetail: (userId: string) => void;
  apiResponse: StatsApiResponse;
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
  ) => Promise<StatsApiResponse>;
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

  const [userSearchResults, setUserSearchResults] = useState<UserSearchList[]>(
    apiResponse?.result ?? [],
  );
  const useScrollPosition = (elementId: string) => {
    const [isBottom, setIsBottom] = useState(false);
    useEffect(() => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const handleScroll = () => {
        const isAtBottom =
          element.scrollTop + element.clientHeight >= element.scrollHeight;
        setIsBottom(isAtBottom);
      };

      const viewportHeight = window.innerHeight;
      const elementHeight = element.scrollHeight;
      console.log("viewportHeight", viewportHeight);
      console.log("elementHeight", elementHeight);

      element.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return isBottom;
  };

  const scrollPosition = useScrollPosition("tableDiv");
  const stackedDataAmount = parseInt(pageNum) * parseInt(pageSize);
  const totalCount = apiResponse.total_count || 0;
  const getNextPage = () => {
    if (totalCount >= stackedDataAmount) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const isNextPage = getNextPage();
    const nextPageNum = (parseInt(pageNum) + 1).toString();

    if (isNextPage && scrollPosition) {
      setLoading(true);
      try {
        fetchUserSearch(userId, pageNum, "1").then((newData) => {
          setUserSearchResults((prev) => [...prev, ...(newData.result || [])]);
          setPageNum(nextPageNum);
        });
      } finally {
        setLoading(false);
      }
    }
  }, [scrollPosition]);

  useEffect(() => {
    setUserId(removeWhiteSpace(userId));
  }, [userId]);

  useEffect(() => {
    return setUserSearchResults(apiResponse.result ?? []);
  }, [apiResponse]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  return (
    <div
      id="tableDiv"
      className="overflow-y-auto"
      style={{ maxHeight: "70vh" }}
    >
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
      <div className="searchInputClass">
        <div className="flex w-full items-center justify-end gap-2">
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
            className="min-w-[45px] cursor-pointer rounded-lg border bg-blue-500 p-1 text-center text-white"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>
        <div className="w-full py-2">
          <table className="w-full border border-gray-100 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className={theadStyle}>유저 ID</th>
                <th className={theadStyle}>활성화</th>
                <th className={theadStyle}>SHOP ID</th>
                <th className={theadStyle}>리워드 가능 여부</th>
              </tr>
            </thead>
            <tbody>
              <UserSearchTable
                userSearchResults={userSearchResults}
                handleUserDetail={handleUserDetail}
                tbodyStyle={tbodyStyle}
              />
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  {getNextPage()
                    ? "스크롤하면 더 많은 유저 정보를 보실 수 있습니다."
                    : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserSearchComponent;
