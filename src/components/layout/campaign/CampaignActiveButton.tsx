import { fetchModifyCampaign } from "@/lib/campaign/apis";
import { CampaignArgs } from "@/lib/campaign/types";
import { GetServerSidePropsContext } from "next";
import React from "react";

interface CampaignActiveButtonProps {
  view: "MOBILE" | "PC";
  campaign: CampaignArgs;
  activeStatus: boolean;
  toggleCampaignActiveStatus: (campaign_id: string, newStatus: boolean) => void;
}

const CampaignActiveButton: React.FC<CampaignActiveButtonProps> = (
  { view, campaign, activeStatus, toggleCampaignActiveStatus },
  context: GetServerSidePropsContext
) => {
  const campaign_id = campaign.id?.toString() ?? "0";

  const handleActiveStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newActiveStatus = !activeStatus;

    if (confirm("캠페인 활성화 상태를 변경하시겠어요?")) {
      const updatedCampaign = { ...campaign, active: newActiveStatus };

      const result = await fetchModifyCampaign(campaign_id, updatedCampaign, context);
      console.log("result", result);
      if (result.status === 200) {
        toggleCampaignActiveStatus(campaign_id, newActiveStatus);
      } else {
        alert(`캠페인 활성화 상태를 변경 실패 하였습니다. 상태 코드: ${result.status}`);
      }
    }
  };

  return (
    <div className="flex w-full justify-center text-center z-0">
      <input
        type="checkbox"
        id={`${view}-campaign-activation-${campaign_id}`}
        className="peer sr-only opacity-0"
        name="active"
        checked={activeStatus}
        onChange={handleActiveStatus}
      />
      <label
        htmlFor={`${view}-campaign-activation-${campaign_id}`}
        className="relative z-0 flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-none transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-green-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-green-500"
      >
        <span className="sr-only">Enable</span>
      </label>
    </div>
  );
};

export default CampaignActiveButton;
