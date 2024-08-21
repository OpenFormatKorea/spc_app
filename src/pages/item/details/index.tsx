import ItemDetails from "@/components/layout/item/ItemDetails";
import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import DashboardContents from "@/components/layout/dashboard/DashboardContents";
import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Calendar from "react-calendar";
import { fetchGetItemDetails, fetchModifyItem, fetchDeleteItem } from "@/pages/campaign/lib/apis";
import { ItemArgs } from "@/pages/item/lib/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { item_id }: any = context.query;
  const response = await fetchGetItemDetails(item_id, context);
  const shop_id = getShopIdFromCookies(context);
  if (response == null || response.shop_id != shop_id) {
    return {
      redirect: {
        destination: "/campaign",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        apiResponse: response,
        item_id: item_id,
      },
    };
  }
};
const infoCheck = (info: ItemArgs) => {
  if (!info.title) {
    alert("아이템 명을 입력 해주세요.");
    return false;
  } else if (!info.description) {
    alert("아이템 설명을 입력 해주세요.");
    return false;
  } else {
    return true;
  }
};

const DetailsItem = (
  { apiResponse, item_id }: { apiResponse: ItemArgs; item_id: string },
  context: GetServerSidePropsContext
) => {
  const [title, setTitle] = useState(apiResponse.title);
  const [item_type, setItem_type] = useState(apiResponse.item_type);
  const [description, setDescription] = useState(apiResponse.description);
  const [period_type, setPeriod_type] = useState(apiResponse.period_type);
  const [start_date, setStart_date] = useState(apiResponse.start_date);
  const [end_date, setEnd_date] = useState(apiResponse.end_date);
  const [active, setActive] = useState(apiResponse.active);
  // const [newStart_date, setNewStartDate] = useState(apiResponse.newStart_date);
  // const [newEnd_date, setNewEndDate] = useState(apiResponse.newEnd_date);

  const router = useRouter();

  const itemArgs: ItemArgs = {
    title: title,
    item_type: item_type,
    description: description,
    period_type: period_type,
    start_date: start_date,
    end_date: end_date,
    active: active,
    // newStart_date: newStart_date,
    // newEnd_date: newEnd_date,
  };

  const handleSubmit = async (event: React.FormEvent) => {
    const { id } = event.currentTarget;
    const shop_id: any = getShopIdFromCookies(context);

    if (id === "modify_item") {
      if (infoCheck(itemArgs)) {
        const result = await fetchModifyItem(item_id, itemArgs, context);

        if (result.status === 200) {
          alert(result.message);
          router.push("/item/details?item_id=" + item_id);
        } else {
          alert("캠페인 수정을 실패 하였습니다. 상태 코드: " + result.status);
          console.log("캠페인 수정을 실패 하였습니다. 상태 코드:", result.status);
          return false;
        }
      }
    } else if (id === "cancel_modify_item") {
      const confirmed = window.confirm("뒤로 가시겠습니까?");
      if (confirmed) {
        router.back();
      }
    } else if (id === "delete_item") {
      const confirmed = window.confirm("정말 삭제 하시겠습니까?");
      if (confirmed) {
        const result = await fetchDeleteItem(item_id, context);

        if (result.status === 200) {
          alert(result.message);
          console.log("캠페인을 (현재는 임시 !) 삭제 하였습니다.");
          router.push("/item");
        } else {
          alert("캠페인 삭제를 실패 하였습니다. 상태 코드: " + result.status);
          console.log("캠페인 삭제를 실패 하였습니다. 상태 코드:", result.status);
          return false;
        }
      }
    }
  };
  return (
    <DashboardContainer title={"캠페인 상세 정보"} onclick={handleSubmit} onclickText="수정하기" buttonId="modify_item">
      <DashboardContents>
        <ItemDetails />
      </DashboardContents>
      <div className="button-container w-full text-right">
        <button
          id="cancel_modify_item"
          className="border m-2 mt-4 p-2 bg-gray-400 text-white rounded-lg"
          onClick={handleSubmit}
        >
          뒤로가기
        </button>
        <button
          id="delete_item"
          className="border m-2 mt-4 p-2 bg-red-500 text-white rounded-lg"
          onClick={handleSubmit}
        >
          삭제하기
        </button>
      </div>
    </DashboardContainer>
  );
};

export default DetailsItem;
