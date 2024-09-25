import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import { fetchCreateItem, fetchGetProductCodeList, fetchGetPromotionCodeList } from "@/lib/item/apis";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemTypeDetails from "@/components/layout/item/ItemTypeDetails";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import PromotionList from "@/components/layout/item/PromotionList";
import RewardComponent from "@/components/layout/item/RewardList";
import ItemDetails from "@/components/layout/item/ItemDetails";
import ProductList from "@/components/layout/item/ProductList";
import RewardCard from "@/components/layout/item/RewardCard";
import { useState, useRef, KeyboardEvent } from "react";
import { getShopIdFromCookies } from "@/lib/helper";
import ReactS3Client from "@/context/ReactS3Client";
import Modal from "@/components/layout/base/Modal";
import { ApiResponse } from "@/lib/types";
import { useRouter } from "next/router";
import {
  ItemType,
  ItemArgs,
  ProductsArgs,
  PromotionsArgs,
  RewardType,
  RewardsArgs,
  KakaoShareArgs,
} from "@/lib/item/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const shop_id = getShopIdFromCookies(context);
  const campaign_id = context.query.campaign_id;
  const productResponse = await fetchGetProductCodeList(campaign_id, context);
  const promotionResponse = await fetchGetPromotionCodeList(campaign_id, context);
  if (!shop_id || !campaign_id) {
    return {
      redirect: {
        destination: "auth/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      shop_id: shop_id,
      campaign_id: campaign_id,
      productResponse: productResponse,
      promotionResponse: promotionResponse,
    },
  };
};

const NewItem = (
  {
    shop_id,
    campaign_id,
    productResponse,
    promotionResponse,
  }: { shop_id: string; campaign_id: string; productResponse: ApiResponse; promotionResponse: ApiResponse },
  context: GetServerSidePropsContext
) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>([{ description: "" }]);
  const [productInputs, setProductInputs] = useState<ProductsArgs[]>([
    {
      product_model_code: "",
      product_model_name: "",
      images: [
        {
          posThumb: "",
        },
        {
          thumb: "",
        },
      ],
    },
  ]);
  const [kakaoShareArgs, setKakaoShareArgs] = useState<KakaoShareArgs>({
    shop_name: "",
    image: "/images/kakao/kakaolink-no-logo-default.png",
    shop_logo: "/images/kakao/kakaolink-no-logo-default.png",
    title: "",
    description: "",
    button_name: "",
  });
  const [rewards, setRewards] = useState<RewardsArgs[]>([]);
  const [item_type, setItem_type] = useState<ItemType>(ItemType.PD);
  const [reward_type, setReward_Type] = useState<RewardType>(RewardType.CO);
  const [image, setImage] = useState<string>(kakaoShareArgs.image);
  const [image_result, setImage_result] = useState<string>("");
  const [shop_logo, setShop_logo] = useState<string>(kakaoShareArgs.shop_logo);
  const [shop_logo_result, setShop_logo_result] = useState<string>("");
  const [active, setActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const openModal = () => {
    if (reward_type) {
      // Check if reward_type is not an empty string
      setIsModalOpen(true);
    } else {
      alert("리워드 종류를 선택해주세요.");
    }
  };
  const itemArgs: ItemArgs = {
    title,
    item_type,
    kakao_args: kakaoShareArgs,
    products: productInputs,
    promotions: promotionInputs,
    rewards,
    campaign_id,
    active,
  };
  const infoCheck = () => {
    if (!title) {
      alert("아이템 명을 입력해주세요.");
      return false;
    }
    if (!productInputs[0].product_model_code && !promotionInputs[0].description) {
      alert("아이템 적용을 원하시는 상품 혹은 쿠폰을 추가해주세요.");
      return false;
    }
    if (
      !rewards.length &&
      !confirm("해당 아이템에 아직 리워드가 추가되지 않았어요, 그래도 아이템 생성을 원하시나요?")
    ) {
      return false;
    }
    return true;
  };
  const onChangeImage = (imgType: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.result && typeof reader.result === "string") {
        if (imgType === "image") {
          setImage_result(reader.result);
          try {
            let imgUrl = await uploadImage(file, imgType, image);
            if (imgUrl) {
              imgUrl = `${imgUrl}.${fileExtension}`;
              setImage(imgUrl);
              setKakaoShareArgs((prevArgs) => ({ ...prevArgs, image: imgUrl }));
            }
          } catch (error) {
            console.error("Image upload failed:", error);
          }
        } else if (imgType === "shop_logo") {
          setShop_logo_result(reader.result);
          try {
            let logoUrl = await uploadImage(file, imgType, shop_logo);
            if (logoUrl) {
              logoUrl = `${logoUrl}.${fileExtension}`;
              setShop_logo(logoUrl);
              setKakaoShareArgs((prevArgs) => ({ ...prevArgs, shop_logo: logoUrl }));
            }
          } catch (error) {
            console.error("Logo upload failed:", error);
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  //이전 이미지 삭제
  const deletePreviousFile = async (previousFilePath: string): Promise<void> => {
    try {
      await ReactS3Client.deleteFile(previousFilePath);
    } catch (error) {
      console.error("Failed to delete previous file:", error);
    }
  };

  // 업로드 이미지
  const uploadImage = async (file: File, imgType: string, previousFilePath: string): Promise<string> => {
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
    const image_img_name = `kakaoShare_image_${shop_id}_${campaign_id}`;
    const shop_logo_img_name = `kakaoShare_logo_img_${shop_id}_${campaign_id}`;
    const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const fileName = imgType === "image" ? `${image_img_name}_${currentDate}` : `${shop_logo_img_name}_${currentDate}`;
    const path = `standalone/${environment}/${shop_id}/${campaign_id}/kakaoshare/${imgType}/${fileName}`;
    try {
      if (previousFilePath != "") {
        await deletePreviousFile(previousFilePath); // Delete previous image or logo
      }
      await ReactS3Client.uploadFile(file, path);
      return path;
    } catch (error) {
      console.error("Image Upload Failed:", error);
      throw error;
    }
  };

  //아이템 저장
  const handleSubmit = async (event: React.FormEvent) => {
    if (event.currentTarget.id === "create_item" && infoCheck()) {
      const result = await fetchCreateItem(itemArgs, campaign_id, context);
      if (result.status === 200) {
        alert(result.message);
        if (result.success) {
          router.push(`/campaign/details?campaign_id=${campaign_id}`);
        }
      } else {
        alert(`리퍼럴 생성을 실패하였습니다. 상태 코드: ${result.status}`);
      }
    } else if (event.currentTarget.id === "cancel_create_item") {
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

  return (
    <>
      <DashboardContainer>
        <div className="flex w-full justify-between items-center mb-3 h-[42px]">
          <div className="subject-container flex w-full">
            <a className="text-2xl font-bold">아이템 추가</a>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row w-full justify-center lg:space-x-4">
          <ContentsContainer variant="campaign">
            <ItemDetails
              page_type="NEW"
              itemArgs={itemArgs}
              kakaoShareArgs={kakaoShareArgs}
              campaign_id={campaign_id}
              active={active}
              setItem_type={setItem_type}
              setTitle={setTitle}
              setKakaoShareArgs={setKakaoShareArgs}
              setProductInputs={setProductInputs}
              setPromotionInputs={setPromotionInputs}
              setActive={setActive}
              handleKeyDown={handleKeyDown}
              image={image}
              shop_logo={shop_logo}
              image_result={image_result}
              shop_logo_result={shop_logo_result}
              onChangeImage={onChangeImage}
            />
          </ContentsContainer>
          <ContentsContainer variant="campaign">
            <ItemTypeDetails
              page_type="NEW"
              item_type={item_type}
              itemArgs={itemArgs}
              productInputs={productInputs}
              promotionInputs={promotionInputs}
              setItem_type={setItem_type}
              setProductInputs={setProductInputs}
              setPromotionInputs={setPromotionInputs}
              openModal={openModal}
            />
            <RewardComponent
              page_type="NEW"
              handleKeyDown={handleKeyDown}
              reward_type={reward_type}
              setRewardType={setReward_Type}
              rewards={rewards}
              setRewards={setRewards}
            />
            <RewardCard rewards={rewards} setRewards={setRewards} page_type="NEW" />
          </ContentsContainer>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            {item_type == ItemType.PD ? (
              <ProductList apiResponse={productResponse} campaign_id={campaign_id} />
            ) : (
              <PromotionList apiResponse={promotionResponse} campaign_id={campaign_id} />
            )}
          </Modal>
        </div>
        <div className="button-container w-full pt-4 flex justify-between lg:justify-end">
          <div className="flex space-x-2 w-full lg:w-fit">
            <button
              className="border p-2 w-full lg:w-fit text-white rounded-lg cursor-pointer flex items-center justify-center bg-gray-400"
              onClick={handleSubmit}
              id="cancel_create_item"
            >
              취소하기
            </button>
            <button
              className="border p-2 w-full lg:w-fit text-white rounded-lg cursor-pointer flex items-center justify-center bg-blue-500"
              onClick={handleSubmit}
              id="create_item"
            >
              저장하기
            </button>
          </div>
        </div>
      </DashboardContainer>
    </>
  );
};

export default NewItem;
