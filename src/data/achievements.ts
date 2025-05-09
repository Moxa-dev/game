import type { Achievement } from '@/types/game';
import { DollarSign, Landmark, TrendingUp, ShieldCheck, Crown } from 'lucide-react';

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_1k_cash',
    title: 'Pocket Money Pro',
    description: 'Accumulate $1,000 in cash.',
    icon: DollarSign,
    isUnlocked: (state) => state.cash >= 1000,
  },
  {
    id: 'first_investment',
    title: 'Budding Investor',
    description: 'Make your first investment.',
    icon: TrendingUp,
    isUnlocked: (state) => state.investments.length > 0,
  },
  {
    id: 'debt_free',
    title: 'Debt Demolisher',
    description: 'Become completely debt-free.',
    icon: ShieldCheck,
    isUnlocked: (state) => state.debt <= 0 && state.cash > 0, // Ensure they are not just broke with no debt
  },
  {
    id: 'net_worth_10k',
    title: 'Junior Tycoon',
    description: 'Reach a net worth of $10,000.',
    icon: Landmark,
    isUnlocked: (state) => state.netWorth >= 10000,
  },
  {
    id: 'net_worth_100k',
    title: 'Financial Guru',
    description: 'Reach a net worth of $100,000.',
    icon: Crown,
    isUnlocked: (state) => state.netWorth >= 100000,
  },
];
