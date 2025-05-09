
export interface PlayerState {
  playerName: string;
  level: number;
  experience: number;
  cash: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  investments: Investment[];
  debt: number;
  netWorth: number;
  completedQuestIds: string[];
  unlockedAchievementIds: string[];
  gameDate: string; // ISO string e.g., "2024-01-01"
  historicalData: HistoricalDataPoint[];
  isGameOver: boolean;
  gameOverMessage?: string;
}

export interface Investment {
  id: string;
  name: string;
  value: number;
  type: 'stocks' | 'real_estate' | 'bonds'; // Example types
  purchaseDate: string;
  quantity?: number; // For stocks
  annualReturnRate?: number; // For bonds/real estate
}

export interface HistoricalDataPoint {
  date: string;
  netWorth: number;
  cash: number;
  investmentsValue: number;
  debt: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: {
    experience: number;
    cash?: number;
    item?: string; // Future use
  };
  requires?: { // Prerequisites for the quest to be available
    level?: number;
    completedQuestIds?: string[];
  };
  isCompleted: (state: PlayerState) => boolean;
  onComplete?: (state: PlayerState) => Partial<PlayerState>; // Optional: direct state changes upon completion
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>; // Lucide icon component
  isUnlocked: (state: PlayerState) => boolean;
}

export interface RandomEventChoice {
  text: string;
  action: (currentState: PlayerState) => Partial<PlayerState>;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  chance: number; // Probability of occurring, e.g., 0.1 for 10%
  choices: RandomEventChoice[];
  icon?: React.ComponentType<{ className?: string }>;
}

export type GameAction =
  | { type: 'INITIALIZE_GAME'; payload?: Partial<PlayerState> }
  | { type: 'ADVANCE_MONTH' }
  | { type: 'COMPLETE_QUEST'; payload: { questId: string } }
  | { type: 'BUY_INVESTMENT'; payload: Omit<Investment, 'id' | 'purchaseDate'> }
  | { type: 'SELL_INVESTMENT'; payload: { investmentId: string; sellPrice: number } }
  | { type: 'UPDATE_PLAYER_DETAILS'; payload: { playerName?: string } }
  | { type: 'APPLY_RANDOM_EVENT'; payload: RandomEvent }
  | { type: 'PROCESS_EVENT_CHOICE'; payload: { event: RandomEvent, choiceIndex: number } }
  | { type: 'SET_GAME_OVER'; payload: { message: string } }
  | { type: 'ADJUST_FINANCES'; payload: { cashDelta?: number, debtDelta?: number, incomeDelta?: number, expensesDelta?: number } };

