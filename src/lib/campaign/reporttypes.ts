import { count } from "console";

export interface ReportResponse {
  status: string;
  success: string;
  message: string;
  data: any[];
}
export interface SignUpResponse {
  date: string;
  share_count: number;
  signup_count: number;
}
export interface HourlySignups {
  [hour: number]: number; // Index signature for 0-23 keys, all values are numbers
}
