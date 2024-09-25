import InputRadioBox from "@/components/base/InputRadio";
import ItemTypeComponent from "@/components/layout/item/ItemTypeComponent";
import { ItemArgs, ProductsArgs, PromotionsArgs, ItemType } from "@/lib/item/types";
import { useState, useEffect } from "react";

interface ItemTypeDetailsProps {
  page_type: "DETAILS" | "NEW";
  item_type: ItemType;
  itemArgs: ItemArgs;
  productInputs: ProductsArgs[];
  promotionInputs: PromotionsArgs[];
  disableInput: boolean;

  setItem_type: (value: ItemType) => void;
  setProductInputs: React.Dispatch<React.SetStateAction<ProductsArgs[]>>; // Updated type
  setPromotionInputs: React.Dispatch<React.SetStateAction<PromotionsArgs[]>>; // Updated type
  openModal?: () => void;
}

const ItemTypeDetails: React.FC<ItemTypeDetailsProps> = ({
  page_type,
  item_type,
  itemArgs,
  productInputs,
  promotionInputs,
  disableInput,
  setItem_type,
  setProductInputs,
  setPromotionInputs,
  openModal,
}) => {
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-2";
  const radioButtonLabelClass = "text-xs pt-4 pb-2 text-gray-500";
  const handleItemTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem_type(e.target.value as ItemType);
  };

  const handleAddInput = () => {
    if (item_type === ItemType.PD) {
      setProductInputs((prev: ProductsArgs[] = []) => [
        ...prev,
        { product_model_code: "", product_model_name: "", images: [{ posThumb: "" }, { thumb: "" }] },
      ]);
    } else if (item_type === ItemType.PM) {
      setPromotionInputs((prev: PromotionsArgs[] = []) => [...prev, { description: "" }]);
    }
  };

  useEffect(() => {
    if (page_type === "DETAILS") {
      setProductInputs(itemArgs.products);
      setPromotionInputs(itemArgs.promotions);
    }
  }, [page_type]);

  return (
    <>
      <h1 className="font-bold text-xl pb-2 border-b-[1px]">아이템 옵션</h1>
      <div className={inputFormClass}>
        <label className={radioButtonLabelClass}>아이템 종류</label>
        <div className="flex h-[42px] items-center w-full mb-2">
          <div className="flex space-x-20 text-left w-full lg:max-w-[458px]">
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
          <button
            id="create_item_container"
            className={`border p-1 ${
              disableInput ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 cursor-pointer"
            }  text-white rounded-lg min-w-[45px] text-center `}
            // onClick={handleAddInput}
            onClick={openModal}
            disabled={disableInput}
          >
            추가
          </button>
        </div>
        <ItemTypeComponent
          page_type={page_type}
          productInputs={productInputs}
          promotionInputs={promotionInputs}
          item_type={item_type}
          setProductInputs={setProductInputs}
          setPromotionInputs={setPromotionInputs}
        />
      </div>
    </>
  );
};

export default ItemTypeDetails;
