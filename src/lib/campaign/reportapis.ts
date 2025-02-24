import { fetchAPI } from "@/lib/api";
import { getShopIdFromCookies } from "@/lib/helper";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";

export async function fetchSignUpGraph(
  start_date: string,
  end_date: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);

  try {
    const response = await fetchAPI(
      context,
      `${process.env.NEXT_PUBLIC_SERVER_API}/statistics/referral/signup`,
      "GET",
      {},
      { shop_id, start_date, end_date },
    );
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
  try {
    const response = await fetchAPI(
      context,
      `${process.env.NEXT_PUBLIC_SERVER_API}/statistics/referral/signup-hours`,
      "GET",
      {},
      { shop_id, start_date, end_date },
    );

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

  const url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/statistics/referral/funnel-graph/shop?shop_id=` +
    shop_id +
    "&start_date=" +
    start_date +
    "&end_date=" +
    end_date;

  try {
    const response = await fetchAPI(
      context,
      url,
      "GET",
      {},
      { shop_id, start_date, end_date },
    );
    console.log("funnel: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign funnel graph:", error);
  }
}
