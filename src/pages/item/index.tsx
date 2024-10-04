import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import ContentsContainer from "@/components/layout/base/ContentsContainer";
import ItemList from "@/components/layout/item/item/ItemList";
import { ApiResponse } from "@/lib/types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { fetchGetItemList } from "@/lib/item/apis";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetchGetItemList("", context);
  return {
    props: {
      apiResponse: response,
    },
  };
};

const Item = ({ apiResponse }: { apiResponse: ApiResponse }) => {
  // Table styles
  const theadStyle = "px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 text-center";
  const tbodyStyle =
    "px-3 py-2 border-b border-gray-200 whitespace-normal break-words break-all text-center items-center";
  const router = useRouter();
  const handleButton = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    if (id === "new_item") {
      router.push("item/new");
    }
  };

  const campaigns = Array.isArray(apiResponse) ? apiResponse : [];
  return (
    <DashboardContainer>
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
