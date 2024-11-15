import UserSearchTable from "@/components/layout/admin/usersearch/UserSearchTable";
import { UserDataApiResponse, UserSearchList } from "@/lib/admin/types";
import { removeWhiteSpace } from "@/lib/common";
import { useState, useEffect, useRef, KeyboardEvent } from "react";

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
  const useScrollPosition = (elementId: string) => {
    const [isBottom, setIsBottom] = useState(false);
    useEffect(() => {
      const element = document.getElementById(elementId);
      if (!element) return;
      const viewportHeight = window.innerHeight;
      const elementHeight = element.scrollHeight;
      console.log(
        "viewportHeight: ",
        viewportHeight,
        " elementHeight: ",
        elementHeight,
      );
      const handleScroll = () => {
        const isAtBottom =
          element.scrollTop + element.clientHeight >= element.scrollHeight;
        setIsBottom(isAtBottom);
      };
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
  const getNextPage = () => totalCount >= stackedDataAmount;

  useEffect(() => {
    const isNextPage = getNextPage();
    const nextPageNum = (parseInt(pageNum) + 1).toString();

    if (isNextPage && scrollPosition) {
      setLoading(true);
      try {
        fetchUserSearch(userId, pageNum, pageSize).then((newData) => {
          setUserSearchResults((prev) => [...prev, ...(newData.result || [])]);
          setPageNum(nextPageNum);
        });
        console.log("page size : ", pageSize, " page number: ", pageNum);
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
        <div className="h-full w-full py-2">
          <table className="h-full min-h-full w-full border border-gray-100 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className={theadStyle}>ID No.</th>
                <th className={theadStyle}>유저 ID</th>
                <th className={theadStyle}>활성화</th>
                <th className={theadStyle}>리워드 가능 여부</th>
                <th className={theadStyle}>SHOP ID</th>
              </tr>
            </thead>
            <tbody className="h-full">
              <UserSearchTable
                userSearchResults={userSearchResults}
                handleUserDetail={handleUserDetail}
                tbodyStyle={tbodyStyle}
              />
              {getNextPage() ? (
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
      </div>
    </div>
  );
};

export default UserSearchComponent;
