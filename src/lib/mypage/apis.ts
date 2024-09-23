import { fetchAPI } from "@/lib/api";
import { GetServerSidePropsContext } from "next";

//Get User Info
export async function fetchGetUserInfo(context: GetServerSidePropsContext) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/account/get`;

  try {
    const response = await fetchAPI(context, apiUrl, "GET", {});
    return response;
  } catch (error) {
    return { success: false, message: "Failed to get user info" };
  }
}
