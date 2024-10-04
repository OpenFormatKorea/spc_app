import axios, { InternalAxiosRequestConfig } from "axios";
import { GetServerSidePropsContext } from "next";
import { deleteCookie } from "cookies-next";
import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
} from "@/lib/helper";
import { jwtDecode } from "jwt-decode";

export const getAxiosInstanceServer = async (context: GetServerSidePropsContext) => {
  try {
    const access = getAccessTokenFromCookies(context);
    const refresh = getRefreshTokenFromCookies(context);
    const baseURL = `${process.env.NEXT_PUBLIC_SERVER_API}`;

    let accessToken = access;

    if (!accessToken) {
      const response = await axios.post(`${baseURL}/account/token/refresh/`, {
        refresh,
      });
      setAccessTokenToCookies(context, response.data.access);
      setRefreshTokenToCookies(context, response.data.refresh);
      accessToken = response.data.access;
    }

    const axiosInstance = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    axiosInstance.interceptors.request.use(async (req: InternalAxiosRequestConfig) => {
      const access_decoded: { exp: number } = jwtDecode(accessToken as string);
      const isExpired = access_decoded.exp * 1000 < new Date().getTime();

      if (isExpired) {
        const response = await axios.post(`${baseURL}/account/token/refresh/`, {
          refresh,
        });
        setAccessTokenToCookies(context, response.data.access);
        setRefreshTokenToCookies(context, response.data.refresh);

        req.headers.Authorization = `Bearer ${response.data.access as string}`;
        accessToken = response.data.access;
        return req;
      }

      if (!refresh) {
        if (typeof window !== "undefined") {
          window.location.replace(
            process.env.NODE_ENV === "development"
              ? "http://dev-fe.standalone.incento.kr/auth/login"
              : "https://dev-fe.standalone.incento.kr/auth/login"
          );
        }
        return req;
      }

      const refresh_decoded: { exp: number } = jwtDecode(refresh as string);
      if (refresh_decoded.exp * 1000 < new Date().getTime()) {
        deleteCookie("access_standalone", {
          ...context,
        });
        deleteCookie("refresh_standalone", {
          ...context,
        });
        if (typeof window !== "undefined") {
          window.location.replace(
            process.env.NODE_ENV === "development"
              ? "http://dev-fe.standalone.incento.kr/auth/login"
              : "https://dev-fe.standalone.incento.kr/auth/login"
          );
        }
        return req;
      }

      return req;
    });

    axiosInstance.interceptors.response.use((response) => {
      return response;
    });

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

// export const getAxiosInstanceServer = async (context: GetServerSidePropsContext) => {
//   const serverAxios = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_SERVER_API,
//     withCredentials: true,
//   });

//   // Add a request interceptor
//   serverAxios.interceptors.request.use(
//     async (config) => {
//       const token = getCookie("access_standalone"); // Fetch the JWT token from cookies
//       if (token) {
//         // eslint-disable-next-line no-param-reassign
//         config.headers.Authorization = `Bearer ${token}`;
//       }

//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   // Add a response interceptor to handle token expiration and errors
//   serverAxios.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     async (error) => {
//       const originalRequest = error.config;
//       if (error.response && error.response.status === 401 && !originalRequest.retry) {
//         originalRequest.retry = true;

//         try {
//           const refreshToken = getCookie("refresh_standalone");
//           if (refreshToken) {
//             const response = await serverAxios.post("/account/refresh", { refresh: refreshToken });
//             setShopIdTokenToCookies(context, response.data);

//             originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
//             return await serverAxios(originalRequest);
//           }
//         } catch (tokenRefreshError) {
//           // If refresh fails, clear the cookies
//           deleteCookies();
//         }
//         window.location.href = "/login";
//       }
//       return Promise.reject(error);
//     }
//   );
//   return serverAxios;
// };
