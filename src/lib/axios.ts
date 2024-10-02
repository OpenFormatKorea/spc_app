import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
} from "@/lib/helper";
import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { GetServerSidePropsContext } from "next";

/**
 * Returns Axios instance for Next.js server: cannot access browser window
 */

export const getAxiosInstanceServer = async (context: GetServerSidePropsContext) => {
  try {
    let access = getAccessTokenFromCookies(context);
    const refresh = getRefreshTokenFromCookies(context);
    const baseURL = `${process.env.NEXT_PUBLIC_SERVER_API}`;
    console.log("getAxiosInstanceServer getAccessTokenFromCookies access", access);
    console.log("getAxiosInstanceServer getRefreshTokenFromCookies refresh", refresh);
    console.log("getAxiosInstanceServer baseURL", baseURL);
    console.log("!access", !access);
    console.log("type of access", access);

    // If no access token, try refreshing it
    if (!access && refresh) {
      try {
        const response = await axios.post(`${baseURL}/account/token/refresh/`, { refresh });
        console.log("getAxiosInstanceServer refreshing access token response", response);

        setAccessTokenToCookies(context, response.data.access);
        setRefreshTokenToCookies(context, response.data.refresh);
        access = response.data.access; // Update the access token
      } catch (error) {
        console.error("Error refreshing access token", error);
        // Redirect to login if refresh fails
        if (typeof window !== "undefined") {
          window.location.replace(
            process.env.NODE_ENV === "development"
              ? "http://dev-fe.standalone.incento.kr/auth/login"
              : "https://dev-fe.standalone.incento.kr/auth/login"
          );
        }
        return; // Exit if refresh fails
      }
    }

    // If still no access token, redirect to login
    if (!access) {
      if (typeof window !== "undefined") {
        window.location.replace(
          process.env.NODE_ENV === "development"
            ? "http://dev-fe.standalone.incento.kr/auth/login"
            : "https://dev-fe.standalone.incento.kr/auth/login"
        );
      }
      return;
    }

    // if (!access) {
    //   const response = await axios.post(`${baseURL}/account/token/refresh/`, {
    //     refresh,
    //   });
    //   response;
    //   console.log("getAxiosInstanceServer  if (!access) response", response);

    //   setAccessTokenToCookies(context, response.data.access);
    //   setRefreshTokenToCookies(context, response.data.refresh);
    // }

    // if (typeof access === "undefined") {
    //   const response = await axios.post(`${baseURL}/account/token/refresh/`, {
    //     refresh,
    //   });
    //   response;
    //   console.log("getAxiosInstanceServer  if typeof access === undefined response", response);

    //   setAccessTokenToCookies(context, response.data.access);
    //   setRefreshTokenToCookies(context, response.data.refresh);
    // }

    const axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      headers: { Authorization: `Bearer ${access}` },
    });

    console.log("getAxiosInstanceServer axiosInstance", axiosInstance);

    axiosInstance.interceptors.request.use(async (req: InternalAxiosRequestConfig) => {
      const access_decoded: { exp: number } = jwtDecode(access as string);
      const isExpired = access_decoded.exp * 1000 < new Date().getTime();

      if (isExpired) {
        const response = await axios.post(`${baseURL}/account/token/refresh/`, {
          refresh,
        });
        setAccessTokenToCookies(context, response.data.access);
        setRefreshTokenToCookies(context, response.data.refresh);

        req.headers.Authorization = `Bearer ${response.data.access as string}`;
        return req;
      }
      if (!refresh) {
        if (typeof window !== "undefined")
          window.location.replace(
            process.env.NODE_ENV === "development"
              ? "http://dev-fe.standalone.incento.kr/auth/login"
              : "https://dev-fe.standalone.incento.kr/auth/login"
          );
        return req;
      }

      const refresh_decoded: { exp: number } = jwtDecode(refresh as string);
      if (refresh_decoded.exp * 1000 < new Date().getTime()) {
        deleteCookie("access", {
          ...context,
        });
        deleteCookie("refresh", {
          ...context,
        });
        if (typeof window !== "undefined")
          window.location.replace(
            process.env.NODE_ENV === "development"
              ? "http://dev-fe.standalone.incento.kr/auth/login"
              : "https://dev-fe.standalone.incento.kr/auth/login"
          );
        return req;
      }
      // const response = await axios.post(`${baseURL}/account/token/refresh/`, {
      //   refresh,
      // });
      // setAccessTokenToCookies(context, response.data.access);
      // setRefreshTokenToCookies(context, response.data.refresh);

      // if (!req.headers) req.headers = {} as AxiosRequestHeaders;
      // req.headers.Authorization = `Bearer ${response.data.access as string}`;

      return req;
    });

    axiosInstance.interceptors.response.use((response) => {
      return response;
    });

    return axiosInstance;
  } catch (err) {
    if (typeof window !== "undefined")
      window.location.replace(
        process.env.NODE_ENV === "development"
          ? "http://dev-fe.standalone.incento.kr/auth/login"
          : "https://dev-fe.standalone.incento.kr/auth/login"
      );
    return;
  }
};

/**
 *
 * @returns Axios instance for next.js client: can access browser window
 */
export const getAxiosInstanceClient = () => {
  try {
    const access = getCookie("access");
    const refresh = getCookie("refresh");
    const baseURL = `${process.env.NEXT_PUBLIC_SERVER_API}`;
    if (!access) {
      if (typeof window !== "undefined")
        window.location.replace(
          process.env.NODE_ENV === "development"
            ? "http://dev-fe.standalone.incento.kr/auth/login"
            : "https://dev-fe.standalone.incento.kr/auth/login"
        );
      return;
    }

    const axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      headers: { Authorization: `Bearer ${access}` },
    });

    axiosInstance.interceptors.request.use(async (req) => {
      const access_decoded: { exp: number } = jwtDecode(access as string);
      const isExpired = access_decoded.exp * 1000 < new Date().getTime();

      if (!isExpired) return req;
      if (!refresh) {
        if (typeof window !== "undefined")
          window.location.replace(
            process.env.NODE_ENV === "development"
              ? "http://dev-fe.standalone.incento.kr/auth/login"
              : "https://dev-fe.standalone.incento.kr/auth/login"
          );
        return req;
      }
      const refresh_decoded: { exp: number } = jwtDecode(refresh as string);
      if (refresh_decoded.exp * 1000 < new Date().getTime()) {
        deleteCookie("access");
        deleteCookie("refresh");
        if (typeof window !== "undefined")
          window.location.replace(
            process.env.NODE_ENV === "development"
              ? "http://dev-fe.standalone.incento.kr/auth/login"
              : "https://dev-fe.standalone.incento.kr/auth/login"
          );
        return req;
      }
      const response = await axios.post(`${baseURL}/account/token/refresh/`, {
        refresh,
      });

      setCookie("access", response.data.access);
      setCookie("refresh", response.data.refresh);

      const axiosInstance = axios.create({
        baseURL,
        headers: new AxiosHeaders({ Authorization: `Bearer ${access}` }),
      });
      if (!req.headers) req.headers = new AxiosHeaders();
      req.headers.set("Authorization", `Bearer ${response.data.access}`);

      return req;
    });

    return axiosInstance;
  } catch (err) {
    if (typeof window !== "undefined")
      if (typeof window !== "undefined")
        window.location.replace(
          process.env.NODE_ENV === "development"
            ? "http://dev-fe.standalone.incento.kr/auth/login"
            : "https://dev-fe.standalone.incento.kr/auth/login"
        );
      else
        setTimeout(() => {
          if (typeof window !== "undefined")
            if (typeof window !== "undefined")
              window.location.replace(
                process.env.NODE_ENV === "development"
                  ? "http://dev-fe.standalone.incento.kr/auth/login"
                  : "https://dev-fe.standalone.incento.kr/auth/login"
              );
        }, 500);
    return;
  }
};
