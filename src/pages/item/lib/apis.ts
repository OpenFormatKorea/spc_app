import { fetchAPI } from "@/lib/api";
import { getShopIdFromCookies } from "@/lib/helper";
import { ItemArgs } from "@/pages/item/lib/types";
import { GetServerSidePropsContext } from "next";

// 리퍼럴 아이템

export async function fetchCreateItem(itemArgs: ItemArgs, context: GetServerSidePropsContext) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/items-create`;
  const dataObj = {
    ...itemArgs,
    rewards:
      itemArgs.rewards?.map((reward) => ({
        ...reward,
        referrer_conditions: reward.referrer_conditions || {},
        referee_conditions: reward.referee_conditions || {},
      })) || [],
  };
  console.log("dataObj: ", JSON.stringify(dataObj, null, 2));
  try {
    const response = await fetchAPI(context, apiUrl, "POST", dataObj);

    if (response.status === "200" && response.message === "success") {
      return {
        status: 200,
        success: true,
        message: "리퍼럴 생성을 성공하였습니다.",
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

export async function fetchModifyItem(item_id: string, info: ItemArgs, context: GetServerSidePropsContext) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/item-modify/` + item_id;
  const shop_id = getShopIdFromCookies(context);
  const dataObj = {
    shop_id: shop_id,
    title: info.title,
    item_type: info.item_type,
  };
  try {
    const response = await fetchAPI(context, apiUrl, "PUT", dataObj);
    if (response.status === "200") {
      return {
        status: 200,
        success: true,
        message: "리퍼럴을 수정하였습니다.",
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

export async function fetchDeleteItem(item_id: string, context: GetServerSidePropsContext) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/item/item-delete/` + item_id;

  try {
    const response = await fetchAPI(context, apiUrl, "DELETE", {});

    if (response.status === "200" && response.message === "success") {
      console.log("success: ", true, "message: 리퍼럴을 삭제하였습니다.");
      return { status: 200, success: true, message: "리퍼럴을 삭제하였습니다." };
    } else {
      console.error("error", "status: ", response.status, "message: 삭제를 실패하였습니다.");
      return { status: response.status || 400, success: false, message: "삭제를 실패하였습니다." };
    }
  } catch (error) {
    console.error("error", error);
    return { status: 500, success: false, message: "삭제를 실패하였습니다.", error: error };
  }
}

export async function fetchDeleteItems(item_ids: string[], context: GetServerSidePropsContext) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/items-delete`;
  const dataObj = {
    item_ids: item_ids,
  };
  try {
    const response = await fetchAPI(context, apiUrl, "DELETE", dataObj);

    if (response.status === "200" && response.message === "success") {
      console.log("success: ", true, "message: 아이템들을 삭제하였습니다.");
      return { status: 200, success: true, message: "아이템들을 삭제하였습니다." };
    } else {
      console.error("error", "status: ", response.status, "message: 삭제를 실패하였습니다.");
      return { status: response.status || 400, success: false, message: "삭제를 실패하였습니다." };
    }
  } catch (error) {
    console.error("error", error);
    return { status: 500, success: false, message: "삭제를 실패하였습니다.", error: error };
  }
}

export async function fetchActivateItem(item_id: string, context: GetServerSidePropsContext) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/item-modify-active/` + item_id;

  try {
    const response = await fetchAPI(context, apiUrl, "PUT", {});

    if (response.status === "200" && response.message === "success") {
      console.log("success: ", true, "message: 아이템 활성화를 변경 하였습니다.");
      return { status: 200, success: true, message: "아이템들을 삭제하였습니다." };
    } else {
      console.error("error", "status: ", response.status, "message: 삭제를 실패하였습니다.");
      return { status: response.status || 400, success: false, message: "삭제를 실패하였습니다." };
    }
  } catch (error) {
    console.error("error", error);
    return { status: 500, success: false, message: "삭제를 실패하였습니다.", error: error };
  }
}

export async function fetchGetItemList(campaign_id: string, context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const final_url = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/items?campaign_id=` + campaign_id;
  console.log("final_url", final_url);

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}
export async function fetchGetItemDetails(item_id: string, context: GetServerSidePropsContext) {
  const final_url = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/item/` + item_id;

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response.data;
  } catch (error) {
    console.error("Error fetching id details:", error);
    return null;
  }
}
