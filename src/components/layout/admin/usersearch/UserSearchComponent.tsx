import { useEffect, useState } from "react";
import { StatsApiResponse } from "@/lib/types";
import { UserSearchList } from "@/lib/admin/types";
import { removeWhiteSpace } from "@/lib/common";
import UserSearchTable from "@/components/layout/admin/usersearch/UserSearchTable";

interface UserSearchComponentProps {
  handleSearch: (e: React.MouseEvent<HTMLButtonElement>) => void;
  apiResponse: StatsApiResponse;
  userId: string;
  setUserId: (value: string) => void;
  pageSize: string;
  pageNum: string;
  setPageNum: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSearchComponent: React.FC<UserSearchComponentProps> = ({
  handleSearch,
  apiResponse,
  userId,
  setUserId,
  pageSize,
  pageNum,
  setPageNum,
  setLoading,
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
      if (elementHeight <= viewportHeight) {
        setIsBottom(true);
      } else {
        element.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
          element.removeEventListener("scroll", handleScroll);
        };
      }
    }, [elementId]);

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
    const trimmedUserId = removeWhiteSpace(userId);
    if (trimmedUserId !== userId) {
      setUserId(trimmedUserId);
    }
  }, [userId, setUserId]);
  useEffect(() => {
    setUserSearchResults(apiResponse?.result ?? []);
  }, [apiResponse]);
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
      <div className="searchInputClass">
        <div className="flex w-full items-center justify-end py-2">
          <input
            type="text"
            id="userId"
            placeholder={"유저 아이디를 적어주세요"}
            value={userId}
            className="input-class w-full flex-grow border-b-[1px] py-2 text-sm lg:max-w-[450px]"
            onChange={(e) => setUserId(e.target.value)}
          />
          <button
            className={`min-w-[45px] cursor-pointer rounded-lg border bg-blue-500 p-1 text-center text-white`}
            onClick={handleSearch}
          >
            검색
          </button>
        </div>
        <div className="w-full py-2">
          <table className="w-full border border-gray-100 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className={theadStyle}>캠페인 ID</th>
                <th className={theadStyle}>활성화</th>
                <th className={theadStyle}>SHOP ID</th>
                <th className={theadStyle}>리워드 가능 여부</th>
              </tr>
            </thead>
            <tbody>
              <UserSearchTable
                userSearchResults={userSearchResults}
                tbodyStyle={tbodyStyle}
              />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserSearchComponent;
