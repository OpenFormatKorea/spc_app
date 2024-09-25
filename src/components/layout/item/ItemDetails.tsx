import InputTextBox from "@/components/base/InputText";
import KakaoShareTemplate from "@/components/base/KakaoShareTemplate";
import { fetchActivateItem } from "@/lib/item/apis";
import { ItemType, ItemArgs, ProductsArgs, PromotionsArgs, KakaoShareArgs } from "@/lib/item/types";
import { GetServerSidePropsContext } from "next";
import { useState, useEffect } from "react";

interface ItemDetailsProps {
  page_type: "DETAILS" | "NEW";
  itemArgs: ItemArgs;
  kakaoShareArgs: KakaoShareArgs;
  campaign_id: string;
  active: boolean;
  image: string;
  shop_logo: string;
  image_result?: string;
  shop_logo_result?: string;
  setKakaoShareArgs: (kakaoShareArgs: KakaoShareArgs) => void;
  setItem_type: (value: ItemType) => void;
  setTitle: (value: string) => void;
  setProductInputs: React.Dispatch<React.SetStateAction<ProductsArgs[]>>;
  setPromotionInputs: React.Dispatch<React.SetStateAction<PromotionsArgs[]>>;
  setActive: (value: boolean) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChangeImage: (imgType: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = (
  {
    page_type,
    itemArgs,
    kakaoShareArgs,
    campaign_id,
    active,
    image,
    shop_logo,
    image_result,
    shop_logo_result,
    setKakaoShareArgs,
    setTitle,
    setProductInputs,
    setPromotionInputs,
    setActive,
    handleKeyDown,
    onChangeImage,
  },
  context: GetServerSidePropsContext
) => {
  const [disableInput, setDisableInput] = useState(false);

  const inputFormClass = "inputForm flex flex-col text-left w-full pb-2";
  const labelClass = "text-xs pt-4 text-gray-500";
  const item_id = itemArgs.id || "";

  const handleActiveStatus = async () => {
    const newActiveStatus = !itemArgs.active;
    if (page_type === "DETAILS" && confirm("아이템 활성화 상태를 변경하시겠어요?")) {
      setActive(newActiveStatus);
      const result = await fetchActivateItem(item_id, campaign_id, context);
      if (result.status !== 200) {
        alert("아이템 활성화 상태를 변경 실패 하였습니다. 상태 코드: " + result.status);
        setActive(!newActiveStatus);
      }
    }
  };

  useEffect(() => {
    if (page_type === "NEW") {
      disableInput == false;
    } else if (page_type === "DETAILS") {
      disableInput == true;
      setProductInputs(itemArgs.products);
      setPromotionInputs(itemArgs.promotions);
    }
  }, [page_type, itemArgs.products, itemArgs.promotions]);

  return (
    <>
      <div className="contents-container w-full justify-center items-center">
        <h1 className="font-bold text-xl pb-2 border-b-[1px] flex items-center justify-between">
          <div>아이템 옵션</div>
          {page_type === "DETAILS" && (
            <div>
              <input
                type="checkbox"
                className="peer sr-only opacity-0"
                id="item-activation"
                name="active"
                checked={active}
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
        <div className={inputFormClass}>
          <label className={labelClass}>아이템 명</label>
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
        image={image}
        shop_logo={shop_logo}
        page_type={page_type}
        disableInput={disableInput}
        kakaoShareArgs={kakaoShareArgs}
        setKakaoShareArgs={setKakaoShareArgs}
        handleKeyDown={handleKeyDown}
        image_result={image_result}
        shop_logo_result={shop_logo_result}
        onChangeImage={onChangeImage}
      />
    </>
  );
};

export default ItemDetails;
