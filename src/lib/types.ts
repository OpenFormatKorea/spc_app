export interface ApiResponse {
  status: string;
  message: string;
  error?: string;
  data?: [];
}

export interface StatsApiResponse {
  status: string;
  message: string;
  error?: string;
  data?: StatsList;
  result?: [];
  total_count?: Number;
  page_size?: Number;
}
export interface StatsList {
  period_type: string;
  campaign_id: string;
  item_type: string;
  item_title: string;
  start_date: string;
  end_date: string;
  share_attempts_click_count: string;
  kakao_message_share_count: string;
  accepted_shares: string;
  new_referee_user_count: string;
  referee_order_complete_count: string;
}
