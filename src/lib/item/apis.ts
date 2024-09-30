import { ItemArgs, RewardPolicyArgs } from "@/lib/item/types";
import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSidePropsContext } from "next";
import { fetchAPI } from "@/lib/api";
import { error } from "console";

// 리퍼럴 아이템

export async function fetchCreateItem(itemArgs: ItemArgs, campaign_id: string, context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const cleanConditions = (conditions: RewardPolicyArgs | null): RewardPolicyArgs | {} => {
    if (!conditions) return {};

    const cleanedConditions: RewardPolicyArgs = {};

    // Check for each condition (SIGNUP, PURCHASE) and clean it if necessary
    if (conditions.SIGNUP) {
      const isSignupEmpty =
        conditions.SIGNUP.payment_timing?.type === null &&
        conditions.SIGNUP.payment_timing?.delay_days === null &&
        conditions.SIGNUP.payment_frequency?.type === null &&
        conditions.SIGNUP.payment_frequency?.repeat_count === null;

      if (!isSignupEmpty) {
        cleanedConditions.SIGNUP = conditions.SIGNUP;
      }
    }

    if (conditions.PURCHASE) {
      const isPurchaseEmpty =
        conditions.PURCHASE.payment_timing?.type === null &&
        conditions.PURCHASE.payment_timing?.delay_days === null &&
        conditions.PURCHASE.payment_frequency?.type === null &&
        conditions.PURCHASE.payment_frequency?.repeat_count === null;

      if (!isPurchaseEmpty) {
        cleanedConditions.PURCHASE = conditions.PURCHASE;
      }
    }

    // If all are empty, return {}, otherwise return cleanedConditions
    return Object.keys(cleanedConditions).length > 0 ? cleanedConditions : {};
  };

  const dataObj = {
    ...itemArgs,
    rewards:
      itemArgs.rewards?.map((reward) => ({
        ...reward,
        referrer_conditions: cleanConditions(reward.referrer_conditions || {}),
        referee_conditions: cleanConditions(reward.referee_conditions || {}),
      })) || [],
    shop_id: shop_id,
    campaign_id: campaign_id,
  };
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/items-create`;

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

export async function fetchModifyItem(
  item_id: string,
  campaign_id: string,
  info: ItemArgs,
  context: GetServerSidePropsContext
) {
  const apiUrl =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/item-modify/` + item_id + "?campaign_id=" + campaign_id;
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

export async function fetchDeleteItem(item_id: string, campaign_id: string, context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/item/item-delete/` + item_id;
  const dataObj = {
    shop_id: shop_id,
    campaign_id: campaign_id,
  };
  try {
    const response = await fetchAPI(context, apiUrl, "DELETE", {});

    if (response.status === "200" && response.message === "success") {
      return { status: 200, success: true, message: "리퍼럴을 삭제하였습니다." };
    } else {
      console.error("error", "status: ", response.status);
      return { status: response.status || 400, success: false, message: "삭제를 실패하였습니다." };
    }
  } catch (error) {
    console.error("error", error);
    return { status: 500, success: false, message: "삭제를 실패하였습니다.", error: error };
  }
}

export async function fetchDeleteItems(item_ids: string[], campaign_id: string, context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/items-delete`;
  const dataObj = {
    item_ids: item_ids,
    shop_id: shop_id,
    campaign_id: campaign_id,
  };
  try {
    const response = await fetchAPI(context, apiUrl, "DELETE", dataObj);

    if (response.status === "200" && response.message === "success") {
      return { status: 200, success: true, message: "아이템들을 삭제하였습니다." };
    } else {
      console.error("error", "status: ", response.status);
      return { status: response.status || 400, success: false, message: "삭제를 실패하였습니다." };
    }
  } catch (error) {
    console.error("error", error);
    return { status: 500, success: false, message: "삭제를 실패하였습니다.", error: error };
  }
}

export async function fetchActivateItem(item_id: string, campaign_id: string, context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/item-modify-active/` + item_id;
  const dataObj = {
    campaign_id: campaign_id,
    shop_id: shop_id,
    // products: [
    //   {
    //     product_model_code: "000662",
    //     product_model_name: "케잌1호",
    //     images: [{ posThumb: "/item_mst/007800_ORD.PNG" }, { thumb: "/item_mst/007800_ORD.PNG" }],
    //   },
    // ],
  };
  try {
    const response = await fetchAPI(context, apiUrl, "PUT", dataObj);

    if (response.status === "200" && response.message === "success") {
      return { status: 200, success: true, message: "아이템들을 삭제하였습니다." };
    } else {
      return { status: response.status || 400, success: false, message: "삭제를 실패하였습니다." };
    }
  } catch (error) {
    console.error("error", error);

    return { status: 500, success: false, message: "삭제를 실패하였습니다.", error: error };
  }
}

export async function fetchGetItemList(campaign_id: string, context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/items?campaign_id=` + campaign_id + "&shop_id=" + shop_id;

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response.data;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}
export async function fetchGetItemDetails(item_id: string, campaign_id: string, context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/item/` +
    item_id +
    "?campaign_id=" +
    campaign_id +
    "&shop_id=" +
    shop_id;

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response.data;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}

export async function fetchGetProductCodeList(context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  if (!shop_id) {
    throw new Error("Shop ID not found in cookies.");
  }
  const page = 1;
  const size = 10;
  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/platform/product-list?page=` +
    page +
    "&size=" +
    size +
    "&shop_id=" +
    shop_id;

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response;
  } catch (error) {
    console.error("Error fetching product list:", error);

    // Optionally return a default response or handle this error further up the chain
    return {
      response: {
        status: 500,
        msg: "Failed to fetch product list",
      },
      data: {
        data: {
          content: [],
          pageable: {},
          totalElements: 0,
          totalPages: 0,
          last: true,
          number: 0,
          size: 0,
          numberOfElements: 0,
          sort: {},
          first: true,
          empty: true,
        },
      },
    };
  }
}

export async function fetchGetCouponCodeList(context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  if (!shop_id) {
    throw new Error("Shop ID not found in cookies.");
  }
  const page = 1;
  const size = 10;
  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/platform/coupon-list?page=` + page + "&size=" + size + "&shop_id=" + shop_id;
  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response;
  } catch (error) {
    return {
      response: {
        status: 500,
        msg: "Failed to fetch coupon list",
      },
      data: {
        data: {
          content: [],
          pageable: {},
          totalElements: 0,
          totalPages: 0,
          last: true,
          number: 0,
          size: 0,
          numberOfElements: 0,
          sort: {},
          first: true,
          empty: true,
        },
      },
    };
  }
}
