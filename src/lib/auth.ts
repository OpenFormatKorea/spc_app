// lib/auth.ts
import { GetServerSidePropsContext, Redirect } from "next";
import { deleteCookies, getAccessTokenFromCookies } from "@/lib/helper";

type AuthResult = { redirect: Redirect } | { props: {} };

const checkAuth = (context: GetServerSidePropsContext): boolean => {
  const access = getAccessTokenFromCookies(context);
  if (!access) {
    deleteCookies();
    return false;
  }
  return true;
};

export const authenticateUserforLogin = (context: GetServerSidePropsContext): AuthResult => {
  if (checkAuth(context)) {
    return context.req.url === "/dashboard"
      ? { props: {} }
      : { redirect: { destination: "/dashboard", permanent: false } };
  }
  return { props: {} };
};
