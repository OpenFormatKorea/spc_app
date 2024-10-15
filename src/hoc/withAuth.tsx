// src/hoc/withAuth.tsx
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const withAuth = <P extends object>(WrappedComponent: React.FC<P>) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();
    useEffect(() => {
      const token = getCookie("access_standalone");

      if (!token) {
        router.push("/auth/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};
