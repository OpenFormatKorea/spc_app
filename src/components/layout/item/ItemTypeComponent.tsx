import InputTextBox from "@/components/base/InputText";
import { ItemType, ProductsArgs, PromotionsArgs } from "@/pages/item/lib/types";
import { KeyboardEvent, useEffect, useState } from "react";

interface ItemTypeComponentProps {
  page_type: "DETAILS" | "NEW";
  item_type: ItemType;
  productInputs: ProductsArgs[];
  promotionInputs: PromotionsArgs[];
  setProductInputs: (value: ProductsArgs[]) => void;
  setPromotionInputs: (value: PromotionsArgs[]) => void;
}

const ItemTypeComponent: React.FC<ItemTypeComponentProps> = ({
  page_type,
  item_type,
  productInputs,
  promotionInputs,
  setProductInputs,
  setPromotionInputs,
}) => {
  const [disableInput, setDisableInput] = useState(false);

  useEffect(() => {
    setDisableInput(page_type === "DETAILS");
  }, [page_type]);

  const handleDeleteInput = (index: number) => {
    if (page_type === "NEW") {
      if (item_type === ItemType.PD) {
        const updatedInputs = productInputs.filter((_, i) => i !== index);
        setProductInputs(updatedInputs);
      } else if (item_type === ItemType.PM) {
        const updatedInputs = promotionInputs.filter((_, i) => i !== index);
        setPromotionInputs(updatedInputs);
      }
    }
  };

  const handleInputChange = (value: string, index: number) => {
    if (item_type === ItemType.PD) {
      const updatedInputs = [...productInputs];
      updatedInputs[index].product_model_code = value;
      setProductInputs(updatedInputs);
    } else if (item_type === ItemType.PM) {
      const updatedInputs = [...promotionInputs];
      updatedInputs[index].description = value;
      setPromotionInputs(updatedInputs);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="contents-container w-full justify-between">
      {/* Product Inputs for item_type === PD */}
      {item_type === ItemType.PD &&
        productInputs.map((input, index) => (
          <div key={index} className="inputForm flex items-center w-full mb-2 text-left">
            <InputTextBox
              type="text"
              id={`product_model_code_${index}`}
              placeholder="모델 코드를 입력하세요."
              value={input.product_model_code || input.model_code}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={disableInput}
            />
            <button
              id="delete_item_container"
              className={`ml-2 border p-1 text-white rounded-lg min-w-[45px] text-center ${
                disableInput || productInputs.length === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 cursor-pointer"
              }`}
              onClick={() => handleDeleteInput(index)}
              disabled={disableInput || productInputs.length === 1} // Disable delete when in DETAILS mode or if only 1 input
            >
              삭제
            </button>
          </div>
        ))}

      {/* Promotion Inputs for item_type === PM */}
      {item_type === ItemType.PM &&
        promotionInputs.map((input, index) => (
          <div key={index} className="inputForm flex items-center w-full mb-2">
            <InputTextBox
              type="text"
              id={`promotion_description_${index}`}
              placeholder="프로모션 설명을 입력하세요."
              value={input.description}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={disableInput}
            />
            <button
              id="delete_item_container"
              className={`ml-2 border p-1 text-white rounded-lg min-w-[45px] text-center ${
                disableInput || promotionInputs.length === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 cursor-pointer"
              }`}
              onClick={() => handleDeleteInput(index)}
              disabled={disableInput || promotionInputs.length === 1} // Disable delete when in DETAILS mode or if only 1 input
            >
              삭제
            </button>
          </div>
        ))}
    </div>
  );
};

export default ItemTypeComponent;
