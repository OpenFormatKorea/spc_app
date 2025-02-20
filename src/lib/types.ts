export interface ApiResponse {
  status: string | number;
  message: string;
  error?: string;
  data?: any;
}

export interface StatsApiResponse {
  status: string;
  message: string;
  error?: string;
  data?: StatsList;
  result?: [];
  total_count?: number;
  page_size?: number;
}
export interface StatsList {
  period_type: string;
  campaign_id?: string;
  campaign_title?: string;
  item_group_id?: string;
  item_type: string;
  item_title: string;
  start_date?: string;
  end_date?: string;
  share_attempts_click_count: string;
  kakao_message_share_count: string;
  accepted_shares: string;
  new_referee_user_count: string;
  referee_order_complete_count: string;
}
