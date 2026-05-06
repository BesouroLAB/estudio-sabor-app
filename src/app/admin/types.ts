export interface Stats {
  totalUsers: number;
  totalCalls: number;
  callsToday: number;
  callsByType: Record<string, number>;
  totalCostUsd: number;
  totalCostBrl: number;
  exchangeRate: number;
  totalCredits: number;
  totalRevenue: number;
  totalApiCost: number;
  profit: number;
  spentToday: number;
  dailyBudget: number;
  downloadRate: number;
  isSafeMode: boolean;
  dailyCalls: { date: string; image_generation: number; copywriting: number }[];
  tiersDistribution?: Record<string, number>;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  credits: number;
  current_tier: string; // Free, Starter, Pro
  total_purchases: number;
  total_spent_brl: number;
  last_purchase_date?: string;
  is_suspended: boolean;
  city?: string;
  phone?: string;
  establishment_name?: string;
  cuisine_type?: string;
  menu_link?: string;
  logo_url?: string;
  created_at: string;
  status?: string; // active, inactive, blocked
  admin_notes?: string;
  last_login_at?: string;
}

export interface UsageRecord {
  id: string;
  user_email: string;
  call_type: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  cost_brl: number;
  status: string;
  created_at: string;
}

export interface SystemSetting {
  key: string;
  value: any;
  description: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  full_name: string;
  amount: number;
  type: "purchase" | "usage" | "admin_adjustment" | "onboarding_bonus";
  reference_id: string;
  package_name: string;
  amount_paid_brl: number;
  tokens_input?: number;
  tokens_output?: number;
  cost_brl?: number;
  created_at: string;
}

export type Tab = "overview" | "usage" | "crm" | "settings" | "transactions";
