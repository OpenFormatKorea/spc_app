import { fetchAPI } from "@/lib/api";
import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSidePropsContext } from "next";

export async function fetchUserSearch(
  userId: string,
  pageNum: string,
  pageSize: string,
  context: GetServerSidePropsContext,
) {
  const shop_id = getShopIdFromCookies(context);

  const apiUrl =
    `${process.env.NEXT_PUBLIC_SERVER_API}/user/find-user?shop_id=` +
    shop_id +
    "&user_id=" +
    userId +
    "&page=" +
    pageNum +
    "&page_size=" +
    pageSize;

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
