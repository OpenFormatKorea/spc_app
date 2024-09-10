// lib/auth.ts
import { GetServerSidePropsContext, Redirect } from "next";
import { getCookie } from "cookies-next";

type AuthResult = { redirect: Redirect } | { props: {} };

export const authenticateUserforLogin = (context: GetServerSidePropsContext): AuthResult => {
  const access = getCookie("access", context);
  if (access) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export const authenticateUserforHeader = (context: GetServerSidePropsContext): AuthResult => {
  const access = getCookie("access", context);
  if (!access) {
    console.error("error : there is no access token.");
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  return { props: {} };
};
