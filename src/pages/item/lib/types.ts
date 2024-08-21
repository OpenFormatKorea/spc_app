export interface ItemArgs {
  id?: number;
  campaign_id: string;
  title: string;
  item_type: ItemType;
  kakao_args: KakaoArgs;
  products: ProductsArgs[];
  promotions: PromotionsArgs[];
  rewards: RewardArgs[];
  active?: boolean;
}

export enum ItemType {
  PM = "PROMOTION",
  PD = "PRODUCT",
}

export enum RewardType {
  CO = "COUPON",
  PO = "POINT",
}

export interface KakaoArgs {
  id?: number;
  message: string;
}

export interface ProductsArgs {
  id?: number;
  product_model_code: string;
}

export interface PromotionsArgs {
  id?: number;
  description: string;
}

export interface RewardArgs {
  id?: number;
  reward_type: RewardType;
  coupon_code?: string | null;
  point_amount?: number | null;
}
