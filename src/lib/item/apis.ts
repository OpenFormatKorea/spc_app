import {
  ItemArgs,
  ItemModifyArgs,
  RewardPolicyArgs,
  RewardsArgs,
} from "@/lib/item/types";
import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSidePropsContext } from "next";
import { fetchAPI } from "@/lib/api";

// 리퍼럴 아이템
export async function fetchCreateItem(
  itemArgs: ItemArgs,
  campaign_id: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const cleanConditions = (
    conditions: RewardPolicyArgs | null,
  ): RewardPolicyArgs | {} => {
    if (!conditions) return {};

    const cleanedConditions: RewardPolicyArgs = {};

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
  itemModifyArgs: ItemModifyArgs,
  campaign_id: string,
  context: GetServerSidePropsContext,
) {
  const apiUrl =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/item-modify/` +
    itemModifyArgs.id;
  const shop_id = getShopIdFromCookies(context);

  const cleanConditions = (
    conditions: RewardPolicyArgs | null,
  ): RewardPolicyArgs | {} => {
    if (!conditions) return {};

    const cleanedConditions: RewardPolicyArgs = {};

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

    return Object.keys(cleanedConditions).length > 0 ? cleanedConditions : {};
  };

  const cleanRewards = (rewards: RewardsArgs[] = [], filterById = true) => {
    return rewards
      .filter((reward) => !filterById || reward.id)
      .map((reward) => ({
        ...reward,
        referrer_conditions: cleanConditions(reward.referrer_conditions || {}),
        referee_conditions: cleanConditions(reward.referee_conditions || {}),
      }));
  };

  let dataObj: any = {
    ...itemModifyArgs,
    current_rewards: cleanRewards(itemModifyArgs.current_rewards, true),
    new_rewards: cleanRewards(itemModifyArgs.new_rewards, false),
    shop_id: shop_id,
    campaign_id: campaign_id,
  };

  const hasProduct =
    itemModifyArgs.product && itemModifyArgs.product.product_model_code !== ""; // Assuming product is an array

  const hasPromotion =
    itemModifyArgs.promotion && itemModifyArgs.promotion.description;
  if (hasProduct) {
    dataObj.product = itemModifyArgs.product;
    delete dataObj.promotion;
  }

  if (hasPromotion) {
    dataObj.promotion = itemModifyArgs.promotion;
    delete dataObj.product;
  }

  if (!hasProduct && !hasPromotion) {
    return {
      status: 400,
      success: false,
      message: "상품 혹은 프로모션이 선택되어야합니다.",
    };
  }
  console.log("final dataObj", dataObj);

  try {
    const response = await fetchAPI(context, apiUrl, "PUT", dataObj);
    if (response.status === "200" && response.message === "success") {
      return {
        status: 200,
        success: true,
        message: "아이템을 수정하였습니다.",
        data: response.data,
      };
    } else {
      return {
        status: response.status || 400,
        success: false,
        message: "내용을 확인 후 다시 시도해주세요.",
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 500,
      success: false,
      message: "수정 중 문제가 생겼습니다. 내용 확인 후 다시 시도해주세요.",
      error: error,
    };
  }
}

export async function fetchSearchCoupon(
  searchKeyword: string,
  searchFilter: string,
  setSearchSort: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);

  if (!shop_id) {
    return {
      redirect: {
        destination: "auth/login",
        permanent: false,
      },
    };
  }

  const page = 1;
  const size = 10;
  let final_url;
  searchFilter === "name"
    ? (final_url =
        `${process.env.NEXT_PUBLIC_SERVER_API}/platform/coupon-list?page=` +
        page +
        "&size=" +
        size +
        "&name=" +
        searchKeyword +
        "&shop_id=" +
        shop_id +
        "&sort=" +
        searchFilter)
    : (final_url =
        `${process.env.NEXT_PUBLIC_SERVER_API}/platform/coupon-list?page=` +
        page +
        "&size=" +
        size +
        "&cpn_id=" +
        searchKeyword +
        "&shop_id=" +
        shop_id +
        "&sort=" +
        searchFilter);

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response.data;
  } catch (error) {
    console.error("error", error);
    return {
      status: 500,
      success: false,
      message: "리스트 호출을 실패하였습니다.",
      error: error,
    };
  }
}

export async function fetchDeleteItem(
  item_id: string,
  campaign_id: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const apiUrl =
    `${process.env.NEXT_PUBLIC_SERVER_API}/item/item-delete/` + item_id;
  const dataObj = {
    shop_id: shop_id,
    campaign_id: campaign_id,
  };
  try {
    const response = await fetchAPI(context, apiUrl, "DELETE", {});

    if (response.status === "200" && response.message === "success") {
      return {
        status: 200,
        success: true,
        message: "리퍼럴을 삭제하였습니다.",
      };
    } else {
      console.error("error", "status: ", response.status);
      return {
        status: response.status || 400,
        success: false,
        message: "삭제를 실패하였습니다.",
      };
    }
  } catch (error) {
    console.error("error", error);
    return {
      status: 500,
      success: false,
      message: "삭제를 실패하였습니다.",
      error: error,
    };
  }
}

export async function fetchDeleteItems(
  item_ids: string[],
  campaign_id: string,
  context: GetServerSidePropsContext,
) {
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
      return {
        status: 200,
        success: true,
        message: "아이템들을 삭제하였습니다.",
      };
    } else {
      console.error("error", "status: ", response.status);
      return {
        status: response.status || 400,
        success: false,
        message: "삭제를 실패하였습니다.",
      };
    }
  } catch (error) {
    console.error("error", error);
    return {
      status: 500,
      success: false,
      message: "삭제를 실패하였습니다.",
      error: error,
    };
  }
}

export async function fetchActivateItem(
  item_id: string,
  campaign_id: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const apiUrl =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/item-modify-active/` +
    item_id;
  const dataObj = {
    campaign_id: campaign_id,
    shop_id: shop_id,
  };
  try {
    const response = await fetchAPI(context, apiUrl, "PUT", dataObj);

    if (response.status === "200" && response.message === "success") {
      return {
        status: 200,
        success: true,
        message: "아이템들을 삭제하였습니다.",
      };
    } else {
      return {
        status: response.status || 400,
        success: false,
        message: "삭제를 실패하였습니다.",
      };
    }
  } catch (error) {
    console.error("error", error);

    return {
      status: 500,
      success: false,
      message: "삭제를 실패하였습니다.",
      error: error,
    };
  }
}

export async function fetchGetItemStats(
  start_date: string,
  end_date: string | null,
  page: string,
  page_size: string,
  campaign_id: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/statistics/referral/campaign?shop_id=` +
    shop_id +
    "&start_date=" +
    start_date +
    "&end_date=" +
    end_date +
    "&page=" +
    page +
    "&page_size=" +
    page_size +
    "&campaign_id=" +
    campaign_id;

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response.data;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}

export async function fetchGetItemList(
  campaign_id: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/items?campaign_id=` +
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
export async function fetchGetItemDetails(
  item_id: string,
  campaign_id: string,
  context: GetServerSidePropsContext,
) {
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

export async function fetchGetProductCodeList(
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);
  if (!shop_id) {
    return {
      redirect: {
        destination: "auth/login",
        permanent: false,
      },
    };
  }

  const page = 1;
  const size = 10;
  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/platform/product-list?page=` +
    page +
    "&size=" +
    size +
    "&shop_id=" +
    shop_id +
    "&sort=name";

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response.data;
  } catch (error) {
    console.error("Error fetching product list:", error);
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

export async function fetchGetCouponCodeList(
  page: string,
  size: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);

  if (!shop_id) {
    return {
      redirect: {
        destination: "auth/login",
        permanent: false,
      },
    };
  }

  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/platform/coupon-list?page=` +
    page +
    "&size=" +
    size +
    "&shop_id=" +
    shop_id +
    "&sort=name";
  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response.data;
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
