import { fetchAPI } from "@/lib/api";
import { getShopIdFromCookies } from "@/lib/helper";
import { StatusString } from "aws-sdk/clients/redshiftdata";
import { GetServerSidePropsContext } from "next";

export async function fetchSignUpGraph(
  start_date: string,
  end_date: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const url = `${process.env.NEXT_PUBLIC_SERVER_API}/statistics/referral/signup`;
  const param = { shop_id, start_date, end_date };
  try {
    const response = await fetchAPI(context, url, "GET", {}, param);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign signup report:", error);
  }
}

export async function fetchHourlySignUpGraph(
  start_date: string,
  end_date: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const url = `${process.env.NEXT_PUBLIC_SERVER_API}/statistics/referral/signup-hours`;
  const param = { shop_id, start_date, end_date };
  try {
    const response = await fetchAPI(context, url, "GET", {}, param);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign hourly signup report:", error);
  }
}

export async function fetchMyFunnelGraph(
  start_date: string,
  end_date: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context) as string;
  const url = `${process.env.NEXT_PUBLIC_SERVER_API}/statistics/referral/funnel-graph/shop`;
  const param = { shop_id, start_date, end_date };
  try {
    const response = await fetchAPI(context, url, "GET", {}, param);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign funnel graph:", error);
  }
}

export async function fetchReferralLeaderboardTable(
  start_date: string,
  end_date: string,
  page: string,
  page_size: string,
  sort_field: string,
  direction: string,
  user_id: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context) as string;
  const url = `${process.env.NEXT_PUBLIC_SERVER_API}/statistics/referral/shop/referrer-signup-purchase-metrics`;
  const param = {
    shop_id,
    start_date,
    end_date,
    page,
    page_size,
    sort_field,
    direction,
    user_id,
  };
  console.log("param", param);
  try {
    const response = await fetchAPI(context, url, "GET", {}, param);
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign funnel graph:", error);
  }
}
