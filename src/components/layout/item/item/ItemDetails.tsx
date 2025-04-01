import InputTextBox from "@/components/base/InputText";
import KakaoShareTemplate from "@/components/base/KakaoShareTemplate";
import { fetchGetCampaignStatus } from "@/lib/campaign/apis";
import { fetchActivateItem } from "@/lib/item/apis";
import {
  ItemType,
  ItemArgs,
  ProductsArgs,
  PromotionsArgs,
  KakaoShareArgs,
} from "@/lib/item/types";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";

interface ItemDetailsProps {
  page_type: "DETAILS" | "NEW";
  itemArgs: ItemArgs;
  kakaoShareArgs: KakaoShareArgs;
  image: string;
  shop_logo: string;
  image_result?: string;
  shop_logo_result?: string;
  disableInput: boolean;
  setKakaoShareArgs: (kakaoShareArgs: KakaoShareArgs) => void;
  setItem_type: (value: ItemType) => void;
  setTitle: (value: string) => void;
  setCurrentProductItemList: React.Dispatch<
    React.SetStateAction<ProductsArgs[]>
  >;
  setPromotionInputs: React.Dispatch<React.SetStateAction<PromotionsArgs[]>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChangeImage: (
    imgType: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  campaign_id?: string;
  handleTempImageDelete: (imgType: string) => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = (
  {
    page_type,
    itemArgs,
    kakaoShareArgs,
    image,
    shop_logo,
    image_result,
    shop_logo_result,
    disableInput,
    setKakaoShareArgs,
    setTitle,
    setCurrentProductItemList,
    setPromotionInputs,
    handleKeyDown,
    onChangeImage,
    campaign_id,
    handleTempImageDelete,
  },
  context: GetServerSidePropsContext,
) => {
  const [itemActiveStatus, setItemActiveStatus] = useState<boolean>(
    itemArgs.active,
  );
  const [campaignActiveStatus, setCampaignActiveStatus] =
    useState<boolean>(false);
  useEffect(() => {
    if (page_type === "DETAILS") {
      setCurrentProductItemList(itemArgs.products);
      setPromotionInputs(itemArgs.promotions);
    }
  }, [itemArgs.products, itemArgs.promotions]);

  const handleActiveStatus = async () => {
    // 기본 조건 확인
    if (!campaignActiveStatus) {
      alert("캠페인이 비활성화 상태입니다. 아이템을 활성화할 수 없습니다.");
      return;
    }

    if (page_type !== "DETAILS" || !campaign_id || !itemArgs.id) {
      console.warn("활성화 조건이 충족되지 않았습니다.");
      return;
    }

    const newActiveStatus = !itemActiveStatus;
    const confirmMessage = "아이템 활성화 상태를 변경하시겠어요?";
    const errorMessage = `아이템 활성화 상태 변경 실패.`;

    const confirmed = confirm(confirmMessage);
    if (!confirmed) return;

    try {
      const result = await fetchActivateItem(itemArgs.id, campaign_id, context);

      if (result.status !== 200) {
        alert(`${errorMessage} 상태 코드: ${result.status}`);
        setItemActiveStatus(!newActiveStatus); // 상태 롤백
      } else {
        setItemActiveStatus(newActiveStatus);
      }
    } catch (error) {
      console.error("아이템 활성화 요청 중 오류:", error);
      alert("아이템 활성화 상태 변경 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const getCampiangStatus = async () => {
      if (campaign_id) {
        try {
          const result = await fetchGetCampaignStatus(campaign_id, context);
          console.log("result", result.active);
          setCampaignActiveStatus(result.active);
        } catch (e) {
          console.error("Error: ", e);
        }
      }
    };
    getCampiangStatus();
  }, [campaign_id, itemActiveStatus]);
  return (
    <>
      <div className="contents-container w-full items-center justify-center">
        <h1 className="flex items-center justify-between border-b-[1px] pb-[5px] text-[18px] font-bold">
          <div>아이템 옵션</div>
          {page_type === "DETAILS" && (
            <div>
              <input
                type="checkbox"
                className="peer sr-only opacity-0"
                id="item-activation"
                name="active"
                checked={itemActiveStatus}
                onChange={handleActiveStatus}
              />
              <label
                htmlFor="item-activation"
                className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform peer-checked:bg-green-500 peer-checked:before:translate-x-full"
              >
                <span className="sr-only">Enable</span>
              </label>
            </div>
          )}
        </h1>
        <div className="inputForm flex w-full flex-col pb-[5px] text-left">
          <label className="pt-4 text-[12px] text-gray-500">아이템 명</label>
          <InputTextBox
            type="text"
            id="title"
            placeholder="아이템 명을 입력하세요."
            value={itemArgs.title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disableInput}
          />
        </div>
      </div>
      <KakaoShareTemplate
        page_type={page_type}
        disableInput={disableInput}
        kakaoShareArgs={kakaoShareArgs}
        setKakaoShareArgs={setKakaoShareArgs}
        handleKeyDown={handleKeyDown}
        image={image}
        shop_logo={shop_logo}
        image_result={image_result}
        shop_logo_result={shop_logo_result}
        onChangeImage={onChangeImage}
        handleTempImageDelete={handleTempImageDelete}
      />
    </>
  );
};

export default ItemDetails;
