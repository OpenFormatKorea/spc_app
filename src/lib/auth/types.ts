export interface AuthArgs {
  username: string;
  shop_name?: string;
  email?: string;
  password?: string;
}

export interface ChangePWArgs {
  new_password?: string;
  token?: string;
}
