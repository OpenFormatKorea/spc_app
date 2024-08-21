import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";
import ItemTypeComponent from "@/components/layout/item/ItemTypeComponent";
import { ItemArgs, ItemType, ProductsArgs, PromotionsArgs, RewardType } from "@/pages/item/lib/types";
import { useRef, KeyboardEvent, useState } from "react";
interface ItemDetailsProps {
  itemArgs: ItemArgs;
  setItem_type: (value: ItemType) => void;
  setTitle: (value: string) => void;
  setCampaign_id: (value: string) => void;
  setActive: (value: boolean) => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ itemArgs, setItem_type, setTitle, setCampaign_id, setActive }) => {
  const [products, setProducts] = useState<ProductsArgs[]>([]);
  const [promotions, setPromotions] = useState<PromotionsArgs[]>([]);
  const handleItemTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem_type(e.target.value as ItemType);
  };
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  return (
    <>
      <div className="contents-container w-full justify-center items-center">
        <div className="inputForm flex flex-col text-left w-full mb-2">
          <label className="text-md font-bold my-4">아이템 명</label>
          <InputTextBox
            type="text"
            id="title"
            placeholder="아이템 명을 입력하세요."
            value={itemArgs.title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="inputForm flex flex-col text-left w-full mb-2">
          <label className="text-md font-bold my-4">아이템 종류</label>
          <div className="flex justify-between w-[250px] lg:w-[300px]">
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
          <ItemTypeComponent
            item_type={itemArgs.item_type} // Pass the item_type from ItemDetails
            products={products} // Pass the products array
            promotions={promotions} // Pass the promotions array
            setProducts={setProducts} // Pass the setter for products
            setPromotions={setPromotions} // Pass the setter for promotions
          />
        </div>
      </div>
    </>
  );
};
export default ItemDetails;
