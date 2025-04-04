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

export interface ItemModifyArgs {
  id?: string;
  campaign_id: string;
  title: string;
  item_type: ItemType;
  kakao_args: KakaoShareArgs;
  product?: any;
  promotion?: any;
  current_rewards: RewardsArgs[];
  new_rewards?: RewardsArgs[];
  active: boolean;
}

export enum ItemType {
  PM = "PROMOTION",
  PD = "PRODUCT",
}
export interface KakaoArgs {
  message: string;
}

//for item api create
export interface ProductsArgs {
  id?: string;
  product_model_code: string;
  product_model_name: string;
  images?: [{ posThumb: string }, { thumb: string }];
}

export interface PromotionsArgs {
  id?: string;
  description: string;
}
export interface CouponsArgs {
  coupon_code: string;
  coupon_name: string;
  coupon_title?: string;
}

// for API returns
export interface ProductListArgs {
  gid: string;
  name: string;
  posThumb: string | null;
  thumb: string | null;
}

export interface CouponListArgs {
  cpnId: string;
  name: string;
}

//리워드 관련
export interface RewardsArgs {
  id?: string;
  reward_type: RewardType;
  coupon_code?: string | undefined;
  coupon_title?: string | undefined;
  coupon_name?: string | undefined;
  point_amount?: string | undefined;
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

export interface PBProductListArgs {
  content: ProductListArgs[];
  pageable: PageableArgs;
  totalElements: number;
  totalPages: number;
  last: boolean;
  number: number;
  size: number;
  numberOfElements: number;
  sort: PageNationSortArgs;
  first: boolean;
  empty: boolean;
}

// export interface ProductListArgs {
//   gid: string;
//   name: string;
//   image: [{ posThumb: string | null }, { thumb: string | null }];
// }

export interface PageableArgs {
  sort: PageNationSortArgs;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageNationSortArgs {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface KakaoShareArgs {
  shop_name: string;
  image: string;
  shop_logo: string;
  title: string;
  description: string;
  button_name: string;
}
