export interface CampaignArgs {
  title: string;
  description: string;
  period_type: string;
  start_date: string;
  end_date?: string;
  active: boolean;
}
