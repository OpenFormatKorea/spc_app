import InputTextBox from "@/components/base/InputText";
import { ItemType, ProductsArgs, PromotionsArgs } from "@/lib/item/types";
import { KeyboardEvent, useEffect, useState } from "react";

interface ItemTypeComponentProps {
  page_type: "DETAILS" | "NEW";
  item_type: ItemType;
  productInputs: ProductsArgs[];
  promotionInputs: PromotionsArgs[];
  selectedProductItems: string[];
  setProductInputs: (value: ProductsArgs[]) => void;
  setPromotionInputs: (value: PromotionsArgs[]) => void;
}

const ItemTypeComponent: React.FC<ItemTypeComponentProps> = ({
  page_type,
  item_type,
  productInputs,
  promotionInputs,
  selectedProductItems,
  setProductInputs,
  setPromotionInputs,
}) => {
  const [disableInput, setDisableInput] = useState(false);
  const inputFormClass = "inputForm flex text-left w-full pb-2";
  const labelClass = "text-xs pt-4 text-gray-500";

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
    <div className="contents-container w-full justify-between pb-4">
      {/* Product Inputs for item_type === PD */}
      {item_type === ItemType.PD && (
        <>
          <label className={labelClass}>상품 모델 코드</label>
          <div className="flex flex-col w-full h-fit">
            <div className="flex flex-col w-full mb-2 text-left">
              <label className={labelClass}>선택된 상품</label>
              <div className="w-full h-[85px] text-sm mt-2 break-words flex flex-wrap  bg-white rounded-xl p-2 pb-3 overflow-y-auto">
                {selectedProductItems.length === 0 && (
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="text-center text-gray-600">
                      선택된 상품이 없습니다.
                      <br />
                      상품을 선택해주세요.
                    </div>
                  </div>
                )}
                {selectedProductItems.map((gid) => {
                  return (
                    <div className="mr-1 mt-1 p-1 w-fit h-fit text-sm text-white bg-blue-300 rounded-md items-center">
                      {gid}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Promotion Inputs for item_type === PM */}
      {item_type === ItemType.PM && (
        <>
          <label className={labelClass}>프로모션 코드</label>
          <div className={inputFormClass}>
            <InputTextBox
              type="text"
              id={`promotion_description`}
              placeholder="프로모션 설명을 선택하세요."
              value={""}
              onChange={(e) => handleInputChange(e.target.value, 1)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              disabled={disableInput}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ItemTypeComponent;
