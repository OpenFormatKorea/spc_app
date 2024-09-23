export interface ApiResponse {
  status: string;
  message: string;
  error?: string;
  data?: any; // or data?: any; if data can be optional
}

export interface ProductListArgs {
  gid: string;
  name: string;
  posThumb: string | null;
  thumb: string | null;
}
