export interface Stats {
  totalUsers: number;
  totalCalls: number;
  callsToday: number;
  callsByType: Record<string, number>;
  totalCostUsd: number;
  totalCostBrl: number;
  exchangeRate: number;
  downloadRate: number;
  spentToday: number;
  dailyBudget: number;
  isSafeMode: boolean;
  dailyCalls: { date: string; image_generation: number; copywriting: number }[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  account_type: string;
  credits_remaining: number;
  created_at: string;
}

export interface UsageRecord {
  id: string;
  user_email: string;
  call_type: string;
  model: string;
  tokens_input: number;
  tokens_output: number;
  cost_usd: number;
  cost_brl: number;
  status: string;
  created_at: string;
}

export type Tab = "overview" | "usage" | "crm";
