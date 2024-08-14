export interface ApiResponse {
  status: string;
  message: string;
  error?: string;
  data?: any; // or data?: any; if data can be optional
}
