import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";

import { AnyAction } from "../interfaces/index";

export function getAccessTokenFromCookies(context: GetServerSidePropsContext) {
  const acceess = getCookie("access_standalone", {
    ...context,
  });
  return acceess;
}

export function getRefreshTokenFromCookies(context: GetServerSidePropsContext) {
  const refresh = getCookie("refresh_standalone", {
    ...context,
  });
  return refresh;
}

export function getShopIdFromCookies(context: GetServerSidePropsContext) {
  const shop = getCookie("shop_id_standalone", { ...context });
  return shop;
}

export function setAccessTokenToCookies(
  context: GetServerSidePropsContext,
  token: string,
) {
  deleteCookie("access_standalone", {
    ...context,
  });

  setCookie("access_standalone", token, {
    ...context,
  });
}

export function setRefreshTokenToCookies(
  context: GetServerSidePropsContext,
  token: string,
) {
  deleteCookie("refresh_standalone", {
    ...context,
  });

  setCookie("refresh_standalone", token, {
    ...context,
  });
}

export function setShopIdTokenToCookies(
  context: GetServerSidePropsContext,
  token: string,
) {
  deleteCookie("shop_id_standalone", {
    ...context,
  });

  setCookie("shop_id_standalone", token, {
    ...context,
  });
}

export function setLoading(dispatch: any, loading: boolean) {
  dispatch({
    type: "LOADING",
    payload: {
      fetching: loading,
    },
  });
}

export const deleteCookies = () => {
  deleteCookie("access_standalone");
  deleteCookie("refresh_standalone");
  deleteCookie("shop_id_standalone");
  console.log("cookies deleted");
};

export const success_dispatch = (
  res: { status: number; message?: string },
  dispatch: React.Dispatch<AnyAction>,
) => {
  if (res.status < 300 && res.status >= 200) {
    dispatch({
      type: "SUCCESS",
      payload: {
        success: "success",
      },
    });

    setTimeout(
      () =>
        dispatch({
          type: "SUCCESS",
          payload: {
            success: null,
          },
        }),
      3000,
    );
  } else {
    if (res.message) {
      dispatch({
        type: "SUCCESS",
        payload: {
          success: "error",
          message: res.message,
        },
      });
    } else {
      dispatch({
        type: "SUCCESS",
        payload: {
          success: "error",
        },
      });
    }
  }
};
