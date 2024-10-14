import InputTextBox from "@/components/base/InputText";
import { ItemArgs, ItemType, ProductsArgs } from "@/lib/item/types";
import { useEffect, useState } from "react";

interface ItemTypeComponentProps {
  page_type: "DETAILS" | "NEW";
  item_type: ItemType;
  selectedProductItems: ProductsArgs[];
  description: string;
  setDescription: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ItemTypeComponent: React.FC<ItemTypeComponentProps> = ({
  page_type,
  item_type,
  selectedProductItems,
  description,
  setDescription,
  handleKeyDown,
}) => {
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-2";
  const labelClass = "text-xs pt-4 text-gray-500";
  const [disableInput, setDisableInput] = useState(page_type === "DETAILS");

  useEffect(() => {
    setDisableInput(page_type === "DETAILS");
  }, [page_type]);

  return (
    <div className="contents-container w-full justify-between pb-4">
      {item_type === ItemType.PD && (
        <div className="flex h-fit w-full flex-col">
          <div className="mb-2 flex w-full flex-col text-left">
            <label className={labelClass}>상품 모델 코드</label>
            <div className="mt-2 flex h-fit w-full flex-wrap justify-center break-words rounded-xl bg-gray-100 p-2 pb-3 text-sm">
              {!selectedProductItems.length ? (
                <div className="flex h-full w-full items-center justify-center text-center text-gray-600">
                  선택된 상품이 없습니다.
                  <br />
                  상품을 선택해주세요.
                </div>
              ) : (
                selectedProductItems.map((inputProduct) => (
                  <div
                    key={inputProduct.product_model_code}
                    className="mr-1 mt-1 h-fit w-fit rounded-md bg-blue-300 p-1 text-sm text-white"
                  >
                    {inputProduct.product_model_name}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {item_type === ItemType.PM && (
        <div className="flex h-fit w-full flex-col">
          <div className={inputFormClass}>
            <label className={labelClass}>프로모션 코드</label>
            <InputTextBox
              type="text"
              id="promotion_description"
              placeholder="프로모션 설명을 입력하세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disableInput}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemTypeComponent;
