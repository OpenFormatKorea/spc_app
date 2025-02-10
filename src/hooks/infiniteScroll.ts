// import { useEffect, useRef, useState, useCallback } from "react";

// interface UseInfiniteScrollOptions {
//   isEnabled?: boolean;
// }
// interface UseInfiniteScrollReturn {
//   containerRef: React.RefObject<HTMLDivElement>;
//   isLoading: boolean;
//   hasMore: boolean;
//   setHasMore: (value: boolean) => void;
// }

// export function useInfiniteScroll(
//   onLoadMore: () => Promise<void>,
//   options: UseInfiniteScrollOptions = {},
// ): UseInfiniteScrollReturn {
//   const { isEnabled = true } = options;

//   // HTMLDivElement 타입으로 지정
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const handleScroll = useCallback(async () => {
//     if (!containerRef.current || isLoading || !hasMore || !isEnabled) return;

//     // 스크롤이 바닥에 근접하면 onLoadMore 실행
//     const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
//     if (scrollHeight - (scrollTop + clientHeight) <= 5) {
//       setIsLoading(true);
//       try {
//         await onLoadMore();
//       } catch (error) {
//         console.error("Error loading more items:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   }, [isLoading, hasMore, onLoadMore, isEnabled]);

//   // 리스너 등록 및 해제
//   useEffect(() => {
//     const currentRef = containerRef.current;
//     if (!currentRef || !isEnabled) return;

//     currentRef.addEventListener("scroll", handleScroll, { passive: true });
//     return () => currentRef.removeEventListener("scroll", handleScroll);
//   }, [handleScroll, isEnabled]);

//   return {
//     containerRef,
//     isLoading,
//     hasMore,
//     setHasMore,
//   };
// }
