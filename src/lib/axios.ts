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

// export const getAxiosInstanceServer = async (context: GetServerSidePropsContext, req: InternalAxiosRequestConfig) => {
//   try {
//     const access = getAccessTokenFromCookies(context);
//     const refresh = getRefreshTokenFromCookies(context);
//     const baseURL = `${process.env.NEXT_PUBLIC_SERVER_API}`;

//     if (!access) {
//       const response = await axios.post(`${baseURL}/account/token/refresh/`, {
//         refresh,
//       });
//       response;
//       setAccessTokenToCookies(context, response.data.access);
//       setRefreshTokenToCookies(context, response.data.refresh);
//     }

//     const axiosInstance = axios.create({
//       baseURL,
//       withCredentials: true,
//       headers: { Authorization: `Bearer ${access}` },
//     });

//     req.headers.Authorization = `Bearer ${access as string}`;

//     console.log("axiosInstance req.headers.Authorization:: ", req.headers.Authorization);
//     console.log("axiosInstance:: ", axiosInstance);
//     return axiosInstance;
//   } catch (err) {
//     if (typeof window !== "undefined")
//       window.location.replace(
//         process.env.NODE_ENV === "development"
//           ? "http://dev-fe.standalone.incento.kr/auth/login"
//           : "https://dev-fe.standalone.incento.kr/auth/login"
//       );
//     return;
//   }
// };

export const getAxiosInstanceServer = async (context: GetServerSidePropsContext) => {
  try {
    const access = getAccessTokenFromCookies(context);
    const refresh = getRefreshTokenFromCookies(context);
    const baseURL = `${process.env.NEXT_PUBLIC_SERVER_API}`;

    const req: InternalAxiosRequestConfig = {
      headers: new AxiosHeaders({
        Authorization: `Bearer ${access}`,
      }),
    };

    const axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      headers: req.headers,
    });

    console.log("axiosInstance req.headers.Authorization:: ", req.headers.Authorization);
    console.log("axiosInstance:: ", axiosInstance);
    return axiosInstance;
  } catch (err) {
    if (typeof window !== "undefined") {
      window.location.replace(
        process.env.NODE_ENV === "development"
          ? "http://dev-fe.standalone.incento.kr/auth/login"
          : "https://dev-fe.standalone.incento.kr/auth/login"
      );
    }
    return;
  }
};

/**
 *
 * @returns Axios instance for next.js client: can access browser window
 */
export const getAxiosInstanceClient = () => {
  try {
    const access = getCookie("access_standalone");
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
        deleteCookie("access_standalone");
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

      setCookie("access_standalone", response.data.access);
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
