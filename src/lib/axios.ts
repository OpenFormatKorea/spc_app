import axios, { InternalAxiosRequestConfig } from "axios";
import { GetServerSidePropsContext } from "next";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
} from "@/lib/helper";
import { jwtDecode } from "jwt-decode";
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API;

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
// });

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     let accessToken = getCookie("access_standalone") as string;
//     // let refresh = getCookie("refresh_standalone") as string;

//     if (!accessToken || isTokenExpired(accessToken)) {
//       accessToken = await refreshAccessToken();
//       if (!accessToken) {
//         return Promise.reject("Token expired");
//       }
//     }

//     config.headers.Authorization = `Bearer ${accessToken}`;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// const refreshAccessToken = async () => {
//   const refresh = getCookie("refresh");
//   if (!refresh || isTokenExpired(refresh as string)) {
//     handleExpiredTokens();
//     return null;
//   }

//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/v1/account/token/refresh/`,
//       {
//         refresh,
//       },
//     );

//     setCookie("access_standalone", response.data.access);
//     setCookie("refresh_standalone", response.data.refresh);

//     return response.data.access;
//   } catch (error) {
//     handleExpiredTokens();
//     return null;
//   }
// };
// function isTokenExpired(token: string): boolean {
//   try {
//     const { exp } = jwtDecode<{ exp: number }>(token);
//     return exp * 1000 < new Date().getTime();
//   } catch {
//     return true;
//   }
// }

// function handleExpiredTokens() {
//   deleteCookie("access");
//   deleteCookie("refresh");
//   if (typeof window !== "undefined") {
//     window.location.href = "/login";
//   }
// }

export const getAxiosInstanceServer = async (
  context: GetServerSidePropsContext,
) => {
  try {
    const access = getAccessTokenFromCookies(context);
    const refresh = getRefreshTokenFromCookies(context);
    const baseURL = `${process.env.NEXT_PUBLIC_SERVER_API}`;

    let accessToken = access;

    if (!accessToken && refresh) {
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

    // Request interceptor to handle token expiration
    axiosInstance.interceptors.request.use(
      async (req: InternalAxiosRequestConfig) => {
        if (accessToken) {
          const access_decoded: { exp: number } = jwtDecode(
            accessToken as string,
          );
          const isAccessExpired =
            access_decoded.exp * 1000 < new Date().getTime();

          // If access token is expired, refresh it
          if (isAccessExpired && refresh) {
            const response = await axios.post(
              `${baseURL}/account/token/refresh/`,
              { refresh },
            );
            setAccessTokenToCookies(context, response.data.access);
            setRefreshTokenToCookies(context, response.data.refresh);
            req.headers.Authorization = `Bearer ${response.data.access}`;
            accessToken = response.data.access;
          }
        }

        // Check if refresh token is expired
        if (refresh) {
          const refresh_decoded: { exp: number } = jwtDecode(refresh as string);
          const isRefreshExpired =
            refresh_decoded.exp * 1000 < new Date().getTime();

          if (isRefreshExpired) {
            deleteCookie("access_standalone", context);
            deleteCookie("refresh_standalone", context);

            // Server-side redirection
            if (typeof window === "undefined") {
              context.res.writeHead(302, {
                Location:
                  process.env.NODE_ENV === "development"
                    ? "http://dev-fe.standalone.incento.kr/auth/login"
                    : "https://dev-fe.standalone.incento.kr/auth/login",
              });
              context.res.end();
              return req;
            } else {
              window.location.replace(
                process.env.NODE_ENV === "development"
                  ? "http://dev-fe.standalone.incento.kr/auth/login"
                  : "https://dev-fe.standalone.incento.kr/auth/login",
              );
              return req;
            }
          }
        }

        return req;
      },
    );

    // Response interceptor
    axiosInstance.interceptors.response.use((response) => {
      return response;
    });

    return axiosInstance;
  } catch (err) {
    console.error("Error creating axios instance:", err);

    if (typeof window !== "undefined") {
      window.location.replace(
        process.env.NODE_ENV === "development"
          ? "http://dev-fe.standalone.incento.kr/auth/login"
          : "https://dev-fe.standalone.incento.kr/auth/login",
      );
    } else {
      context.res.writeHead(302, {
        Location:
          process.env.NODE_ENV === "development"
            ? "http://dev-fe.standalone.incento.kr/auth/login"
            : "https://dev-fe.standalone.incento.kr/auth/login",
      });
      context.res.end();
    }

    return null;
  }
};
