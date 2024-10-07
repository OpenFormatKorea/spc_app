import ContentsContainer from "@/components/layout/base/ContentsContainer";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ItemNew from "@/components/layout/item/item/ItemNew";
import ItemTypeDetails from "@/components/layout/item/item/ItemTypeDetails";
import ProductList from "@/components/layout/item/modal/ProductList";
import RewardCard from "@/components/layout/item/reward/RewardCard";
import RewardComponent from "@/components/layout/item/reward/RewardComponent";
import { getShopIdFromCookies } from "@/lib/helper";
import { fetchGetProductCodeList, fetchGetCouponCodeList, fetchCreateItem } from "@/lib/item/apis";
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
import { ApiResponse } from "@/lib/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import ReactS3Client from "@/lib/aws/ReactS3Client";
import ItemDetails from "@/components/layout/item/item/ItemDetails";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const shop_id = getShopIdFromCookies(context);
  const campaign_id = context.query.campaign_id;
  const productResponse = await fetchGetProductCodeList(context);
  const couponResponse = await fetchGetCouponCodeList(context);

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
  context: GetServerSidePropsContext
) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [productInputs, setProductInputs] = useState<ProductsArgs[]>([
    { product_model_code: "", product_model_name: "", images: [{ posThumb: "" }, { thumb: "" }] },
  ]);
  const [description, setDescription] = useState("");
  const [promotionInputs, setPromotionInputs] = useState<PromotionsArgs[]>([{ description: description }]);
  const [couponInputs, setCouponInputs] = useState<CouponsArgs[]>([]);
  const [selectedProductItems, setSelectedProductItems] = useState<ProductsArgs[]>([]);
  const [selectedCouponItems, setSelectedCouponItems] = useState<CouponsArgs[]>([]);
  const [kakaoShareArgs, setKakaoShareArgs] = useState<KakaoShareArgs>({
    shop_name: "",
    image: "images/kakao/kakaolink-no-logo-default.png",
    shop_logo: "images/kakao/kakaolink-no-logo-default.png",
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => (reward_type ? setIsModalOpen(true) : alert("리워드 종류를 선택해주세요."));

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

  const infoCheck = () => {
    if (!title) {
      alert("아이템 명을 입력해주세요.");
      return false;
    }
    if (!productInputs[0].product_model_code && !promotionInputs[0].description) {
      alert("아이템 적용을 원하시는 상품 혹은 쿠폰을 추가해주세요.");
      return false;
    }
    if (!kakaoShareArgs.shop_name) {
      alert("숍 이름을 입력해주세요.");
      return false;
    }
    if (!kakaoShareArgs.title) {
      alert("카카오 공유 메시지 타이틀을 입력해주세요.");
      return false;
    }
    if (!kakaoShareArgs.description) {
      alert("카카오 공유 메시지 설명을 입력해주세요.");
      return false;
    }
    if (!kakaoShareArgs.button_name) {
      alert("카카오 공유 버튼 이름을 입력해주세요.");
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
        try {
          const imgUrl = await uploadImage(file, imgType, imgType === "image" ? image : shop_logo);
          if (imgType === "image") {
            setImage_result(reader.result);
            setImage(`${imgUrl}.${fileExtension}`);
            setKakaoShareArgs((prevArgs) => ({ ...prevArgs, image: imgUrl }));
          } else {
            setShop_logo_result(reader.result);
            setShop_logo(`${imgUrl}.${fileExtension}`);
            setKakaoShareArgs((prevArgs) => ({ ...prevArgs, shop_logo: imgUrl }));
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
      await ReactS3Client.deleteFile(previousFilePath);
    } catch (error) {
      console.error("Failed to delete previous file:", error);
    }
  };

  const uploadImage = async (file: File, imgType: string, previousFilePath: string) => {
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
    const fileName = `${imgType === "image" ? "kakaoShare_image" : "kakaoShare_logo_img"}_${shop_id}_${campaign_id}_${new Date().toISOString().split("T")[0].replace(/-/g, "")}`;
    const path = `standalone/${environment}/${shop_id}/${campaign_id}/kakaoshare/${imgType}/${fileName}`;

    try {
      if (previousFilePath) await deletePreviousFile(previousFilePath);
      await ReactS3Client.uploadFile(file, path);
      return path;
    } catch (error) {
      console.error("Image Upload Failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;
    if (id === "create_item" && infoCheck()) {
      const result = await fetchCreateItem(itemArgs, campaign_id, context);
      if (result.status === 200) {
        alert(result.message);
        if (result.success) router.push(`/campaign/details?campaign_id=${campaign_id}`);
      } else {
        alert(`리퍼럴 생성을 실패하였습니다. 상태 코드: ${result.status}`);
      }
    } else if (id === "cancel_create_item") {
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
          <RewardComponent
            page_type="NEW"
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
          <RewardCard page_type="NEW" rewards={rewards} setRewards={setRewards} />
        </ContentsContainer>
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
      <ProductList
        apiResponse={productResponse}
        productInputs={productInputs}
        setSelectedProductItems={setSelectedProductItems}
        setProductInputs={setProductInputs}
        onClose={closeModal}
        isOpen={isModalOpen}
      />
    </DashboardContainer>
  );
};

export default NewItem;
