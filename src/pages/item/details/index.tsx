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
import { isNonEmptyString, S3AuthDelete, S3AuthUpload } from "@/lib/common";
import { getShopIdFromCookies } from "@/lib/helper";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { item_id, campaign_id }: any = context.query;
  const shop_id = getShopIdFromCookies(context);
  const couponResponse = await fetchGetCouponCodeList(1, 25, "", context);
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
  const router = useRouter();
  const [title, setTitle] = useState(apiResponse.title);
  const [currentProductItemList, setCurrentProductItemList] = useState<
    ProductsArgs[]
  >(
    Array.isArray(apiResponse.products)
      ? apiResponse.products
      : [
          {
            product_model_code: apiResponse.products?.product_model_code || "",
            product_model_name:
              apiResponse.products?.product_model_name ||
              apiResponse.products?.model_name ||
              "",
          },
        ],
  );
  const [description, setDescription] = useState<string>(
    apiResponse.promotions?.description || "",
  );
  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>(
    apiResponse.promotions || [{ id: "", description: "" }],
  );

  const [kakaoShareArgs, setKakaoShareArgs] = useState<KakaoShareArgs>(
    apiResponse.kakao_args,
  );
  const rewards: RewardsArgs[] = Array.isArray(apiResponse?.rewards)
    ? apiResponse.rewards
    : [];
  const [item_type, setItem_type] = useState<ItemType>(apiResponse.item_type);
  const prev_img = isNonEmptyString(kakaoShareArgs.image)
    ? kakaoShareArgs.image
    : "";
  const [image, setImage] = useState<string>(prev_img);
  const [image_result, setImage_result] = useState<string>("");
  const [imageFile, setImageFile] = useState<File>();
  const prev_shop_logo = isNonEmptyString(kakaoShareArgs.shop_logo)
    ? kakaoShareArgs.shop_logo
    : "";
  const [shop_logo, setShop_logo] = useState<string>(prev_shop_logo);
  const [shop_logo_result, setShop_logo_result] = useState<string>("");
  const [imageLogoFile, setImageLogoFile] = useState<File>();
  const [loading, setLoading] = useState(true);

  const active = apiResponse.active;
  const [selectedRewards, setSelectedRewards] = useState<RewardsArgs[]>([]);

  const itemArgs: ItemArgs = {
    id: apiResponse.id || "",
    title,
    item_type,
    kakao_args: kakaoShareArgs,
    products: currentProductItemList,
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
    product: currentProductItemList,
    promotion: promotionInputs,
    current_rewards: selectedRewards,
    active,
    campaign_id,
  };

  const handleImageChange = (imgType: string, file: File, result: string) => {
    if (imgType === "image") {
      setImage("");
      setImageFile(file);
      setImage_result(result);
    } else {
      setShop_logo("");
      setImageLogoFile(file);
      setShop_logo_result(result);
    }
  };

  const onChangeImage =
    (imgType: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        alert("파일을 선택해주세요.");
        return;
      }
      if (!file || !file.type.startsWith("image/")) {
        alert("이미지 파일을 업로드 해주시기 바랍니다.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          handleImageChange(imgType, file, reader.result);
        }
      };
      reader.readAsDataURL(file);
    };

  const handleImageDelete = async (
    previousFilePath: string,
    imgType: string,
  ) => {
    try {
      await S3AuthDelete(previousFilePath);
      handleTempImageDelete(imgType);
    } catch (error) {
      console.error("Failed to delete previous file:", error);
    }
  };
  const handleTempImageDelete = (imgType: string) => {
    if (imgType === "image") {
      setImage("");
      setImageFile(undefined);
      setImage_result("");
    } else {
      setShop_logo("");
      setImageLogoFile(undefined);
      setShop_logo_result("");
    }
  };
  const uploadImage = async (
    file: File,
    imgType: string,
    previousFilePath: string,
  ) => {
    try {
      if (previousFilePath) {
        await handleImageDelete(previousFilePath, imgType);
      }
      const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const finaleFileExtension = `.${fileExtension}`;
      const timestamp = new Date().toISOString().slice(0, 16).replace("T", "_");
      const fileName = `standalone/${imgType === "image" ? "kakaoShare_image" : "kakaoShare_logo_img"}_${timestamp}${finaleFileExtension}`;
      const path = `${environment}/${shop_id}/${campaign_id}/kakaoshare/${imgType}/${fileName}`;
      const url = await S3AuthUpload(path, file);
      const previewUrl = URL.createObjectURL(file);
      if (imgType === "image") {
        setImage_result(previewUrl);
      } else {
        setShop_logo_result(previewUrl);
      }

      return url;
    } catch (error) {
      console.error("Image Upload Failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;

    if (id === "modify_item" && confirm("아이템을 수정하시겠습니까?")) {
      if (loading == false) {
        setLoading(true);
        try {
          let updatedImage = image;
          let updatedShopLogo = shop_logo;

          if (imageFile) {
            const url = await uploadImage(imageFile, "image", prev_img);
            updatedImage = url;
            setImage(url);
          }

          if (imageLogoFile) {
            const logoUrl = await uploadImage(
              imageLogoFile,
              "shop_logo",
              prev_shop_logo,
            );
            updatedShopLogo = logoUrl;
            setShop_logo(logoUrl);
          }

          const updatedItemArgs = {
            ...itemModifyArgs,
            kakao_args: {
              ...kakaoShareArgs,
              image: updatedImage,
              shop_logo: updatedShopLogo,
            },
          };

          const result = await fetchModifyItem(
            updatedItemArgs,
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
        } catch (e) {
          setLoading(false);
          console.error("handlesubmit error: ", e);
        }
      }
    } else if (id === "cancel_item") {
      router.push(`/campaign/details?campaign_id=${campaign_id}`);
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
            <span className="text-[24px] font-bold">아이템 상세</span>
          </div>
        </div>
        <div className="flex w-full flex-col justify-center gap-[10px] lg:flex-row">
          <ContentsContainer variant="campaign">
            <ItemDetails
              page_type="DETAILS"
              itemArgs={itemArgs}
              kakaoShareArgs={kakaoShareArgs}
              setItem_type={setItem_type}
              setTitle={setTitle}
              setKakaoShareArgs={setKakaoShareArgs}
              setCurrentProductItemList={setCurrentProductItemList}
              setPromotionInputs={setPromotionInputs}
              handleKeyDown={handleKeyDown}
              image={image}
              shop_logo={shop_logo}
              image_result={image_result}
              shop_logo_result={shop_logo_result}
              onChangeImage={onChangeImage}
              disableInput={false}
              handleTempImageDelete={handleTempImageDelete}
              campaign_id={campaign_id}
            />
          </ContentsContainer>
          <ContentsContainer variant="campaign">
            <ItemTypeDetails
              page_type="DETAILS"
              item_type={item_type}
              itemArgs={itemArgs}
              description={description}
              currentProductItemList={currentProductItemList}
              setPromotionInputs={setPromotionInputs}
              setDescription={setDescription}
              setItem_type={setItem_type}
              setCurrentProductItemList={setCurrentProductItemList}
              handleKeyDown={handleKeyDown}
              disableInput={false}
            />
            <RewardComponentDetails
              apiResponse={couponResponse}
              disableInput={false}
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
            id="cancel_item"
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
