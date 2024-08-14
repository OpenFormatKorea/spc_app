import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
} from "@/lib/helper";
import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { GetServerSidePropsContext } from "next";

/**
 * Returns Axios instance for Next.js server: cannot access browser window
 */
export const getAxiosInstanceServer = async (context: GetServerSidePropsContext) => {
  try {
    const access = getAccessTokenFromCookies(context);
    const refresh = getRefreshTokenFromCookies(context);
    const baseURL = `${process.env.NEXT_PUBLIC_SERVER_API}`;

    if (!access) {
      const response = await axios.post(`${baseURL}/account/token/refresh/`, {
        refresh,
      });
      setAccessTokenToCookies(context, response.data.access);
      setRefreshTokenToCookies(context, response.data.refresh);
    }

    const axiosInstance = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${access}` },
    });

    axiosInstance.interceptors.request.use(async (req: InternalAxiosRequestConfig) => {
      // Log the request headers

      const access_decoded: { exp: number } = jwtDecode(access as string);
      const isExpired = access_decoded.exp * 1000 < new Date().getTime();
      console.log("Request Headers:", req.headers);

      if (!isExpired) return req;

      if (!refresh) {
        if (typeof window !== "undefined")
          window.location.replace(
            process.env.NODE_ENV === "development" ? "http://localhost:3000/login" : "https://www.incento.kr/login"
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
            process.env.NODE_ENV === "development" ? "http://localhost:3000/login" : "https://www.incento.kr/login"
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

    // Add a response interceptor to log response headers
    axiosInstance.interceptors.response.use((response) => {
      // Log the response headers
      return response;
    });

    return axiosInstance;
  } catch (err) {
    if (typeof window !== "undefined")
      window.location.replace(
        process.env.NODE_ENV === "development" ? "http://localhost:3000/login" : "https://www.incento.kr/login"
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
          process.env.NODE_ENV === "development" ? "http://localhost:3000/login" : "https://www.incento.kr/login"
        );
      return;
    }

    const axiosInstance = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${access}` },
    });

    axiosInstance.interceptors.request.use(async (req) => {
      const access_decoded: { exp: number } = jwtDecode(access as string);
      const isExpired = access_decoded.exp * 1000 < new Date().getTime();

      if (!isExpired) return req;
      if (!refresh) {
        if (typeof window !== "undefined")
          window.location.replace(
            process.env.NODE_ENV === "development" ? "http://localhost:3000/login" : "https://www.incento.kr/login"
          );
        return req;
      }
      const refresh_decoded: { exp: number } = jwtDecode(refresh as string);
      if (refresh_decoded.exp * 1000 < new Date().getTime()) {
        deleteCookie("access");
        deleteCookie("refresh");
        if (typeof window !== "undefined")
          window.location.replace(
            process.env.NODE_ENV === "development" ? "http://localhost:3000/login" : "https://www.incento.kr/login"
          );
        return req;
      }
      const response = await axios.post(`${baseURL}/account/token/refresh/`, {
        refresh,
      });
      setCookie("access", response.data.access);
      setCookie("refresh", response.data.refresh);

      if (!req.headers) req.headers = {};
      req.headers.Authorization = `Bearer ${response.data.access as string}`;

      return req;
    });

    return axiosInstance;
  } catch (err) {
    if (typeof window !== "undefined")
      if (typeof window !== "undefined")
        window.location.replace(
          process.env.NODE_ENV === "development" ? "http://localhost:3000/login" : "https://www.incento.kr/login"
        );
      else
        setTimeout(() => {
          if (typeof window !== "undefined")
            if (typeof window !== "undefined")
              window.location.replace(
                process.env.NODE_ENV === "development" ? "http://localhost:3000/login" : "https://www.incento.kr/login"
              );
        }, 500);
    return;
  }
};
