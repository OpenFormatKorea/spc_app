import { StatsList } from "@/lib/types";

interface ItemTableProps {
  tbodyStyle: string;
  items: StatsList[];
}

const ItemTable: React.FC<ItemTableProps> = ({ tbodyStyle, items }) => {
  return (
    <>
      {items.map((item: StatsList) => (
        <tr key={item.item_group_id}>
          <td className={tbodyStyle}>{item.item_type ?? "N/A"}</td>
          <td className={tbodyStyle}>{item.item_title ?? "N/A"}</td>
          <td className={tbodyStyle}>
            {item.share_attempts_click_count ?? "N/A"}
          </td>
          <td className={tbodyStyle}>
            {item.kakao_message_share_count ?? "N/A"}
          </td>
          <td className={tbodyStyle}>{item.accepted_shares ?? "N/A"}</td>
          <td className={tbodyStyle}>{item.new_referee_user_count ?? "N/A"}</td>
          <td className={tbodyStyle}>
            {item.referee_order_complete_count ?? "N/A"}
          </td>
        </tr>
      ))}
      {!items.length && (
        <tr>
          <td className="p-3 text-center text-[14px] text-gray-500" colSpan={8}>
            현재 아이템 통계 정보가 없습니다.
          </td>
        </tr>
      )}
    </>
  );
};

export default ItemTable;
