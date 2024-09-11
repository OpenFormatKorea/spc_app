import { fetchActivateItem } from "@/lib/item/apis";
import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";
interface ItemActiveButtonProps {
  view: "MOBILE" | "PC";
  item_id: string;
  activeStatus: boolean;
  campaign_id: string;
  toggleItemActiveStatus: (itemId: string, newStatus: boolean) => void;
}

const ItemActiveButton: React.FC<ItemActiveButtonProps> = (
  { view, item_id, activeStatus, campaign_id, toggleItemActiveStatus },
  context: GetServerSidePropsContext
) => {
  const handleActiveStatus = async () => {
    const newActiveStatus = !activeStatus;
    if (confirm("아이템 활성화 상태를 변경하시겠어요?")) {
      toggleItemActiveStatus(item_id, newActiveStatus);
      const result = await fetchActivateItem(item_id, campaign_id, context);
      if (result.status !== 200) {
        alert("아이템 활성화 상태 변경 실패. 상태 코드: " + result.status);
        toggleItemActiveStatus(item_id, !newActiveStatus);
      }
    }
  };

  return (
    <div className="flex w-full justify-center text-center">
      <input
        type="checkbox"
        id={`${view}-item-activation-` + item_id}
        className="peer sr-only opacity-0"
        name="active"
        checked={activeStatus}
        onChange={handleActiveStatus}
      />
      <label
        htmlFor={`${view}-item-activation-` + item_id}
        className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-green-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-green-500"
      >
        <span className="sr-only">Enable</span>
      </label>
    </div>
  );
};

export default ItemActiveButton;
