import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ItemTypeDetails from "@/components/layout/item/item/ItemTypeDetails";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import ItemDetails from "@/components/layout/item/item/ItemDetails";
import { useRef, useEffect, KeyboardEvent, useState } from "react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { getShopIdFromCookies } from "@/lib/helper";
import { withAuth } from "@/hoc/withAuth";
import { ApiResponse } from "@/lib/types";
import { useRouter } from "next/router";
import {
  fetchGetProductCodeList,
  fetchGetCouponCodeList,
  fetchCreateItem,
} from "@/lib/item/apis";
import {
  ProductsArgs,
  PromotionsArgs,
  CouponsArgs,
  KakaoShareArgs,
  RewardsArgs,
  ItemType,
  RewardType,
  ItemArgs,
} from "@/lib/item/types";
import NewRewardComponent from "@/components/layout/item/reward/new/NewRewardComponent";
import NewRewardCard from "@/components/layout/item/reward/new/NewRewardCard";
import ProductList from "@/components/layout/item/modal/ProductList";
import { S3AuthDelete, S3AuthUpload } from "@/lib/common";
import { url } from "inspector";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const shop_id = getShopIdFromCookies(context);
  const campaign_id = context.query.campaign_id;

  const productResponse = await fetchGetProductCodeList(context);
  const couponResponse = await fetchGetCouponCodeList("1", "10", context);
  if (!shop_id || !campaign_id) {
    return { redirect: { destination: "auth/login", permanent: false } };
  }
  return {
    props: { shop_id, campaign_id, productResponse, couponResponse },
  };
};

const NewItem = (
  {
    shop_id,
    campaign_id,
    productResponse,
    couponResponse,
  }: {
    shop_id: string;
    campaign_id: string;
    productResponse: ApiResponse;
    couponResponse: ApiResponse;
  },
  context: GetServerSidePropsContext,
) => {
  // const [pageNum, setPageNum] = useState("1");
  // const [pageSize, setPageSize] = useState("10");
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [productInputs, setProductInputs] = useState<ProductsArgs[]>([]);
  const [description, setDescription] = useState("");
  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>([
    { description: description },
  ]);
  const [couponInputs, setCouponInputs] = useState<CouponsArgs[]>([]);
  const [selectedProductItems, setSelectedProductItems] = useState<
    ProductsArgs[]
  >([]);
  const [selectedCouponItems, setSelectedCouponItems] = useState<CouponsArgs[]>(
    [],
  );
  const [kakaoShareArgs, setKakaoShareArgs] = useState<KakaoShareArgs>({
    shop_name: "",
    image: "",
    shop_logo: "",
    title: "",
    description: "",
    button_name: "",
  });
  const [rewards, setRewards] = useState<RewardsArgs[]>([]);
  const [item_type, setItem_type] = useState<ItemType>(ItemType.PD);
  const [reward_type, setReward_Type] = useState<RewardType>(RewardType.CO);
  const [image, setImage] = useState<string>(kakaoShareArgs.image);
  const [image_result, setImage_result] = useState<string>("");
  const [imageFile, setImageFile] = useState<File>();
  const [shop_logo, setShop_logo] = useState<string>(kakaoShareArgs.shop_logo);
  const [shop_logo_result, setShop_logo_result] = useState<string>("");
  const [imageLogoFile, setImageLogoFile] = useState<File>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () =>
    reward_type ? setIsModalOpen(true) : alert("리워드 종류를 선택해주세요.");

  const itemArgs: ItemArgs = {
    title,
    item_type,
    kakao_args: kakaoShareArgs,
    products: productInputs,
    promotions: promotionInputs,
    rewards,
    campaign_id,
    active: false,
  };

  const infoCheck = (): boolean => {
    if (!title) {
      alert("아이템 명을 입력해주세요.");
      return false;
    }
    if (!productInputs.length && !promotionInputs.length) {
      alert("아이템 적용을 원하시는 상품 혹은 쿠폰을 추가해주세요.");
      return false;
    }
    if (
      item_type === ItemType.PD &&
      productInputs.some((p) => !p.product_model_code || !p.product_model_name)
    ) {
      alert("유효한 상품 모델 코드를 입력해주세요.");
      return false;
    }
    if (
      item_type !== ItemType.PD &&
      promotionInputs.some((p) => !p.description)
    ) {
      alert("프로모션 설명을 입력해주세요.");
      return false;
    }
    if (
      !kakaoShareArgs.shop_name ||
      !kakaoShareArgs.title ||
      !kakaoShareArgs.description ||
      !kakaoShareArgs.button_name
    ) {
      alert("카카오 공유 메시지 관련 정보를 입력해주세요.");
      return false;
    }
    if (
      !rewards.length &&
      !confirm("리워드가 없습니다. 그래도 계속 진행하시겠습니까?")
    ) {
      return false;
    }
    return true;
  };

  const handleImageChange = (imgType: string, file: File, result: string) => {
    if (imgType === "image") {
      setImageFile(file);
      setImage_result(result);
    } else {
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
    console.log("previousFilePath", previousFilePath);
    try {
      await S3AuthDelete(previousFilePath);
      if (imgType === "image") {
        setImage("");
      } else {
        setShop_logo("");
      }
      console.log(`Previous file deleted: ${previousFilePath}`);
    } catch (error) {
      console.error("Failed to delete previous file:", error);
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

      const fileName = `standalone/${imgType === "image" ? "kakaoShare_image" : "kakaoShare_logo_img"}_${shop_id}_${campaign_id}_${timestamp}${finaleFileExtension}`;
      const path = `${environment}/${shop_id}/${campaign_id}/kakaoshare/${imgType}/${fileName}`;
      const url = await S3AuthUpload(path, file);
      const previewUrl = URL.createObjectURL(file);
      if (imgType === "image") {
        setImage_result(previewUrl);
      } else {
        setShop_logo_result(previewUrl);
      }
      console.log("url", url);
      return url;
    } catch (error) {
      console.error("Image Upload Failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;
    if (productInputs.length === 0) {
      setProductInputs([
        {
          product_model_code: "",
          product_model_name: "",
          images: [{ posThumb: "" }, { thumb: "" }],
        },
      ]);
    }

    if (
      id === "create_item" &&
      infoCheck() &&
      confirm("아이템을 추가하시겠습니까?")
    ) {
      if (loading == false) {
        setLoading(true);
        try {
          let updatedImage = image;
          let updatedShopLogo = shop_logo;

          if (imageFile) {
            const url = await uploadImage(imageFile, "image", image);
            updatedImage = url;
            setImage(url);
          }

          if (imageLogoFile) {
            const logoUrl = await uploadImage(
              imageLogoFile,
              "shop_logo",
              shop_logo,
            );
            updatedShopLogo = logoUrl;
            setShop_logo(logoUrl);
          }
          const updatedItemArgs = {
            ...itemArgs,
            kakao_args: {
              ...kakaoShareArgs,
              image: updatedImage,
              shop_logo: updatedShopLogo,
            },
          };

          const result = await fetchCreateItem(
            updatedItemArgs,
            campaign_id,
            context,
          );
          if (result.status === 200) {
            alert(result.message);
            setLoading(false);
            if (result.success)
              router.push(`/campaign/details?campaign_id=${campaign_id}`);
          } else {
            setLoading(false);
            alert(`리퍼럴 생성을 실패하였습니다. 상태 코드: ${result.status}`);
          }
        } catch (e) {
          setLoading(false);
          console.error(`리퍼럴 생성을 실패하였습니다. 상태 코드:`, e);
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
    setPromotionInputs([{ description }]);
  }, [description]);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <LoadingSpinner />
        </div>
      )}
      <DashboardContainer>
        <div className="mb-3 flex h-[42px] w-full items-center justify-between">
          <div className="subject-container flex w-full">
            <span className="text-2xl font-bold">아이템 추가</span>
          </div>
        </div>
        <div className="flex w-full flex-col justify-center lg:flex-row lg:space-x-4">
          <ContentsContainer variant="campaign">
            <ItemDetails
              page_type="NEW"
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
              handleImageDelete={handleImageDelete}
            />
          </ContentsContainer>
          <ContentsContainer variant="campaign">
            <ItemTypeDetails
              page_type="NEW"
              item_type={item_type}
              itemArgs={itemArgs}
              selectedProductItems={selectedProductItems}
              description={description}
              setPromotionInputs={setPromotionInputs}
              setDescription={setDescription}
              setItem_type={setItem_type}
              setProductInputs={setProductInputs}
              openModal={openModal}
              handleKeyDown={handleKeyDown}
              disableInput={false}
            />
            <NewRewardComponent
              handleKeyDown={handleKeyDown}
              reward_type={reward_type}
              selectedCouponItems={selectedCouponItems}
              couponInputs={couponInputs}
              setRewardType={setReward_Type}
              setRewards={setRewards}
              disableInput={false}
              apiResponse={couponResponse}
              setSelectedCouponItems={setSelectedCouponItems}
              setCouponInputs={setCouponInputs}
            />
            <NewRewardCard rewards={rewards} setRewards={setRewards} />
          </ContentsContainer>
        </div>
        <div className="button-container flex w-full justify-between pt-4 lg:justify-end">
          <div className="flex w-full space-x-2 lg:w-fit">
            <button
              className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-gray-400 p-2 text-white lg:w-fit"
              onClick={handleSubmit}
              id="cancel_item"
            >
              취소하기
            </button>
            <button
              className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-blue-500 p-2 text-white lg:w-fit"
              onClick={handleSubmit}
              id="create_item"
            >
              저장하기
            </button>
          </div>
        </div>
        <ProductList
          apiResponse={productResponse}
          productInputs={productInputs}
          setSelectedProductItems={setSelectedProductItems}
          setProductInputs={setProductInputs}
          onClose={closeModal}
          isOpen={isModalOpen}
        />
      </DashboardContainer>
    </>
  );
};

export default withAuth(NewItem);
