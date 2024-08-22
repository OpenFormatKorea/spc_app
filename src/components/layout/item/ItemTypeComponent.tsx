import InputTextBox from "@/components/base/InputText";
import { ItemType, ProductsArgs, PromotionsArgs } from "@/pages/item/lib/types";
import { KeyboardEvent, useEffect } from "react";

interface ItemTypeComponentProps {
  item_type: ItemType;
  productInputs: string[];
  promotionInputs: string[];
  setProducts: (value: ProductsArgs[]) => void;
  setPromotions: (value: PromotionsArgs[]) => void;
  setProductInputs: (value: string[]) => void;
  setPromotionInputs: (value: string[]) => void;
}

const ItemTypeComponent: React.FC<ItemTypeComponentProps> = ({
  item_type,
  productInputs,
  promotionInputs,
  setProducts,
  setPromotions,
  setProductInputs,
  setPromotionInputs,
}) => {
  // const [productInputs, setProductInputs] = useState<string[]>([""]);
  // const [promotionInputs, setPromotionInputs] = useState<string[]>([""]);

  // 프로덕트 & 프로모션 파싱
  useEffect(() => {
    setProductInputs([""]);
    setPromotionInputs([""]);
  }, [item_type]);

  useEffect(() => {
    setProducts(productInputs.map((input) => ({ product_model_code: input })));
  }, [productInputs, setProducts]);

  useEffect(() => {
    setPromotions(promotionInputs.map((input) => ({ description: input })));
  }, [promotionInputs, setPromotions]);

  // const handleAddInput = () => {
  //   if (item_type === ItemType.PD) {
  //     setProductInputs([...productInputs, ""]);
  //   } else if (item_type === ItemType.PM) {
  //     setPromotionInputs([...promotionInputs, ""]);
  //   }
  // };

  const handleDeleteInput = (index: number) => {
    if (item_type === ItemType.PD) {
      const updatedInputs = productInputs.filter((_, i) => i !== index);
      setProductInputs(updatedInputs);
    } else if (item_type === ItemType.PM) {
      const updatedInputs = promotionInputs.filter((_, i) => i !== index);
      setPromotionInputs(updatedInputs);
    }
  };

  const handleInputChange = (value: string, index: number) => {
    if (item_type === ItemType.PD) {
      const updatedInputs = [...productInputs];
      updatedInputs[index] = value;
      setProductInputs(updatedInputs);
    } else if (item_type === ItemType.PM) {
      const updatedInputs = [...promotionInputs];
      updatedInputs[index] = value;
      setPromotionInputs(updatedInputs);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Handle enter key if needed
    }
  };

  return (
    <>
      <div className="contents-container w-full justify-center">
        {item_type === ItemType.PD &&
          productInputs.map((input, index) => (
            <div key={index} className="inputForm flex items-center w-full mb-2 text-left">
              <InputTextBox
                type="text"
                id={`product_model_code_${index}`}
                placeholder="모델 코드를 입력하세요."
                value={input}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
              <div
                id="delete_item_container"
                className={`ml-2 p-1 rounded-lg w-[50px] text-center cursor-pointer text-white ${
                  productInputs.length === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
                }`}
                onClick={() => handleDeleteInput(index)}
                style={{ pointerEvents: productInputs.length === 1 ? "none" : "auto" }}
              >
                삭제
              </div>
            </div>
          ))}

        {item_type === ItemType.PM &&
          promotionInputs.map((input, index) => (
            <div key={index} className="inputForm flex items-center w-full mb-2">
              <InputTextBox
                type="text"
                id={`promotion_description_${index}`}
                placeholder="프로모션 설명을 입력하세요."
                value={input}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
              <div
                id="delete_item_container"
                className={`ml-2 p-1 rounded-lg w-[50px] text-center cursor-pointer text-white ${
                  promotionInputs.length === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
                }`}
                onClick={() => handleDeleteInput(index)}
                style={{ pointerEvents: promotionInputs.length === 1 ? "none" : "auto" }}
              >
                삭제
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ItemTypeComponent;
