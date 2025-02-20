export interface CampaignArgs {
  id?: string;
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

// export interface CampaignRecordsProps {
//   result: any;
//   id: string;
//   base_user_id: string;
//   shop_id: string;
//   reward_trigger: string;
//   reward_target: string;
//   order_number: string;
//   status: string;
//   message: string;
//   processed_by: string;
//   created_at: string;
//   total_count: number;
//   total_pages: number;
// }

// new reward type

export interface RewardProps {
  reward_trigger: string;
  id: number;
  reward_type: string;
  reward_value: number | string;
  payment_timing: {
    type: "IMMEDIATE" | "DELAYED";
    delay_days: number | null;
  };
  status: string | null;
}

export interface RewardUserProps {
  base_user_id: string;
  rewards: RewardProps[];
}

export interface ReferralItem {
  referral_item_id: string;
  referee: RewardUserProps;
  referrer: RewardUserProps;
  created_at: string;
  signup_id: string;
}

export interface CampaignRecordsProps {
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  data?: any;
  result: ReferralItem[];
}
// export interface ApiResponse {
//   status: string | number;
//   message: string;
//   error?: string;
//   data?: any;
// }
