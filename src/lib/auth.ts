// lib/auth.ts
import { GetServerSidePropsContext, Redirect } from "next";
import { deleteCookie, getCookie } from "cookies-next";

type AuthResult = { redirect: Redirect } | { props: {} };

const checkAuth = (context: GetServerSidePropsContext): boolean => {
  const access = getCookie("access", context);
  console.log("checkAuth context", context);
  if (!access) {
    // deleteCookies(context);
    return false;
  }
  return true;
};

export const deleteCookies = (context: GetServerSidePropsContext) => {
  deleteCookie("access");
  deleteCookie("refresh");
  deleteCookie("shop_id");
};

export const authenticateUser = (context: GetServerSidePropsContext, redirectTo: string): AuthResult => {
  const { req } = context;
  const currentPath = req.url || "";

  if (checkAuth(context)) {
    if (currentPath === redirectTo) {
      return { props: {} };
    }
    return {
      redirect: {
        destination: redirectTo,
        permanent: false,
      },
    };
  }
  return { props: {} };
};
