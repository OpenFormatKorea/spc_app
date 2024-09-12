import InputRadioBox from "@/components/base/InputRadio";
import InputTextBox from "@/components/base/InputText";
import ItemTypeComponent from "@/components/layout/item/ItemTypeComponent";
import { fetchActivateItem } from "@/lib/item/apis";
import { ItemType, ItemArgs, ProductsArgs, PromotionsArgs } from "@/lib/item/types";
import { GetServerSidePropsContext } from "next";
import { useState, useEffect } from "react";

interface ItemDetailsProps {
  page_type: "DETAILS" | "NEW";
  item_type: ItemType;
  itemArgs: ItemArgs;
  kakao_message: string;
  campaign_id: string;
  productInputs: ProductsArgs[];
  promotionInputs: PromotionsArgs[];
  active: boolean;
  setItem_type: (value: ItemType) => void;
  setTitle: (value: string) => void;
  setProductInputs: React.Dispatch<React.SetStateAction<ProductsArgs[]>>; // Updated type
  setPromotionInputs: React.Dispatch<React.SetStateAction<PromotionsArgs[]>>; // Updated type
  setKakao_message: (value: string) => void;
  setActive: (value: boolean) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = (
  {
    page_type,
    item_type,
    itemArgs,
    kakao_message,
    campaign_id,
    productInputs,
    promotionInputs,
    active,
    setItem_type,
    setTitle,
    setProductInputs,
    setPromotionInputs,
    setKakao_message,
    setActive,
    handleKeyDown,
  },
  context: GetServerSidePropsContext
) => {
  const [disableInput, setDisableInput] = useState(itemArgs.active);
  const item_id = itemArgs.id || "";
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-2";
  const labelClass = "text-xs pt-4 text-gray-500";
  const radioButtonLabelClass = "text-xs pt-4 pb-2 text-gray-500";

  const handleItemTypeRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem_type(e.target.value as ItemType);
  };

  const handleAddInput = () => {
    if (item_type === ItemType.PD) {
      setProductInputs((prev: ProductsArgs[] = []) => [...prev, { product_model_code: "" }]);
    } else if (item_type === ItemType.PM) {
      setPromotionInputs((prev: PromotionsArgs[] = []) => [...prev, { description: "" }]);
    }
  };

  const handleActiveStatus = async () => {
    const newActiveStatus = !itemArgs.active;
    if (confirm("아이템 활성화 상태를 변경하시겠어요?") && page_type === "DETAILS") {
      setActive(newActiveStatus);
      const result = await fetchActivateItem(item_id, campaign_id, context);
      if (result.status === 200) {
        return true;
      } else {
        alert("아이템 활성화 상태를 변경 실패 하였습니다. 상태 코드: " + result.status);
        setActive(!newActiveStatus);
        return false;
      }
    }
  };

  useEffect(() => {
    if (page_type === "DETAILS") {
      setDisableInput(true);
      setProductInputs(itemArgs.products);
      setPromotionInputs(itemArgs.promotions);
    } else {
      setDisableInput(false);
    }
  }, [page_type]);

  return (
    <div className="contents-container w-full justify-center items-center">
      <h1 className="font-bold text-xl pb-2 border-b-[1px] flex item-center text-center justify-between">
        <div>아이템 옵션</div>
        {page_type === "DETAILS" ? (
          <>
            <div>
              <input
                type="checkbox"
                className="peer sr-only opacity-0"
                id="item-activation"
                name="active"
                checked={active}
                onChange={handleActiveStatus}
              />
              <label
                htmlFor="item-activation"
                className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-green-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-green-500"
              >
                <span className="sr-only">Enable</span>
              </label>
            </div>
          </>
        ) : null}
      </h1>
      <div className={inputFormClass}>
        <label className={labelClass}>아이템 명</label>
        <InputTextBox
          type="text"
          id="title"
          placeholder="아이템 명을 입력하세요."
          value={itemArgs.title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disableInput}
        />
      </div>

      <div className={inputFormClass}>
        <label className={labelClass}>카카오 메세지</label>
        <InputTextBox
          type="text"
          id="message"
          placeholder="카카오 메세지를 입력하세요."
          value={kakao_message}
          onChange={(e) => setKakao_message(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disableInput}
        />
      </div>
      <div className={inputFormClass}>
        <label className={radioButtonLabelClass}>아이템 종류</label>
        <div className="flex h-[42px] items-center w-full mb-2">
          <div className="flex space-x-20 text-left w-full lg:max-w-[458px]">
            <InputRadioBox
              label="프로덕트"
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
            onClick={handleAddInput}
            disabled={disableInput}
          >
            추가
          </button>
        </div>
        <>
          <ItemTypeComponent
            page_type={page_type}
            productInputs={productInputs}
            promotionInputs={promotionInputs}
            item_type={item_type}
            setProductInputs={setProductInputs}
            setPromotionInputs={setPromotionInputs}
          />
        </>
      </div>
    </div>
  );
};

export default ItemDetails;
