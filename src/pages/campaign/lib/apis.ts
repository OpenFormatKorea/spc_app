import { fetchAPI } from "@/lib/api";
import { getShopIdFromCookies } from "@/lib/helper";
import { CampaignArgs } from "@/pages/campaign/lib/types";
import { GetServerSidePropsContext } from "next";

export async function fetchCreateCampaign(info: CampaignArgs, context: GetServerSidePropsContext) {
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
    const {
      data: { access, refresh },
    }: { data: { access: string; refresh: string } } = await fetchAPI(context, apiUrl, "POST", dataObj);

    console.log("success: ", true, "message: 캠페인 생성을 성공하였습니다.");
    return { success: true, message: "캠페인 생성을 성공하였습니다." };
  } catch (error) {
    console.error("success: ", false, "message: 내용을 다시 확인 해 주세요", error);
    return { success: false, message: "내용을 다시 확인 해 주세요" };
  }
}

export async function fetchGetCampaignInfo(context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const final_url = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaigns` + "?shop_id=" + shop_id;

  const data = await fetchAPI(context, final_url, "GET", {});
  console.log("data :", data);

  return data;
}

// export const fetchGetCampaignInfo = async (context: GetServerSidePropsContext) => {
//   const shop_id = getShopIdFromCookies(context);
//   const data = await fetchAPI(context, `/referral/campaigns`, "GET", {
//     shop_id,
//   });
//   return data.data;
// };

// export const fetchGetCampaignInfo = async (context: GetServerSidePropsContext) => {
//   //const final_url = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaigns` + "?shop_id=" + shop_id;
//   const shop_id = getShopIdFromCookies(context);
//   const data = await fetchAPI(context, `/referral/campaigns`, "GET", {
//     shop_id,
//   });
//   return data.data;
// };
