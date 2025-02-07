export interface CampaignArgs {
  id: string;
  title: string;
  description: string;
  period_type: PeriodType;
  start_date: string;
  end_date?: string | null;
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
export interface KakaoTemplateArgs {
  shop_name: string;
  image: string;
  shop_logo: string;
  title: string;
  description: string;
  button_name: string;
}

export interface CampaignApiResponse {
  status?: string;
  message?: string;
  error?: string;
  data?: CampaignRecordsProps;
  result?: any[];
  total_count?: number;
  page_size?: number;
}

export interface CampaignListApiResponse {
  status?: string;
  message?: string;
  error?: string;
  data?: CampaignArgs;
  result?: any[];
  total_count?: number;
  page_size?: number;
}

export interface CampaignRecordBody {
  campaign_id: string;
  page: string;
  page_size: string;
  start_date: string;
  end_date: string;
}

export interface CampaignRecordsProps {
  result: any;
  id: string;
  base_user_id: string;
  shop_id: string;
  reward_trigger: string;
  reward_target: string;
  order_number: string;
  status: string;
  message: string;
  processed_by: string;
  created_at: string;
  total_count: number;
  total_pages: number;
}
