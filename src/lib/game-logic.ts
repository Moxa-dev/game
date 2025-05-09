import type { PlayerState, HistoricalDataPoint, Investment } from '@/types/game';
import { addMonths, formatISO, parseISO } from 'date-fns';

export const calculateNetWorth = (state: PlayerState): number => {
  const totalInvestmentValue = state.investments.reduce((sum, inv) => sum + inv.value, 0);
  return state.cash + totalInvestmentValue - state.debt;
};

export const getExperienceForNextLevel = (level: number): number => {
  return 100 * Math.pow(level, 1.5); // Example formula: 100, 282, 519, 800...
};

export const processMonthlyUpdate = (currentState: PlayerState): Partial<PlayerState> => {
  let newCash = currentState.cash + currentState.monthlyIncome - currentState.monthlyExpenses;
  
  // Simple interest on debt (e.g., 1% per month on outstanding debt)
  const debtInterest = currentState.debt * 0.01;
  newCash -= debtInterest;
  const newDebt = currentState.debt + debtInterest;

  // Simulate investment growth/loss (e.g., small random fluctuation)
  const newInvestments = currentState.investments.map(inv => ({
    ...inv,
    value: inv.value * (1 + (Math.random() - 0.45) * 0.05) // Fluctuate between -2.25% to +2.75% monthly
  }));
  
  const newGameDate = formatISO(addMonths(parseISO(currentState.gameDate), 1), { representation: 'date' });

  let experience = currentState.experience + 10; // Small XP gain for surviving a month
  let level = currentState.level;
  const expForNextLevel = getExperienceForNextLevel(level);
  if (experience >= expForNextLevel) {
    level += 1;
    experience -= expForNextLevel;
    newCash += level * 100; // Level up bonus
  }
  
  const updatedState: Partial<PlayerState> = {
    ...currentState,
    cash: newCash,
    debt: newDebt,
    investments: newInvestments,
    gameDate: newGameDate,
    experience,
    level,
  };

  updatedState.netWorth = calculateNetWorth(updatedState as PlayerState);

  const newHistoricalDataPoint: HistoricalDataPoint = {
    date: newGameDate,
    netWorth: updatedState.netWorth,
    cash: newCash,
    investmentsValue: newInvestments.reduce((sum, inv) => sum + inv.value, 0),
    debt: newDebt,
  };
  
  const historicalData = [...currentState.historicalData, newHistoricalDataPoint].slice(-12); // Keep last 12 months

  if (newCash < 0 && newDebt > updatedState.netWorth * 2 && updatedState.netWorth < 0) {
    return { isGameOver: true, gameOverMessage: "You've fallen too deep into debt and can't recover. Game Over." };
  }


  return { ...updatedState, historicalData };
};

export const INITIAL_PLAYER_STATE: PlayerState = {
  playerName: 'Player One',
  level: 1,
  experience: 0,
  cash: 500,
  monthlyIncome: 1000,
  monthlyExpenses: 800,
  investments: [],
  debt: 0,
  netWorth: 500,
  completedQuestIds: [],
  unlockedAchievementIds: [],
  gameDate: formatISO(new Date(), { representation: 'date' }), // Start at current real date, progresses monthly
  historicalData: [
    { 
      date: formatISO(new Date(), { representation: 'date' }), 
      netWorth: 500, 
      cash: 500, 
      investmentsValue: 0, 
      debt: 0 
    }
  ],
  isGameOver: false,
};

export const createInvestment = (investmentData: Omit<Investment, 'id' | 'purchaseDate'>): Investment => {
  return {
    ...investmentData,
    id: `inv_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
    purchaseDate: formatISO(new Date(), { representation: 'date' }),
  };
};
