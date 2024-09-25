// lib/auth.ts
import { GetServerSidePropsContext, Redirect } from "next";
import { deleteCookie, getCookie } from "cookies-next";

type AuthResult = { redirect: Redirect } | { props: {} };

// General authentication function
const checkAuth = (context: GetServerSidePropsContext): boolean => {
  const access = getCookie("access", context);
  if (!access) {
    // If no access token, remove it from cookies (in case it's still set)
    //deleteCookie("access", { req: context.req, res: context.res });
    deleteCookie("access");
    deleteCookie("refresh");
    deleteCookie("shop_id");
    return false;
  }
  return !!access; // Returns true if access token exists, false otherwise
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
