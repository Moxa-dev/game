import type { Quest, PlayerState } from '@/types/game';

export const QUESTS_LIST: Quest[] = [
  {
    id: 'q1_save_100',
    title: 'First Savings Goal',
    description: 'Save up $100 in your cash reserves. A small step for a big future!',
    reward: { experience: 50, cash: 10 },
    isCompleted: (state: PlayerState) => state.cash >= 100,
  },
  {
    id: 'q2_emergency_fund',
    title: 'Emergency Fund Starter',
    description: 'Build an emergency fund of at least $500. Be prepared for the unexpected.',
    reward: { experience: 100, cash: 50 },
    requires: { completedQuestIds: ['q1_save_100'] },
    isCompleted: (state: PlayerState) => state.cash >= 500,
  },
  {
    id: 'q3_first_investment',
    title: 'My First Stock',
    description: 'Learn about investing and buy your first stock (any amount).',
    reward: { experience: 150 },
    requires: { level: 2, completedQuestIds: ['q2_emergency_fund'] },
    isCompleted: (state: PlayerState) => state.investments.some(inv => inv.type === 'stocks'),
  },
  {
    id: 'q4_reduce_expenses',
    title: 'Expense Optimizer',
    description: 'Reduce your monthly expenses by $50 compared to the start of the game.',
    reward: { experience: 75 },
    isCompleted: (state: PlayerState) => {
      // This requires storing initial expenses or tracking changes.
      // For simplicity, we'll assume this logic is handled elsewhere or use a placeholder.
      // This specific quest might need more complex state tracking if initialExpenses aren't stored.
      // For now, let's make it completable if expenses are below a certain threshold.
      return state.monthlyExpenses < 450; // Example threshold
    }
  },
  {
    id: 'q5_reach_level_3',
    title: 'Level Up!',
    description: 'Gain enough experience to reach Level 3.',
    reward: { experience: 200, cash: 100 },
    isCompleted: (state: PlayerState) => state.level >= 3,
  }
];
