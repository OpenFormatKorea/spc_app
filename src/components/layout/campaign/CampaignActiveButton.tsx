import { fetchModifyCampaign } from "@/pages/campaign/lib/apis";
import { CampaignArgs } from "@/pages/campaign/lib/types";
import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";

interface CampaignActiveButtonProps {
  campaign: CampaignArgs;
}

const CampaignActiveButton: React.FC<CampaignActiveButtonProps> = (
  { campaign },
  context: GetServerSidePropsContext
) => {
  const [activeStatus, setActiveStatus] = useState(campaign.active);
  const campaign_id = campaign.id ? campaign.id.toString() : "0";
  const handleActiveStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Stop event propagation to parent div
    const newActiveStatus = !activeStatus;
    setActiveStatus(newActiveStatus); // Update UI immediately

    if (confirm("캠페인 활성화 상태를 변경하시겠어요?")) {
      const dataObj = {
        campaign_id: campaign_id,
        title: campaign.title,
        description: campaign.description,
        period_type: campaign.period_type,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        active: newActiveStatus,
      };

      const result = await fetchModifyCampaign(campaign_id, dataObj, context);

      if (result.status !== 200) {
        alert("캠페인 활성화 상태를 변경 실패 하였습니다. 상태 코드: " + result.status);
        setActiveStatus(!newActiveStatus);
      }
    } else {
      setActiveStatus(!newActiveStatus);
    }
  };

  return (
    <div className="flex w-full justify-center text-center">
      <input
        type="checkbox"
        id={`campaign-activation-` + campaign_id}
        className="peer sr-only opacity-0"
        name="active"
        checked={activeStatus}
        onChange={handleActiveStatus}
      />
      <label
        htmlFor={`campaign-activation-` + campaign_id}
        className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-green-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-green-500"
      >
        <span className="sr-only">Enable</span>
      </label>
    </div>
  );
};

export default CampaignActiveButton;
