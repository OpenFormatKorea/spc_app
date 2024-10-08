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

    console.log("Access Token from cookies:", access);
    console.log("Refresh Token from cookies:", refresh);
    console.log("Base URL:", baseURL);

    let accessToken = access;

    // Refresh access token if missing
    if (!accessToken && refresh) {
      console.log("Access token is missing, attempting to refresh token...");
      const response = await axios.post(`${baseURL}/account/token/refresh/`, {
        refresh,
      });
      console.log("Token refresh successful:", response.data);
      setAccessTokenToCookies(context, response.data.access);
      setRefreshTokenToCookies(context, response.data.refresh);
      accessToken = response.data.access;
    }

    // Create Axios instance
    console.log("Creating Axios instance with Access Token:", accessToken);
    const axiosInstance = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Request interceptor to handle token expiration
    axiosInstance.interceptors.request.use(async (req: InternalAxiosRequestConfig) => {
      console.log("Intercepting request...");
      if (accessToken) {
        const access_decoded: { exp: number } = jwtDecode(accessToken as string);
        const isAccessExpired = access_decoded.exp * 1000 < new Date().getTime();
        console.log("Access token expiration check:", isAccessExpired);

        // If access token is expired, refresh it
        if (isAccessExpired && refresh) {
          console.log("Access token is expired, refreshing it...");
          const response = await axios.post(`${baseURL}/account/token/refresh/`, { refresh });
          console.log("Token refresh during request successful:", response.data);
          setAccessTokenToCookies(context, response.data.access);
          setRefreshTokenToCookies(context, response.data.refresh);
          req.headers.Authorization = `Bearer ${response.data.access}`;
          accessToken = response.data.access;
        }
      }

      // Check if refresh token is expired
      if (refresh) {
        const refresh_decoded: { exp: number } = jwtDecode(refresh as string);
        const isRefreshExpired = refresh_decoded.exp * 1000 < new Date().getTime();
        console.log("Refresh token expiration check:", isRefreshExpired);

        if (isRefreshExpired) {
          console.log("Refresh token is expired, clearing cookies and redirecting...");
          deleteCookie("access_standalone", context);
          deleteCookie("refresh_standalone", context);

          // Server-side redirection
          if (typeof window === "undefined") {
            console.log("Redirecting to login (server-side)...");
            context.res.writeHead(302, {
              Location:
                process.env.NODE_ENV === "development"
                  ? "http://dev-fe.standalone.incento.kr/auth/login"
                  : "https://dev-fe.standalone.incento.kr/auth/login",
            });
            context.res.end();
            return req;
          } else {
            console.log("Redirecting to login (client-side)...");
            window.location.replace(
              process.env.NODE_ENV === "development"
                ? "http://dev-fe.standalone.incento.kr/auth/login"
                : "https://dev-fe.standalone.incento.kr/auth/login"
            );
            return req;
          }
        }
      }

      return req;
    });

    // Response interceptor
    axiosInstance.interceptors.response.use((response) => {
      console.log("Response intercepted:", response);
      return response;
    });

    console.log("Axios instance created successfully");
    return axiosInstance;
  } catch (err) {
    console.error("Error creating axios instance:", err);

    if (typeof window !== "undefined") {
      console.log("Redirecting to login due to error (client-side)...");
      window.location.replace(
        process.env.NODE_ENV === "development"
          ? "http://dev-fe.standalone.incento.kr/auth/login"
          : "https://dev-fe.standalone.incento.kr/auth/login"
      );
    } else {
      console.log("Redirecting to login due to error (server-side)...");
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

// export const getAxiosInstanceServer = async (context: GetServerSidePropsContext) => {
//   try {
//     const access = getAccessTokenFromCookies(context);
//     const refresh = getRefreshTokenFromCookies(context);
//     const baseURL = `${process.env.NEXT_PUBLIC_SERVER_API}`;

//     let accessToken = access;

//     if (!accessToken) {
//       const response = await axios.post(`${baseURL}/account/token/refresh/`, {
//         refresh,
//       });
//       setAccessTokenToCookies(context, response.data.access);
//       setRefreshTokenToCookies(context, response.data.refresh);
//       accessToken = response.data.access;
//     }

//     const axiosInstance = axios.create({
//       baseURL,
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     axiosInstance.interceptors.request.use(async (req: InternalAxiosRequestConfig) => {
//       const access_decoded: { exp: number } = jwtDecode(accessToken as string);
//       const isExpired = access_decoded.exp * 1000 < new Date().getTime();

//       if (isExpired) {
//         const response = await axios.post(`${baseURL}/account/token/refresh/`, {
//           refresh,
//         });
//         setAccessTokenToCookies(context, response.data.access);
//         setRefreshTokenToCookies(context, response.data.refresh);

//         req.headers.Authorization = `Bearer ${response.data.access as string}`;
//         accessToken = response.data.access;
//         return req;
//       }

//       if (!refresh) {
//         if (typeof window !== "undefined") {
//           window.location.replace(
//             process.env.NODE_ENV === "development"
//               ? "http://dev-fe.standalone.incento.kr/auth/login"
//               : "https://dev-fe.standalone.incento.kr/auth/login"
//           );
//         }
//         return req;
//       }

//       const refresh_decoded: { exp: number } = jwtDecode(refresh as string);
//       if (refresh_decoded.exp * 1000 < new Date().getTime()) {
//         deleteCookie("access_standalone", {
//           ...context,
//         });
//         deleteCookie("refresh_standalone", {
//           ...context,
//         });
//         if (typeof window !== "undefined") {
//           window.location.replace(
//             process.env.NODE_ENV === "development"
//               ? "http://dev-fe.standalone.incento.kr/auth/login"
//               : "https://dev-fe.standalone.incento.kr/auth/login"
//           );
//         }
//         return req;
//       }

//       return req;
//     });

//     axiosInstance.interceptors.response.use((response) => {
//       return response;
//     });

//     return axiosInstance;
//   } catch (err) {
//     if (typeof window !== "undefined") {
//       window.location.replace(
//         process.env.NODE_ENV === "development"
//           ? "http://dev-fe.standalone.incento.kr/auth/login"
//           : "https://dev-fe.standalone.incento.kr/auth/login"
//       );
//     }
//     return;
//   }
// };
