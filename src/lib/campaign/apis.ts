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

export async function fetchGetCampaignList(context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaigns/` + shop_id;
  try {
    const response = await fetchAPI(context, final_url, "GET", {});

    return response.data;
  } catch (error) {
    return null;
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
  const final_url =
    `${process.env.NEXT_PUBLIC_SERVER_API}/statistics/referral/shop?shop_id=` +
    shop_id +
    "&start_date=" +
    start_date +
    "&end_date=" +
    end_date +
    "&page=" +
    page +
    "&page_size=" +
    page_size;
  try {
    const response = await fetchAPI(context, final_url, "GET", {});
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
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaign/` +
    campaign_id +
    "?shop_id=" +
    shop_id;

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
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
    `${process.env.NEXT_PUBLIC_SERVER_API}/referral/item-delete/` +
    item_id +
    "?shop_id=" +
    shop_id;

  try {
    const response = await fetchAPI(context, apiUrl, "DELETE", {});

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
  const dataObj = {
    shop_id: shop_id,
    campaign_id: campaign_id,
    page: page,
    page_size: page_size,
    start_date: start_date,
    end_date: end_date,
  };

  try {
    const response = await fetchAPI(context, apiUrl, "POST", dataObj);

    if (response.status === "200" && response.message === "success") {
      return {
        status: 200,
        success: true,
        message: "캠페인 지급 레코드 호출을 성공하였습니다.",
        data: response.data,
        // data: {
        //   total_count: 5,
        //   page: 1,
        //   page_size: 10,
        //   total_pages: 1,
        //   result: [
        //     {
        //       id: "8e560483-a796-44d5-b819-12f6474ef5b7",
        //       base_user_id: "cc1ea62d-3df4-43bf-8668-29f23c2993a6",
        //       shop_id: "115b4acc-148f-4aa8-89e9-49cbf12babc0",
        //       reward_trigger: "SIGNUP",
        //       reward_target: "referrer",
        //       order_number: "b8447e15-f7c2-4ed4-9b38-51c381bf0308",
        //       status: "SUCCESS",
        //       message: "Door travel meet letter you start.",
        //       processed_by: "SYSTEM",
        //       created_at: "2024-11-05T10:12:14.342520+09:00",
        //     },
        //     {
        //       id: "5ecff535-c54c-48e9-943c-15b12cc84806",
        //       base_user_id: "aee1c713-ef48-49ec-8c72-9c4ad9cde8fa",
        //       shop_id: "115b4acc-148f-4aa8-89e9-49cbf12babc0",
        //       reward_trigger: "PURCHASE",
        //       reward_target: "referrer",
        //       order_number: "1b669938-045d-40e7-b65a-2d338ce3b0be",
        //       status: "SUCCESS",
        //       message: "Force itself bill case ten across power cost.",
        //       processed_by: "SYSTEM",
        //       created_at: "2024-11-05T10:12:14.330045+09:00",
        //     },
        //     {
        //       id: "26f668ae-8f12-4422-9b11-be4da4aab69b",
        //       base_user_id: "32016e96-3e94-4f62-92a4-33e8e77535b4",
        //       shop_id: "115b4acc-148f-4aa8-89e9-49cbf12babc0",
        //       reward_trigger: "PURCHASE",
        //       reward_target: "referrer",
        //       order_number: "9dbf229d-6a8b-4273-b775-26393b2034d1",
        //       status: "SUCCESS",
        //       message: "Professor development thing carry.",
        //       processed_by: "SYSTEM",
        //       created_at: "2024-11-05T10:12:14.323063+09:00",
        //     },
        //     {
        //       id: "0c685d0e-076f-4ae2-8992-c8a37d08a92d",
        //       base_user_id: "517ea925-66ad-4677-90ae-c8e79d62eef4",
        //       shop_id: "115b4acc-148f-4aa8-89e9-49cbf12babc0",
        //       reward_trigger: "SIGNUP",
        //       reward_target: "referee",
        //       order_number: "b58bde53-e164-4298-85bc-d83078fb6be4",
        //       status: "SUCCESS",
        //       message: "Ok black half live lawyer international blood.",
        //       processed_by: "SYSTEM",
        //       created_at: "2024-11-05T10:12:14.317410+09:00",
        //     },
        //     {
        //       id: "3a7c7610-8abc-47f0-86eb-e543aecdfb3a",
        //       base_user_id: "2abfd252-b161-4b7d-a925-8691e893b932",
        //       shop_id: "115b4acc-148f-4aa8-89e9-49cbf12babc0",
        //       reward_trigger: "PURCHASE",
        //       reward_target: "referee",
        //       order_number: "a5ae4ac1-419d-42e0-85d0-42738623c8f8",
        //       status: "SUCCESS",
        //       message: "Add above kind drive.",
        //       processed_by: "SYSTEM",
        //       created_at: "2024-11-05T10:12:14.311121+09:00",
        //     },
        //     {
        //       id: "8e560483-a796-44d5-b819-12f6474ef5b7",
        //       base_user_id: "cc1ea62d-3df4-43bf-8668-29f23c2993a6",
        //       shop_id: "115b4acc-148f-4aa8-89e9-49cbf12babc0",
        //       reward_trigger: "SIGNUP",
        //       reward_target: "referrer",
        //       order_number: "b8447e15-f7c2-4ed4-9b38-51c381bf0308",
        //       status: "SUCCESS",
        //       message: "Door travel meet letter you start.",
        //       processed_by: "SYSTEM",
        //       created_at: "2024-11-05T10:12:14.342520+09:00",
        //     },
        //     {
        //       id: "5ecff535-c54c-48e9-943c-15b12cc84806",
        //       base_user_id: "aee1c713-ef48-49ec-8c72-9c4ad9cde8fa",
        //       shop_id: "115b4acc-148f-4aa8-89e9-49cbf12babc0",
        //       reward_trigger: "PURCHASE",
        //       reward_target: "referrer",
        //       order_number: "1b669938-045d-40e7-b65a-2d338ce3b0be",
        //       status: "SUCCESS",
        //       message: "Force itself bill case ten across power cost.",
        //       processed_by: "SYSTEM",
        //       created_at: "2024-11-05T10:12:14.330045+09:00",
        //     },
        //     {
        //       id: "26f668ae-8f12-4422-9b11-be4da4aab69b",
        //       base_user_id: "32016e96-3e94-4f62-92a4-33e8e77535b4",
        //       shop_id: "115b4acc-148f-4aa8-89e9-49cbf12babc0",
        //       reward_trigger: "PURCHASE",
        //       reward_target: "referrer",
        //       order_number: "9dbf229d-6a8b-4273-b775-26393b2034d1",
        //       status: "SUCCESS",
        //       message: "Professor development thing carry.",
        //       processed_by: "SYSTEM",
        //       created_at: "2024-11-05T10:12:14.323063+09:00",
        //     },
        //     {
        //       id: "0c685d0e-076f-4ae2-8992-c8a37d08a92d",
        //       base_user_id: "517ea925-66ad-4677-90ae-c8e79d62eef4",
        //       shop_id: "115b4acc-148f-4aa8-89e9-49cbf12babc0",
        //       reward_trigger: "SIGNUP",
        //       reward_target: "referee",
        //       order_number: "b58bde53-e164-4298-85bc-d83078fb6be4",
        //       status: "SUCCESS",
        //       message: "Ok black half live lawyer international blood.",
        //       processed_by: "SYSTEM",
        //       created_at: "2024-11-05T10:12:14.317410+09:00",
        //     },
        //     {
        //       id: "3a7c7610-8abc-47f0-86eb-e543aecdfb3a",
        //       base_user_id: "2abfd252-b161-4b7d-a925-8691e893b932",
        //       shop_id: "115b4acc-148f-4aa8-89e9-49cbf12babc0",
        //       reward_trigger: "PURCHASE",
        //       reward_target: "referee",
        //       order_number: "a5ae4ac1-419d-42e0-85d0-42738623c8f8",
        //       status: "SUCCESS",
        //       message: "Add above kind drive.",
        //       processed_by: "SYSTEM",
        //       created_at: "2024-11-05T10:12:14.311121+09:00",
        //     },
        //   ],
        // },
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
