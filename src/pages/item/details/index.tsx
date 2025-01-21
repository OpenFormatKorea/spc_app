import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemTypeDetails from "@/components/layout/item/item/ItemTypeDetails";
import ItemDetails from "@/components/layout/item/item/ItemDetails";
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import {
  fetchGetCouponCodeList,
  fetchGetItemDetails,
  fetchModifyItem,
} from "@/lib/item/apis";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import router from "next/router";
import {
  ItemType,
  ItemArgs,
  ProductsArgs,
  PromotionsArgs,
  RewardsArgs,
  KakaoShareArgs,
  ItemModifyArgs,
} from "@/lib/item/types";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { withAuth } from "@/hoc/withAuth";
import RewardComponentDetails from "@/components/layout/item/reward/details/RewardComponentDetails";
import { ApiResponse } from "@/lib/types";
import { S3AuthDelete, S3AuthUpload } from "@/lib/common";
import { getShopIdFromCookies } from "@/lib/helper";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { item_id, campaign_id }: any = context.query;
  const shop_id = getShopIdFromCookies(context);

  const couponResponse = await fetchGetCouponCodeList("1", "10", context);
  const IDetailApiResponse = await fetchGetItemDetails(
    item_id,
    campaign_id,
    context,
  );

  if (!IDetailApiResponse) {
    return {
      redirect: {
        destination: "/campaign",
        permanent: false,
      },
    };
  }

  return {
    props: {
      apiResponse: IDetailApiResponse,
      campaign_id,
      couponResponse,
      shop_id,
    },
  };
};

const DetailsItem = (
  {
    apiResponse,
    campaign_id,
    couponResponse,
    shop_id,
  }: {
    apiResponse: any;
    campaign_id: string;
    couponResponse: ApiResponse;
    shop_id: string;
  },
  context: GetServerSidePropsContext,
) => {
  const [title, setTitle] = useState(apiResponse.title);
  const rewards = apiResponse.rewards || [];
  const disableInput = false;
  const [kakaoShareArgs, setKakaoShareArgs] = useState<KakaoShareArgs>(
    apiResponse.kakao_args,
  );
  const [productInputs, setProductInputs] = useState<ProductsArgs[]>(
    apiResponse.products || [
      {
        product_model_code: "",
        product_model_name: "",
        images: [{ posThumb: "" }, { thumb: "" }],
      },
    ],
  );
  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>(
    apiResponse.promotions || [{ id: "", description: "" }],
  );
  const [item_type, setItem_type] = useState<ItemType>(apiResponse.item_type);
  const [active, setActive] = useState(apiResponse.active);
  const [description, setDescription] = useState<string>(
    apiResponse.promotions?.description || "",
  );
  const [loading, setLoading] = useState(true);
  const [selectedRewards, setSelectedRewards] = useState<RewardsArgs[]>([]);
  const [image_result, setImage_result] = useState<string>("");
  const [image, setImage] = useState<string>(kakaoShareArgs.image);
  const [shop_logo, setShop_logo] = useState<string>(kakaoShareArgs.shop_logo);
  const [shop_logo_result, setShop_logo_result] = useState<string>("");
  const itemArgs: ItemArgs = {
    id: apiResponse.id || "",
    title,
    item_type,
    kakao_args: kakaoShareArgs,
    products: productInputs,
    promotions: promotionInputs,
    rewards,
    active,
    campaign_id,
  };

  const itemModifyArgs: ItemModifyArgs = {
    id: apiResponse.id || "",
    title,
    item_type,
    kakao_args: kakaoShareArgs,
    product: productInputs,
    promotion: promotionInputs,
    current_rewards: selectedRewards,
    active,
    campaign_id,
  };

  const onChangeImage =
    (imgType: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      const reader = new FileReader();

      reader.onload = async () => {
        if (reader.result && typeof reader.result === "string") {
          try {
            const imgUrl = await uploadImage(
              file,
              imgType,
              imgType === "image" ? image : shop_logo,
            );
            const full_imgUrl = imgUrl;
            console.log("full_imgUrl onChangeImage", full_imgUrl);
            if (imgType === "image") {
              setImage_result(reader.result);
              setImage(full_imgUrl);
              setKakaoShareArgs((prevArgs) => ({
                ...prevArgs,
                image: full_imgUrl,
              }));
            } else {
              setShop_logo_result(reader.result);
              setShop_logo(full_imgUrl);
              setKakaoShareArgs((prevArgs) => ({
                ...prevArgs,
                shop_logo: full_imgUrl,
              }));
            }
          } catch (error) {
            console.error(`${imgType} upload failed:`, error);
          }
        }
      };
      reader.readAsDataURL(file);
    };

  const deletePreviousFile = async (previousFilePath: string) => {
    try {
      const url = await S3AuthDelete(previousFilePath);
    } catch (error) {
      console.error("Failed to delete previous file:", error);
    }
  };

  const uploadImage = async (
    file: File,
    imgType: string,
    previousFilePath: string,
  ) => {
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const finaleFileExtension = "." + fileExtension;
    const fileName = `standalone/${imgType === "image" ? "kakaoShare_image" : "kakaoShare_logo_img"}_${shop_id}_${campaign_id}_${new Date().toISOString()}${finaleFileExtension}`;
    const path = `${environment}/${shop_id}/${campaign_id}/kakaoshare/${imgType}/${fileName}`;
    console.log("path", path);
    try {
      const url = await S3AuthUpload(path, file);
      console.log("url", url);
      return url;
    } catch (error) {
      console.error("Image Upload Failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "cancel_create_item") {
      router.push(`/campaign/details?campaign_id=${campaign_id}`);
    } else if (id === "modify_item" && !loading) {
      setLoading(true);

      const result = await fetchModifyItem(
        itemModifyArgs,
        campaign_id,
        context,
      );

      setLoading(false);
      if (result.status === 200) {
        alert(result.message);
        if (result.success) {
          router.push(`/campaign/details?campaign_id=${campaign_id}`);
        }
      } else {
        alert(`리퍼럴 수정을 실패하였습니다. 상태 코드: ${result.status}`);
      }
    }
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  useEffect(() => {
    if (apiResponse) {
      setLoading(false);
    }
  }, [apiResponse]);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <LoadingSpinner />
        </div>
      )}
      <DashboardContainer>
        <div className="flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <span className="text-2xl font-bold">아이템 상세</span>
          </div>
        </div>
        <div className="flex w-full flex-col justify-center lg:flex-row lg:space-x-4">
          <ContentsContainer variant="campaign">
            <ItemDetails
              page_type="DETAILS"
              itemArgs={itemArgs}
              kakaoShareArgs={kakaoShareArgs}
              setItem_type={setItem_type}
              setTitle={setTitle}
              setKakaoShareArgs={setKakaoShareArgs}
              setProductInputs={setProductInputs}
              setPromotionInputs={setPromotionInputs}
              handleKeyDown={handleKeyDown}
              image={image}
              shop_logo={shop_logo}
              image_result={image_result}
              shop_logo_result={shop_logo_result}
              onChangeImage={onChangeImage}
              disableInput={false}
              deletePreviousFile={deletePreviousFile}
            />
          </ContentsContainer>
          <ContentsContainer variant="campaign">
            <ItemTypeDetails
              page_type="DETAILS"
              item_type={item_type}
              itemArgs={itemArgs}
              description={description}
              selectedProductItems={[
                {
                  product_model_code:
                    apiResponse.products?.product_model_code ||
                    apiResponse.products?.model_name ||
                    "",
                  product_model_name:
                    apiResponse.products?.product_model_name ||
                    apiResponse.products?.model_name ||
                    "",
                },
              ]}
              setPromotionInputs={setPromotionInputs}
              setDescription={setDescription}
              setItem_type={setItem_type}
              setProductInputs={setProductInputs}
              handleKeyDown={handleKeyDown}
              disableInput={disableInput}
            />

            <RewardComponentDetails
              apiResponse={couponResponse}
              disableInput={disableInput}
              selectedRewards={selectedRewards}
              setSelectedRewards={setSelectedRewards}
              rewards={rewards}
            />
          </ContentsContainer>
        </div>
        <div className="button-container flex w-full justify-between gap-2 pt-4 lg:justify-end">
          <button
            className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-gray-400 p-2 text-white lg:w-fit"
            onClick={handleSubmit}
            id="cancel_create_item"
          >
            뒤로가기
          </button>
          <button
            className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-blue-500 p-2 text-white lg:w-fit"
            onClick={handleSubmit}
            id="modify_item"
          >
            수정하기
          </button>
        </div>
      </DashboardContainer>
    </>
  );
};

export default withAuth(DetailsItem);
