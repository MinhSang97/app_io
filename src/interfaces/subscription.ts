export interface SubscriptionFeatures {
  max_scans_per_day: number;
  has_ai_nutritionist: boolean;
  history_days_limit: number;
  has_health_sync: boolean;
}

export interface SubscriptionPlan {
  id: number;
  code: string;
  name: string;
  price: number;
  currency: string;
  duration_days: number;
  features: SubscriptionFeatures;
  vip_points_reward: number;
}

export interface PurchaseSubscriptionParams {
  plan_code: string;
  payment_provider: number; // 1 = Mock, 2 = Apple IAP, 3 = Stripe
  payment_id: string;
}

export interface PurchaseSubscriptionResult {
  subscription_id: number;
  subscription_tier: string;
  expires_at: string;
  vip_points_added: number;
}
