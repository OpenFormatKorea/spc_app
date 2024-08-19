export interface CampaignArgs {
  id?: number;
  title: string;
  description: string;
  period_type: string;
  start_date: string;
  end_date?: string;
  newStart_date?: Date;
  newEnd_date?: Date;
  active: boolean;
}
export interface CampaignInfoProps {
  campaignInfo: CampaignArgs[];
}
