export interface VIPRank {
  id: number;
  code: string;
  name: string;
  min_points: number;
}

export interface VIPRewardValue {
  discount_percent?: number;
  applicable_plan_codes?: string[];
  extra_scans?: number;
  valid_days?: number;
  extra_days?: number;
}

export interface VIPReward {
  id: number;
  code: string;
  name: string;
  type: 'discount_subscription' | 'bonus_scans' | 'extend_days' | string;
  points_cost: number;
  value: VIPRewardValue;
  is_active?: boolean;
}

export interface VIPRedemption {
  id: number;
  reward_id: number;
  reward_name: string;
  points_spent: number;
  status: 'completed' | 'used' | 'expired' | string;
  created_at: string;
}

export interface RedeemRewardResult {
  redemption_id: number;
  reward_code: string;
  points_spent: number;
  remaining_balance: number;
  status: string;
}
