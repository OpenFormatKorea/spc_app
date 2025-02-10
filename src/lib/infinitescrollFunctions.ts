import { useState, useRef, useEffect } from "react";

export const useScrollPosition = (isOpen: boolean) => {
  const [isBottom, setIsBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;

    const element = scrollRef.current;
    const handleScroll = () => {
      const isAtBottom =
        element.scrollTop + element.clientHeight >= element.scrollHeight - 50;
      setIsBottom(isAtBottom);
    };
    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);
  return { isBottom, scrollRef };
};
