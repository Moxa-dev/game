import type { RandomEvent, PlayerState } from '@/types/game';
import { AlertTriangle, Gift, TrendingDown, TrendingUp, Briefcase } from 'lucide-react';

export const RANDOM_EVENTS_LIST: RandomEvent[] = [
  {
    id: 'event_car_repair',
    title: 'Unexpected Car Repair',
    description: 'Your trusty old car suddenly needs a significant repair.',
    chance: 0.1,
    icon: AlertTriangle,
    choices: [
      {
        text: 'Pay $300 for the repair',
        action: (state: PlayerState): Partial<PlayerState> => ({ cash: Math.max(0, state.cash - 300) }),
      },
      {
        text: 'Try a cheaper fix for $100 (50% chance of further issues)',
        action: (state: PlayerState): Partial<PlayerState> => {
          const newCash = Math.max(0, state.cash - 100);
          if (Math.random() < 0.5) {
            // Further issues, could trigger another event or just more cost later.
            // For simplicity, let's add a small note or debt.
            return { cash: newCash, debt: state.debt + 50, gameOverMessage: "Cheaper fix failed, incurred more debt!" };
          }
          return { cash: newCash };
        },
      },
    ],
  },
  {
    id: 'event_birthday_gift',
    title: 'Birthday Windfall!',
    description: 'You received a cash gift for your birthday.',
    chance: 0.05,
    icon: Gift,
    choices: [
      {
        text: 'Receive $100',
        action: (state: PlayerState): Partial<PlayerState> => ({ cash: state.cash + 100 }),
      },
    ],
  },
  {
    id: 'event_stock_market_dip',
    title: 'Stock Market Correction',
    description: 'The stock market experiences a temporary dip. Your investments might be affected.',
    chance: 0.08,
    icon: TrendingDown,
    choices: [
      {
        text: 'Hold onto investments',
        action: (state: PlayerState): Partial<PlayerState> => ({
          investments: state.investments.map(inv => 
            inv.type === 'stocks' ? { ...inv, value: Math.max(0, inv.value * 0.9) } : inv // 10% dip
          ),
        }),
      },
      {
        text: 'Sell some stocks to cut losses (20% of stock value)',
        action: (state: PlayerState): Partial<PlayerState> => {
          let stocksValueSold = 0;
          const newInvestments = state.investments.reduce((acc, inv) => {
            if (inv.type === 'stocks') {
              const valueToSell = inv.value * 0.2;
              stocksValueSold += valueToSell * 0.9; // Sell at dipped price
              if (inv.value - valueToSell > 1) { // keep if some value remains
                 acc.push({ ...inv, value: inv.value - valueToSell });
              }
            } else {
              acc.push(inv);
            }
            return acc;
          }, [] as PlayerState['investments']);
          return { 
            cash: state.cash + stocksValueSold,
            investments: newInvestments,
           };
        },
      },
    ],
  },
  {
    id: 'event_job_opportunity',
    title: 'New Job Offer!',
    description: 'A recruiter contacts you with a potential new job with higher pay but more hours.',
    chance: 0.03,
    icon: Briefcase,
    choices: [
      {
        text: 'Accept (+$200/month income, -$50/month effective free time/higher expenses)',
        action: (state: PlayerState): Partial<PlayerState> => ({ 
          monthlyIncome: state.monthlyIncome + 200,
          monthlyExpenses: state.monthlyExpenses + 50, // Representing less time for cooking, etc.
        }),
      },
      {
        text: 'Decline, stay with current job.',
        action: (state: PlayerState): Partial<PlayerState> => ({}), // No change
      },
    ],
  },
    {
    id: 'event_market_boom',
    title: 'Market Boom!',
    description: 'The stock market is surging! Your investments are doing great.',
    chance: 0.07,
    icon: TrendingUp,
    choices: [
      {
        text: 'Celebrate!',
        action: (state: PlayerState): Partial<PlayerState> => ({
          investments: state.investments.map(inv => 
            inv.type === 'stocks' ? { ...inv, value: inv.value * 1.15 } : inv // 15% boom
          ),
        }),
      },
    ],
  },
];
