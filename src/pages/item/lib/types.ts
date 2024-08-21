export interface ItemArgs {
  id?: number;
  referral_type: ItemType;
  title: string;
  description: string;
  reward_type: RewardType;
  reward_details: RewardDetailsArgs | null;
  created_at?: string;
  active: boolean;
}
export interface ItemInfoProps {
  referralInfo: ItemArgs[];
}
export enum ItemType {
  PM = "PROMOTION",
  PD = "PRODUCT",
}
export enum RewardType {
  CO = "COUPON",
  PO = "POINT",
}
export interface RewardDetailsArgs {
  id?: number;
  name: string;
  amount: number;
}
