import InputTextBox from "@/components/base/InputText";
import KakaoShareTemplate from "@/components/base/KakaoShareTemplate";
import { fetchActivateItem } from "@/lib/item/apis";
import { ItemType, ItemArgs, ProductsArgs, PromotionsArgs, KakaoShareArgs } from "@/lib/item/types";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";

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
  setProductInputs: React.Dispatch<React.SetStateAction<ProductsArgs[]>>;
  setPromotionInputs: React.Dispatch<React.SetStateAction<PromotionsArgs[]>>;
  setActive?: (value: boolean) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChangeImage?: (imgType: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  campaign_id?: string;
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
    setProductInputs,
    setPromotionInputs,
    setActive,
    handleKeyDown,
    onChangeImage,
    campaign_id,
  },
  context: GetServerSidePropsContext
) => {
  useEffect(() => {
    if (page_type === "DETAILS") {
      setProductInputs(itemArgs.products);
      setPromotionInputs(itemArgs.promotions);
    }
  }, [page_type, itemArgs.products, itemArgs.promotions, setProductInputs, setPromotionInputs]);

  const handleActiveStatus = async () => {
    if (page_type === "DETAILS" && setActive && campaign_id && itemArgs.id) {
      const newActiveStatus = !itemArgs.active;
      if (confirm("아이템 활성화 상태를 변경하시겠어요?")) {
        setActive(newActiveStatus);
        const result = await fetchActivateItem(itemArgs.id, campaign_id, context);
        if (result.status !== 200) {
          alert("아이템 활성화 상태를 변경 실패 하였습니다. 상태 코드: " + result.status);
          setActive(!newActiveStatus);
        }
      }
    }
  };

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
                checked={itemArgs.active}
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
        <div className="inputForm flex flex-col text-left w-full pb-2">
          <label className="text-xs pt-4 text-gray-500">아이템 명</label>
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