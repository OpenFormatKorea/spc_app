export interface LoginArgs {
  email: string;
  password: string;
  session?: string;
}

export interface SignupArgs {
  userName: string;
  email: string;
  password: string;
}
