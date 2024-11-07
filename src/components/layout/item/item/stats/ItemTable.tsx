import { StatsList } from "@/lib/types";

interface ItemTableProps {
  tbodyStyle: string;
  items: StatsList[];
}

const ItemTable: React.FC<ItemTableProps> = ({ tbodyStyle, items }) => {
  return (
    <>
      {items.map((item: StatsList) => (
        <tr key={item.item_group_id} className="cursor-pointer">
          <td className={tbodyStyle}>{item.item_type}</td>
          <td className={tbodyStyle}>{item.item_title}</td>
          <td className={tbodyStyle}>{item.share_attempts_click_count}</td>
          <td className={tbodyStyle}>{item.kakao_message_share_count}</td>
          <td className={tbodyStyle}>{item.accepted_shares}</td>
          <td className={tbodyStyle}>{item.new_referee_user_count}</td>
          <td className={tbodyStyle}>{item.referee_order_complete_count}</td>
        </tr>
      ))}
      {!items.length && (
        <tr>
          <td className="p-3 text-center text-sm text-gray-500" colSpan={8}>
            현재 사용중인 아이템이 없어요
            <br />
            새로운 아이템을 등록해 주세요.
          </td>
        </tr>
      )}
    </>
  );
};

export default ItemTable;
