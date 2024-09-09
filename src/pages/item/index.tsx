import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemList from "@/components/layout/item/ItemList";
import { ApiResponse } from "@/lib/types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { fetchGetItemList } from "@/lib/item/apis";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetchGetItemList("", context);
  return {
    props: {
      apiResponse: response,
    },
  };
};

export const Item = ({ apiResponse }: { apiResponse: ApiResponse }) => {
  const theadStyle =
    " border-b border-gray-200 text-left text-sm font-medium text-gray-700 max-w-[300px] text-center p-2";
  const tbodyStyle = " border-b border-gray-200 whitespace-normal text-sm break-words break-all p-2";
  const router = useRouter();
  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "new_item") {
      router.push("item/new");
    }
  };

  useEffect(() => {
    console.log("Received API Response:", apiResponse);
  }, [apiResponse]);

  const campaigns = Array.isArray(apiResponse) ? apiResponse : [];
  return (
    <DashboardContainer title={"아이템"} onclick={handleButton} onclickText="새 아이템 생성" buttonId="new_item">
      <div className="wrapper-container">
        <div className="contents-container w-full justify-center">
          <ContentsContainer variant="dashboard">
            <ItemList
              theadStyle={theadStyle}
              tbodyStyle={tbodyStyle}
              campaign_id={""}
              apiResponse={apiResponse}
              handleButton={handleButton}
            />
          </ContentsContainer>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Item;
