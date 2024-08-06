import { VariantType } from "notistack";

export interface ApiHandlerReturnProps<K = undefined> {
  success: boolean;
  data?: K;
  message?: string;
}

export interface ServerMessageProps {
  variant: VariantType;
  text: string;
}

export interface ServerBaseProps {
  message: string;
  err?: { error: string } | string;
  status: number;
}
