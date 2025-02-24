import { float } from "aws-sdk/clients/cloudfront";
import { count } from "console";

export interface ReportResponse {
  status: string;
  message: string;
  data: any[];
}
export interface SignUpResponse {
  date: string;
  share_count: number;
  signup_count: number;
}
export interface HourlySignups {
  [hour: number]: number;
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
}
export interface myFunnelRate {
  share_click_to_kakao_share: float;
  kakao_share_to_registration: float;
  registration_to_pickup_complete: float;
}
