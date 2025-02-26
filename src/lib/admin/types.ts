export interface UserDataApiResponse {
  status: string;
  message: string;
  error?: string;
  data?: UserSearchList;
  result?: UserSearchList[]; // Change this to an array of UserSearchList
  total_count?: number;
  page_size?: number;
}

export interface UserSearchList {
  id: string;
  user_id: string;
  status: string;
  shop: string;
  reward_eligibility: RewardEligibilityType;
}

export enum RewardEligibilityType {
  ALL = "ALL",
  REFERRER = "REFERRER_ONLY",
  REFEREE = "REFEREE_ONLY",
  NONE = "NONE",
}

export interface UserInfoProps {
  data: {
    username: string;
    email: string;
  };
}
