import { fetchAPI } from "@/lib/api";
import { CampaignArgs } from "@/lib/campaign/types";
import { getShopIdFromCookies } from "@/lib/helper";
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

export async function fetchModifyCampaign(campaign_id: string, info: CampaignArgs, context: GetServerSidePropsContext) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaign-modify/` + campaign_id;
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

export async function fetchDeleteCampaign(campaign_id: string, context: GetServerSidePropsContext) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaign-delete/` + campaign_id;
  const shop_id = getShopIdFromCookies(context);
  const dataObj = {
    campaign_id: campaign_id,
    shop_id: shop_id,
  };
  try {
    const response = await fetchAPI(context, apiUrl, "DELETE", dataObj);

    if (response.status === "200" && response.message === "success") {
      return { status: 200, success: true, message: "캠페인을 삭제하였습니다." };
    } else {
      return { status: response.status || 400, success: false, message: "삭제를 실패하였습니다." };
    }
  } catch (error) {
    return { status: 500, success: false, message: "삭제를 실패하였습니다.", error: error };
  }
}

export async function fetchGetCampaignList(context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const final_url = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaigns/` + shop_id;

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function fetchGetCampaignDetails(
  campaign_id: string,
  shop_id: string,
  context: GetServerSidePropsContext
) {
  const final_url = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/campaign/` + campaign_id + "?shop_id=" + shop_id;

  try {
    const response = await fetchAPI(context, final_url, "GET", {});
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    return null;
  }
}

export async function fetchDeleteItem(item_id: string, shop_id: string, context: GetServerSidePropsContext) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/referral/item-delete/` + item_id + "?shop_id=" + shop_id;

  try {
    const response = await fetchAPI(context, apiUrl, "DELETE", {});

    if (response.status === "200" && response.message === "success") {
      return { status: 200, success: true, message: "리퍼럴을 삭제하였습니다." };
    } else {
      return { status: response.status || 400, success: false, message: "삭제를 실패하였습니다." };
    }
  } catch (error) {
    return { status: 500, success: false, message: "삭제를 실패하였습니다.", error: error };
  }
}

export async function fetchGetProductCodeList(context: GetServerSidePropsContext) {
  const shop_id = getShopIdFromCookies(context);
  const final_url = `https://dev.pbapp.co.kr/api/referral/goods`;

  try {
    //  const response = await fetchAPI(context, final_url, "GET", { page: 1, size: 10 });
    const response = {
      response: {
        status: 200,
        msg: "정상 처리되었습니다.",
      },
      data: {
        content: [
          {
            gid: "007800",
            name: "도멘 라파주, 나라사",
            posThumb: null,
            thumb: null,
          },
          {
            gid: "061876",
            name: "테스트 배송상품",
            posThumb: null,
            thumb: null,
          },
          {
            gid: "061934",
            name: "장 뤽 발데스, 말벡 뒤 끌로",
            posThumb: null,
            thumb: null,
          },
          {
            gid: "061936",
            name: "도멘 라파주, 꼬떼 수드",
            posThumb: null,
            thumb: null,
          },
          {
            gid: "061937",
            name: "도멘 라파주, 꼬떼 플로랄",
            posThumb: null,
            thumb: null,
          },
          {
            gid: "077888",
            name: "도멘 라파주, 아무르",
            posThumb: null,
            thumb: null,
          },
          {
            gid: "079001",
            name: "도멘 라파주, 아무르 로제",
            posThumb: null,
            thumb: null,
          },
          {
            gid: "079148",
            name: "씨에르 다르끄, 라뷸",
            posThumb: null,
            thumb: null,
          },
          {
            gid: "079150",
            name: "방당주 드 뉘 메를로",
            posThumb: null,
            thumb: null,
          },
          {
            gid: "079151",
            name: "방당주 드 뉘 샤르도네",
            posThumb: null,
            thumb: null,
          },
        ],
        pageable: {
          sort: {
            sorted: false,
            unsorted: true,
            empty: true,
          },
          offset: 0,
          pageNumber: 0,
          pageSize: 10,
          paged: true,
          unpaged: false,
        },
        totalElements: 1047,
        totalPages: 105,
        last: false,
        number: 0,
        size: 10,
        numberOfElements: 10,
        sort: {
          sorted: false,
          unsorted: true,
          empty: true,
        },
        first: true,
        empty: false,
      },
    };
    return response;
  } catch (error) {
    return null;
  }
}
