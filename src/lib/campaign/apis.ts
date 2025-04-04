import { fetchAPI } from "@/lib/api";
import { CampaignArgs } from "@/lib/campaign/types";
import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSidePropsContext } from "next";

export async function fetchCreateCampaign(
  info: CampaignArgs,
  context: GetServerSidePropsContext,
) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaign-create`;
  const shop_id = getShopIdFromCookies(context);
  const dataObj = {
    shop_id: shop_id,
    title: info.title,
    description: info.description,
    period_type: info.period_type,
    start_date: info.start_date,
    end_date: info.end_date,
    active: info.active,
  };

  try {
    const response = await fetchAPI(context, apiUrl, "POST", dataObj);

    if (response.status === "200" && response.message === "success") {
      return {
        status: 200,
        success: true,
        message: "캠페인 생성을 성공하였습니다.",
        data: response.data,
      };
    } else {
      return {
        status: response.status || 400,
        success: false,
        message: "내용을 다시 확인 해 주세요",
      };
    }
  } catch (error) {
    console.error("Error: ", error);
    return {
      status: 500,
      success: false,
      message: "내용을 다시 확인 해 주세요",
      error: error,
    };
  }
}

export async function fetchModifyCampaign(
  campaign_id: string,
  info: CampaignArgs,
  context: GetServerSidePropsContext,
) {
  const apiUrl =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaign-modify/` +
    campaign_id;
  const shop_id = getShopIdFromCookies(context);
  const dataObj = {
    campaign_id: campaign_id,
    shop_id: shop_id,
    title: info.title,
    description: info.description,
    period_type: info.period_type,
    start_date: info.start_date,
    end_date: info.end_date,
    active: info.active,
  };

  try {
    const response = await fetchAPI(context, apiUrl, "PUT", dataObj);
    if (response.status === "200") {
      return {
        status: 200,
        success: true,
        message: "캠페인을 수정하였습니다.",
        data: response.data,
      };
    } else {
      return {
        status: response.status || 400,
        success: false,
        message: "수정 내용을 다시 확인 해 주세요",
      };
    }
  } catch (error) {
    console.error("Error: ", error);
    return {
      status: 500,
      success: false,
      message: "수정 내용을 다시 확인 해 주세요",
      error: error,
    };
  }
}

export async function fetchDeleteCampaign(
  campaign_id: string,
  context: GetServerSidePropsContext,
) {
  const apiUrl =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaign-delete/` +
    campaign_id;
  const shop_id = getShopIdFromCookies(context);
  const dataObj = {
    campaign_id: campaign_id,
    shop_id: shop_id,
  };
  try {
    const response = await fetchAPI(context, apiUrl, "DELETE", dataObj);

    if (response.status === "200" && response.message === "success") {
      return {
        status: 200,
        success: true,
        message: "캠페인을 삭제하였습니다.",
      };
    } else {
      return {
        status: response.status || 400,
        success: false,
        message: "삭제를 실패하였습니다.",
      };
    }
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: "삭제를 실패하였습니다.",
      error: error,
    };
  }
}

export async function fetchGetCampaignList(
  page: string,
  page_size: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaigns/` + shop_id;

  const params = { page, page_size };

  try {
    const response = await fetchAPI(context, final_url, "GET", {}, params);
    return response.data;
  } catch (error) {
    console.error("error:", error);
    return;
  }
}

export async function fetchGetCampaignStats(
  start_date: string,
  end_date: string | null,
  page: string,
  page_size: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const final_url = `${process.env.NEXT_PUBLIC_SERVER_API}/statistics/referral/shop`;
  const params = { shop_id, start_date, end_date, page, page_size };
  try {
    const response = await fetchAPI(context, final_url, "GET", {}, params);
    return response.data;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}

export async function fetchGetCampaignDetails(
  campaign_id: string,
  shop_id: string,
  context: GetServerSidePropsContext,
) {
  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaign/` + campaign_id;
  const params = { shop_id };
  try {
    const response = await fetchAPI(context, final_url, "GET", {}, params);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    return null;
  }
}

export async function fetchDeleteItem(
  item_id: string,
  shop_id: string,
  context: GetServerSidePropsContext,
) {
  const apiUrl =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/item-delete/` + item_id;
  const params = { shop_id };
  try {
    const response = await fetchAPI(context, apiUrl, "DELETE", {}, params);

    if (response.status === "200" && response.message === "success") {
      return {
        status: 200,
        success: true,
        message: "리퍼럴을 삭제하였습니다.",
      };
    } else {
      return {
        status: response.status || 400,
        success: false,
        message: "삭제를 실패하였습니다.",
      };
    }
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: "삭제를 실패하였습니다.",
      error: error,
    };
  }
}

export async function fetchPostCampaignRecords(
  campaign_id: string,
  page: string,
  page_size: string,
  start_date: string,
  end_date: string,
  context: GetServerSidePropsContext,
) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/share/records-by-campaign`;
  const shop_id = getShopIdFromCookies(context);
  let dataObj =
    campaign_id !== "35"
      ? {
          shop_id: shop_id,
          campaign_id: campaign_id,
          page: page,
          page_size: page_size,
          start_date: start_date,
          end_date: end_date,
        }
      : {
          shop_id: shop_id,
          campaign_id: campaign_id,
          page: page,
          page_size: page_size,
          start_date: "2025-01-01",
          end_date: "2025-02-14",
        };
  try {
    const response = await fetchAPI(context, apiUrl, "POST", dataObj);
    return response;
  } catch (e) {
    console.error("error:", e);
  }
}

export async function fetchCampaignActiveButton(
  campaign_id: string,
  active: boolean,
  context: GetServerSidePropsContext,
) {
  const apiUrl =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaign-modify-active/` +
    campaign_id;
  const shop_id = getShopIdFromCookies(context);
  let dataObj = {
    shop_id,
    active,
  };

  try {
    const response = await fetchAPI(context, apiUrl, "PUT", dataObj);
    return response;
  } catch (e) {
    console.error("error:", e);
  }
}
