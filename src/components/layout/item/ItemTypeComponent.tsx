import InputTextBox from "@/components/base/InputText";
import { ItemType, ProductsArgs } from "@/lib/item/types";
import { useEffect, useState } from "react";

interface ItemTypeComponentProps {
  page_type: "DETAILS" | "NEW";
  item_type: ItemType;
  selectedProductItems: ProductsArgs[];
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ItemTypeComponent: React.FC<ItemTypeComponentProps> = ({
  page_type,
  item_type,
  selectedProductItems,
  handleKeyDown,
}) => {
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-2";
  const labelClass = "text-xs pt-4 text-gray-500";
  const [disableInput, setDisableInput] = useState(false);

  useEffect(() => {
    setDisableInput(page_type === "DETAILS");
  }, [page_type]);

  const handleInputChange = (value: string) => {};

  return (
    <div className="contents-container w-full justify-between pb-4">
      {item_type === ItemType.PD && (
        <>
          <div className="flex flex-col w-full h-fit">
            <div className="flex flex-col w-full mb-2 text-left">
              <label className={labelClass}>상품 모델 코드</label>
              <div className="w-full h-fit text-sm justify-center mt-2 break-words flex flex-wrap bg-gray-100 rounded-xl p-2 pb-3">
                {selectedProductItems.length === 0 ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="text-center text-gray-600">
                      선택된 상품이 없습니다.
                      <br />
                      상품을 선택해주세요.
                    </div>
                  </div>
                ) : (
                  selectedProductItems.map((inputProduct) => {
                    return (
                      <div
                        key={`${inputProduct.product_model_code}`} // Adding index to make the key unique
                        className="mr-1 mt-1 p-1 w-fit h-fit text-sm text-white bg-blue-300 rounded-md"
                      >
                        {inputProduct.product_model_name}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {item_type === ItemType.PM && (
        <>
          <div className="flex flex-col w-full h-fit">
            <div className={inputFormClass}>
              <label className={labelClass}>프로모션 코드</label>
              <InputTextBox
                type="text"
                id={`promotion_description`}
                placeholder="프로모션 설명을 선택하세요."
                value={""}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                disabled={disableInput}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemTypeComponent;
