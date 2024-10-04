import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { UploadResponse } from "react-aws-s3-typescript/dist/types";

import { AnyAction } from "../interfaces/index";
import ReactS3Client from "../context/ReactS3Client";

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

export function setAccessTokenToCookies(context: GetServerSidePropsContext, token: string) {
  deleteCookie("access_standalone", {
    ...context,
  });

  setCookie("access_standalone", token, {
    ...context,
  });
}

export function setRefreshTokenToCookies(context: GetServerSidePropsContext, token: string) {
  deleteCookie("refresh_standalone", {
    ...context,
  });

  setCookie("refresh_standalone", token, {
    ...context,
  });
}

export function setShopIdTokenToCookies(context: GetServerSidePropsContext, token: string) {
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
  console.log("access_standalone deleted", getCookie("access_standalone"));
  console.log("refresh_standalone deleted", getCookie("refresh_standalone"));
  console.log("shop_id_standalone deleted", getCookie("shop_id_standalone"));
};

export const success_dispatch = (res: { status: number; message?: string }, dispatch: React.Dispatch<AnyAction>) => {
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
      3000
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

export const uploadToAWS = async (images: { [key: string]: File }): Promise<UploadResponse[]> => {
  return Promise.all(
    Object.keys(images).map(async (key) => {
      // At first, assign unique id to each image
      let d = new Date().getTime();
      const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
      const path = getCookie("shop_id_standalone") + "/" + uuid;

      const res = await ReactS3Client.uploadFile(images[key] as File, path);
      return res;
    })
  )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
