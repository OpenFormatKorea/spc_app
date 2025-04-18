import { float } from "aws-sdk/clients/cloudfront";

export interface ReportResponse {
  status: string;
  message: string;
  data: any[];
}
export interface SignUpResponse {
  date: string;
  share_count: number;
  signup_count: number;
  new_user_count: number;
}
export interface HourlySignups {
  //  [hour: number]: number;
  [hour: number]: { signup_count: number; new_user_count: number };
}

export interface myFunnelResponse {
  count: myFunnelCount;
  rate: myFunnelRate;
}

export interface myFunnelCount {
  total_share_click_count: number;
  total_kakao_share_count: number;
  total_new_registration_user_count: number;
  total_pickup_complete_count: number;
  total_accepted_share_count: number;
}
export interface myFunnelRate {
  share_click_to_kakao_share: float;
  kakao_share_to_registration: float;
  registration_to_new_user: float;
  registration_to_pickup_complete: float;
}

export interface referralLeaderboardTableResponse {
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  result: leaderboardTableTypes[];
}

export interface leaderboardTableTypes {
  base_user_id: string;
  referrer_id: string;
  total_signup_count: number;
  total_order_count: number;
}
