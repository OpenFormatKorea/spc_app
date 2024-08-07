export interface AuthArgs {
  username: string;
  email?: string;
  password?: string;
}

export interface ChangePWArgs {
  username: string;
  old_password: string;
  new_password?: string;
}
