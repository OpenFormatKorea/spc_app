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
