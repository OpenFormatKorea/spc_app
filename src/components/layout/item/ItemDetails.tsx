import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";
import ItemTypeComponent from "@/components/layout/item/ItemTypeComponent";
import { ItemArgs, ItemType, KakaoArgs, ProductsArgs, PromotionsArgs } from "@/pages/item/lib/types";
import { KeyboardEvent, useState } from "react";
interface ItemDetailsProps {
  item_type: ItemType;
  itemArgs: ItemArgs;
  kakao_message: string;
  setItem_type: (value: ItemType) => void;
  setTitle: (value: string) => void;
  setProducts: (value: ProductsArgs[]) => void;
  setPromotions: (value: PromotionsArgs[]) => void;
  setKakao_message: (value: string) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({
  item_type,
  itemArgs,
  kakao_message,
  setItem_type,
  setTitle,
  setProducts,
  setPromotions,
  setKakao_message,
  handleKeyDown,
}) => {
  const [productInputs, setProductInputs] = useState<string[]>([""]);
  const [promotionInputs, setPromotionInputs] = useState<string[]>([""]);
  const inputformClass = "inputformClass flex flex-col text-left w-full mb-2";
  const labelClass = "labelClass text-sm font-bold mt-4";
  const handleItemTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem_type(e.target.value as ItemType);
  };

  const handleAddInput = () => {
    if (item_type === ItemType.PD) {
      setProductInputs([...productInputs, ""]);
    } else if (item_type === ItemType.PM) {
      setPromotionInputs([...promotionInputs, ""]);
    }
  };
  return (
    <>
      <div className="contents-container w-full justify-center items-center">
        <div className={inputformClass}>
          <label className={labelClass}>아이템 명</label>
          <InputTextBox
            type="text"
            id="title"
            placeholder="아이템 명을 입력하세요."
            value={itemArgs.title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={inputformClass}>
          <label className={labelClass}>카카오 메세지</label>
          <InputTextBox
            type="text"
            id="message"
            placeholder="카카오 메세지를 입력하세요."
            value={kakao_message}
            onChange={(e) => setKakao_message(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className={inputformClass}>
          <label className={labelClass}>아이템 종류</label>
          <div className="flex  mb-2 ">
            <div className="flex space-x-20 text-left w-full lg:w-[360px]">
              <InputRadioBox
                label="프로덕트"
                name="item_type"
                value={ItemType.PD}
                checked={itemArgs.item_type === ItemType.PD}
                onChange={handleItemTypeRadioChange}
              />
              <InputRadioBox
                label="프로모션"
                name="item_type"
                value={ItemType.PM}
                checked={itemArgs.item_type === ItemType.PM}
                onChange={handleItemTypeRadioChange}
              />
            </div>
            <div
              id="create_item_container"
              className="border p-1 bg-blue-500 text-white rounded-lg min-w-[45px] text-center cursor-pointer"
              onClick={handleAddInput}
            >
              추가
            </div>
          </div>

          <ItemTypeComponent
            productInputs={productInputs}
            promotionInputs={promotionInputs}
            item_type={item_type}
            setProducts={setProducts}
            setPromotions={setPromotions}
            setProductInputs={setProductInputs}
            setPromotionInputs={setPromotionInputs}
          />
        </div>
      </div>
    </>
  );
};
export default ItemDetails;
