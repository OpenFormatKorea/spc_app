import { RewardEligibilityType } from "@/lib/admin/types";
import { fetchAPI } from "@/lib/api";
import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSidePropsContext } from "next";

export async function fetchGetUserSearch(
  userId: string,
  pageNum: string,
  pageSize: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  let apiUrl = "";
  userId !== "" || null
    ? (apiUrl =
        `${process.env.NEXT_PUBLIC_SERVER_API}/user/find-user?shop_id=` +
        shop_id +
        "&user_id=" +
        userId +
        "&page=" +
        pageNum +
        "&page_size=" +
        pageSize)
    : (apiUrl =
        `${process.env.NEXT_PUBLIC_SERVER_API}/user/find-user?shop_id=` +
        shop_id +
        "&page=" +
        pageNum +
        "&page_size=" +
        pageSize);
  try {
    const response = await fetchAPI(context, apiUrl, "GET", {});
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
    return {
      status: 500,
      success: false,
      message: "검색어를 다시 확인 해 주세요",
      error: error,
    };
  }
}

export async function fetchGetUserDetail(
  userId: string,

  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const apiUrl =
    `${process.env.NEXT_PUBLIC_SERVER_API}/user/find-user-details?shop_id=` +
    shop_id +
    "&base_user_id=" +
    userId;

  try {
    const response = await fetchAPI(context, apiUrl, "GET", {});
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
    return {
      status: 500,
      success: false,
      message: "검색어를 다시 확인 해 주세요",
      error: error,
    };
  }
}

export async function fetchPutReWardEligibility(
  user_id: string,
  rewardEligibility: RewardEligibilityType,
  status: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/user/modify-reward-status`;
  const data = {
    shop_id: shop_id,
    base_user_id: user_id,
    is_active: status,
    reward_eligibility: rewardEligibility,
  };

  try {
    const response = await fetchAPI(context, apiUrl, "PUT", data);
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
    return {
      status: 500,
      success: false,
      message: "검색어를 다시 확인 해 주세요",
      error: error,
    };
  }
}

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
