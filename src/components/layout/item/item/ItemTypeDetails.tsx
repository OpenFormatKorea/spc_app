import InputRadioBox from "@/components/base/InputRadio";
import ItemTypeComponent from "@/components/layout/item/item/ItemTypeComponent";
import {
  inputFormClass,
  radioButtonLabelClass,
} from "@/interfaces/tailwindCss";
import {
  ItemArgs,
  ProductsArgs,
  ItemType,
  PromotionsArgs,
} from "@/lib/item/types";
import { useEffect } from "react";

interface ItemTypeDetailsProps {
  page_type: "DETAILS" | "NEW";
  item_type: ItemType;
  itemArgs: ItemArgs;
  currentProductItemList: ProductsArgs[];
  setCurrentProductItemList: React.Dispatch<
    React.SetStateAction<ProductsArgs[]>
  >;
  disableInput: boolean;
  description: string;
  setItem_type: (value: ItemType) => void;
  setPromotionInputs: React.Dispatch<React.SetStateAction<PromotionsArgs[]>>;
  setDescription: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  openModal?: () => void;
}

const ItemTypeDetails: React.FC<ItemTypeDetailsProps> = ({
  page_type,
  item_type,
  itemArgs,
  disableInput,
  currentProductItemList,
  setCurrentProductItemList,
  description,
  setItem_type,
  setPromotionInputs,
  setDescription,
  handleKeyDown,
  openModal,
}) => {
  const handleItemTypeRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setItem_type(e.target.value as ItemType);
  };
  useEffect(() => {
    if (page_type === "DETAILS") {
      setCurrentProductItemList(itemArgs.products);
      setPromotionInputs(itemArgs.promotions);
    }
  }, [page_type]);
  return (
    <>
      <h1 className="border-b-[1px] pb-[5px] text-[18px] font-bold">
        아이템 옵션
      </h1>
      <div className={inputFormClass}>
        <label className={radioButtonLabelClass}>아이템 종류</label>
        <div className="flex h-[42px] w-full items-center justify-between">
          <div className="flex w-full gap-[10px] text-left">
            <InputRadioBox
              label="상품"
              name="item_type"
              value={ItemType.PD}
              checked={itemArgs.item_type === ItemType.PD}
              onChange={handleItemTypeRadioChange}
              disabled={disableInput}
            />
            <InputRadioBox
              label="프로모션"
              name="item_type"
              value={ItemType.PM}
              checked={itemArgs.item_type === ItemType.PM}
              onChange={handleItemTypeRadioChange}
              disabled={disableInput}
            />
          </div>
          {itemArgs.item_type === ItemType.PD && page_type === "NEW" ? (
            <button
              id="create_item_container"
              className="min-w-[45px] cursor-pointer rounded-lg border bg-blue-500 p-1 text-center text-white"
              onClick={openModal}
              disabled={disableInput}
            >
              추가
            </button>
          ) : null}
        </div>
        <ItemTypeComponent
          item_type={item_type}
          page_type={page_type}
          description={description}
          setDescription={setDescription}
          currentProductItemList={currentProductItemList}
          handleKeyDown={handleKeyDown}
        />
      </div>
    </>
  );
};

export default ItemTypeDetails;
