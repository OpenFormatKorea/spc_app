import { RewardEligibilityType } from "@/lib/admin/types";
import { fetchAPI } from "@/lib/api";
import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSidePropsContext } from "next";

export async function fetchGetUserSearch(
  user_id: string,
  page_num: string,
  page_size: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context) as string;
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/user/find-user`;

  const params =
    user_id && user_id !== ""
      ? { shop_id, user_id, page_num, page_size }
      : { shop_id, page_num, page_size };

  try {
    const response = await fetchAPI(context, apiUrl, "GET", {}, params);
    return response.data;
  } catch (error: any) {
    console.error("Error: ", error);

    return {
      status: 500,
      success: false,
      message: "검색어를 다시 확인 해 주세요",
      error: error.message || JSON.stringify(error), // JSON 직렬화 가능하도록 변환
    };
  }
}

export async function fetchGetUserDetail(
  base_user_id: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/user/find-user-details?shop_id=`;
  const params = { shop_id, base_user_id };

  try {
    const response = await fetchAPI(context, apiUrl, "GET", {}, params);
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
