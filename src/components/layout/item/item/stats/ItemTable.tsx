import { StatsList } from "@/lib/types";
import { useRouter } from "next/router";

interface ItemTableProps {
  tbodyStyle: string;
  item: StatsList;
}

const ItemTable: React.FC<ItemTableProps> = ({ tbodyStyle, item }) => {
  const router = useRouter();

  return (
    <>
      <tr key={item.item_group_id} className="cursor-pointer">
        <td className={tbodyStyle}>{item.item_type}</td>
        <td className={tbodyStyle}>{item.item_title}</td>

        <td className={tbodyStyle}>{item.share_attempts_click_count}</td>
        <td className={tbodyStyle}>{item.kakao_message_share_count}</td>
        <td className={tbodyStyle}>{item.accepted_shares}</td>
        <td className={tbodyStyle}>{item.new_referee_user_count}</td>
        <td className={tbodyStyle}>{item.referee_order_complete_count}</td>
      </tr>
    </>
  );
};

export default ItemTable;
