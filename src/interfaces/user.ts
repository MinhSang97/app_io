export type UserInformation = {
  user_id: string;
  username: string;
  phone_number: string;
  email: string;
  avatar_link: string;
  /** 1=vn … 12=th — khớp backend entity.Locale */
  locale: number;
  /** 1=light, 2=dark, 3=system — khớp backend entity.Theme */
  theme: number;
  subscription_tier?: string;
  subscription_expires_at?: string;
  vip_points_earned?: number;
  vip_points_balance?: number;
  vip_rank?: string;
  role?: string;
};

