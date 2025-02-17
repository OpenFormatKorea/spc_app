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

    return {
      status: response.status || 400,
      success: response.status === "200" && response.message === "success",
      message:
        response.status === "200"
          ? "캠페인 지급 레코드 호출을 성공하였습니다."
          : "내용을 다시 확인 해 주세요",
      data: response.data || null,
    };
  } catch (error) {
    console.error("Error fetching campaign report:", error);
    return {
      status: 500,
      success: false,
      message: "내용을 다시 확인 해 주세요",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// const fetchHourlySignUpGraph = async (start_date: string, end_date: string) => {
//   const shop_id = getCookie("shop_id_standalone");
//   const cacheBuster = new Date().getTime();
//   const response = await axiosInstance.get(
//     requests.V1.SHOP_REPORT_WIDGETSTATS,
//     {
//       params: { shop_id, start_date, end_date, cacheBuster: cacheBuster },
//     },
//   );
//   return response.data;
// };

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

    return {
      status: response.status || 400,
      success: response.status === "200" && response.message === "success",
      message:
        response.status === "200"
          ? "캠페인 지급 레코드 호출을 성공하였습니다."
          : "내용을 다시 확인 해 주세요",
      data: response.data || null,
    };
  } catch (error) {
    console.error("Error fetching campaign report:", error);
    return {
      status: 500,
      success: false,
      message: "내용을 다시 확인 해 주세요",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
// export async function fetchSignUpGraph(
//   start_date: string,
//   end_date: string,
//   context: GetServerSidePropsContext,
// ) {
//   const shop_id = getShopIdFromCookies(context);
//   const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/statistics/referral/signup?shop_id=${shop_id}&start_date=${start_date}&end_date=${end_date}`;
//   try {
//     const response = await fetchAPI(context, apiUrl, "GET", {});
//     if (response.status === "200" && response.message === "success") {
//       return {
//         status: 200,
//         success: true,
//         message: "캠페인 지급 레코드 호출을 성공하였습니다.",
//         data: response.data,
//       };
//     } else {
//       return {
//         status: response.status || 400,
//         success: false,
//         message: "내용을 다시 확인 해 주세요",
//       };
//     }
//   } catch (error) {
//     console.error("Error: ", error);
//     return {
//       status: 500,
//       success: false,
//       message: "내용을 다시 확인 해 주세요",
//       error: error,
//     };
//   }
// }
