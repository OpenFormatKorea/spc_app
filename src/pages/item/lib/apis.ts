import { fetchAPI } from "@/lib/api";
import { getShopIdFromCookies } from "@/lib/helper";
import { ItemArgs } from "@/pages/item/lib/types";
import { GetServerSidePropsContext } from "next";

export async function fetchCreateItem(info: ItemArgs, context: GetServerSidePropsContext) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/item/item-create`;
  const shop_id = getShopIdFromCookies(context);

  const dataObj = {
    shop_id: shop_id,
    title: info.title,
    item_type: info.item_type,
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
        message: "리퍼럴 생성을 성공하였습니다.",
        data: response.data, // Return the empty data object if needed
      };
    } else {
      return {
        status: response.status || 400, // Default to 400 if no status is provided
        success: false,
        message: "내용을 다시 확인 해 주세요",
      };
    }
  } catch (error) {
    console.error("Error: ", error);
    return {
      status: 500, // Internal server error status
      success: false,
      message: "내용을 다시 확인 해 주세요",
      error: error,
    };
  }
}

export async function fetchModifyItem(item_id: string, info: ItemArgs, context: GetServerSidePropsContext) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/item/item-modify/` + item_id;
  const shop_id = getShopIdFromCookies(context);
  const dataObj = {
    shop_id: shop_id,
    title: info.title,
    item_type: info.item_type,
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
        message: "리퍼럴을 수정하였습니다.",
        data: response.data, // Add this if you need to return the data object
      };
    } else {
      return {
        status: response.status || 400, // Default to 400 if no status is provided
        success: false,
        message: "수정 내용을 다시 확인 해 주세요",
      };
    }
  } catch (error) {
    console.error("Error: ", error);
    return {
      status: 500, // Internal server error status
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

export async function fetchGetItemList(context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const final_url = `${process.env.NEXT_PUBLIC_SERVER_API}/item/items?shop_id=` + shop_id;

  try {
    const response = await fetchAPI(context, final_url, "GET", {});

    return response.data;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}

export async function fetchGetItemDetails(item_id: string, context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const final_url = `${process.env.NEXT_PUBLIC_SERVER_API}/item/item/` + item_id;

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response.data;
  } catch (error) {
    console.error("Error fetching item details:", error);
    return null;
  }
}
