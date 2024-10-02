import InputRadioBox from "@/components/base/InputRadio";
import ItemTypeComponent from "@/components/layout/item/ItemTypeComponent";
import { ItemArgs, ProductsArgs, ItemType, PromotionsArgs } from "@/lib/item/types";
import { useEffect } from "react";

interface ItemTypeDetailsProps {
  page_type: "DETAILS" | "NEW";
  item_type: ItemType;
  itemArgs: ItemArgs;
  selectedProductItems: ProductsArgs[];
  disableInput: boolean;
  description: string;
  setItem_type: (value: ItemType) => void;
  setProductInputs: React.Dispatch<React.SetStateAction<ProductsArgs[]>>; // Updated type
  setPromotionInputs: React.Dispatch<React.SetStateAction<PromotionsArgs[]>>; // Updated type
  setDescription: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  openModal?: () => void;
}

const ItemTypeDetails: React.FC<ItemTypeDetailsProps> = ({
  page_type,
  item_type,
  itemArgs,
  disableInput,
  selectedProductItems,
  description,
  setItem_type,
  setProductInputs,
  setPromotionInputs,
  setDescription,
  handleKeyDown,
  openModal,
}) => {
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-2";
  const radioButtonLabelClass = "text-xs pt-4 pb-2 text-gray-500";
  const handleItemTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem_type(e.target.value as ItemType);
  };
  useEffect(() => {
    if (page_type === "DETAILS") {
      setProductInputs(itemArgs.products);
      setPromotionInputs(itemArgs.promotions);
    }
  }, [page_type]);
  console.log("itemArgs", itemArgs);
  return (
    <>
      <h1 className="font-bold text-xl pb-2 border-b-[1px]">아이템 옵션</h1>
      <div className={inputFormClass}>
        <label className={radioButtonLabelClass}>아이템 종류</label>
        <div className="flex h-[42px] items-center w-full ">
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
          {itemArgs.item_type === ItemType.PD && (
            <button
              id="create_item_container"
              className={`border p-1 ${
                disableInput ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 cursor-pointer"
              }  text-white rounded-lg min-w-[45px] text-center `}
              onClick={openModal}
              disabled={disableInput}
            >
              추가
            </button>
          )}
        </div>
        <ItemTypeComponent
          item_type={item_type}
          page_type={page_type}
          itemArgs={itemArgs}
          description={description}
          setDescription={setDescription}
          selectedProductItems={selectedProductItems}
          handleKeyDown={handleKeyDown}
        />
      </div>
    </>
  );
};

export default ItemTypeDetails;
