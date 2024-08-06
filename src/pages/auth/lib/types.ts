export interface AuthArgs {
  userName: string;
  email?: string;
  password?: string;
}

export interface ChangePWArgs {
  userName: string;
  old_password: string;
  new_password?: string;
}
