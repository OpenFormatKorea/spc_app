export interface CampaignArgs {
  id?: number;
  title: string;
  description: string;
  period_type: PeriodType;
  start_date: string;
  end_date?: any;
  newStart_date?: Date;
  newEnd_date?: Date;
  active: boolean;
}
export interface CampaignInfoProps {
  campaignInfo: CampaignArgs[];
}
export enum PeriodType {
  L = "LIMITED",
  UL = "UNLIMITED",
}