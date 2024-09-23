import { Dispatch, SetStateAction } from "react";

export interface ItemArgs {
  id?: string;
  campaign_id: string;
  title: string;
  item_type: ItemType;
  kakao_args: KakaoShareArgs;
  products: ProductsArgs[];
  promotions: PromotionsArgs[];

  rewards: RewardsArgs[];
  active: boolean;
}
export enum ItemType {
  PM = "PROMOTION",
  PD = "PRODUCT",
}
export interface KakaoArgs {
  message: string;
}
export interface ProductsArgs {
  id?: string;
  product_model_code: string;
  product_model_name: string;
  images: [{ posThumb: string }, { thumb: string }];
}
export interface PromotionsArgs {
  id?: string;
  description: string;
}

//리워드 관련
export interface RewardsArgs {
  reward_type: RewardType;
  coupon_code?: string | undefined;
  point_amount?: number | undefined;
  referrer_conditions?: RewardPolicyArgs | null;
  referee_conditions?: RewardPolicyArgs | null;
}
export enum RewardTarget {
  RFE = "REFEREE",
  RRR = "REFERRER",
}
export enum RewardType {
  CO = "COUPON",
  PO = "POINT",
}
export interface RewardPolicyArgs {
  SIGNUP?: ItemConditions;
  PURCHASE?: ItemConditions;
  trigger?: string;
}

export interface ItemConditions {
  payment_timing: {
    type: PaymentTimingType | null;
    delay_days?: number | null;
  };
  payment_frequency: {
    type: PaymentFrequencyType | null;
    repeat_count?: number | null;
  };
}
export enum PaymentTimingType {
  IMM = "IMMEDIATE",
  DEL = "DELAYED",
}
export enum PaymentFrequencyType {
  ONCE = "ONCE",
  REP = "REPEAT",
  UNL = "UNLIMITED",
}

export interface KakaoShareArgs {
  shop_name: string;
  image: string;
  shop_logo: string;
  title: string;
  description: string;
  button_name: string;
}
