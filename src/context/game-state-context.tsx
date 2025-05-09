// src/context/game-state-context.tsx
"use client";

import type { PlayerState, GameAction, Quest, Achievement, RandomEvent } from '@/types/game';
import { createContext, useContext, useReducer, ReactNode, Dispatch, useEffect, useState } from 'react';
import { INITIAL_PLAYER_STATE, calculateNetWorth, processMonthlyUpdate, createInvestment, getExperienceForNextLevel } from '@/lib/game-logic';
import { QUESTS_LIST } from '@/data/quests';
import { ACHIEVEMENTS_LIST } from '@/data/achievements';
import { RANDOM_EVENTS_LIST } from '@/data/events';

interface GameStateContextProps {
  state: PlayerState;
  dispatch: Dispatch<GameAction>;
  availableQuests: Quest[];
  unlockedAchievements: Achievement[];
  currentEvent: RandomEvent | null;
  setCurrentEvent: Dispatch<React.SetStateAction<RandomEvent | null>>;
}

const GameStateContext = createContext<GameStateContextProps | undefined>(undefined);

const gameReducer = (state: PlayerState, action: GameAction): PlayerState => {
  switch (action.type) {
    case 'INITIALIZE_GAME':
      return { ...INITIAL_PLAYER_STATE, ...action.payload };
    case 'ADVANCE_MONTH':
      if (state.isGameOver) return state;
      const monthlyChanges = processMonthlyUpdate(state);
      const newStateAfterMonth = { ...state, ...monthlyChanges };
      newStateAfterMonth.netWorth = calculateNetWorth(newStateAfterMonth); // Recalculate net worth after all changes
      
      // Check for new achievement unlocks after month advance
      const newlyUnlockedAchievements = ACHIEVEMENTS_LIST.filter(
        ach => !newStateAfterMonth.unlockedAchievementIds.includes(ach.id) && ach.isUnlocked(newStateAfterMonth)
      ).map(ach => ach.id);

      return {
        ...newStateAfterMonth,
        unlockedAchievementIds: [...newStateAfterMonth.unlockedAchievementIds, ...newlyUnlockedAchievements],
      };
    
    case 'COMPLETE_QUEST': {
      if (state.isGameOver) return state;
      const quest = QUESTS_LIST.find(q => q.id === action.payload.questId);
      if (!quest || state.completedQuestIds.includes(quest.id) || !quest.isCompleted(state)) {
        return state;
      }
      let updatedState = { ...state };
      updatedState.experience += quest.reward.experience;
      if (quest.reward.cash) {
        updatedState.cash += quest.reward.cash;
      }
      if (quest.onComplete) {
        updatedState = { ...updatedState, ...quest.onComplete(updatedState) };
      }
      
      let level = updatedState.level;
      const expForNextLevel = getExperienceForNextLevel(level);
      if (updatedState.experience >= expForNextLevel) {
        level += 1;
        updatedState.experience -= expForNextLevel;
        updatedState.cash += level * 100; // Level up bonus
      }
      updatedState.level = level;
      updatedState.completedQuestIds = [...updatedState.completedQuestIds, quest.id];
      updatedState.netWorth = calculateNetWorth(updatedState);
      return updatedState;
    }
    
    case 'BUY_INVESTMENT': {
      if (state.isGameOver) return state;
      const cost = action.payload.value;
      if (state.cash < cost) return state; // Not enough cash
      const newInvestment = createInvestment(action.payload);
      const updatedState = {
        ...state,
        cash: state.cash - cost,
        investments: [...state.investments, newInvestment],
      };
      updatedState.netWorth = calculateNetWorth(updatedState);
      return updatedState;
    }

    case 'SELL_INVESTMENT': {
      if (state.isGameOver) return state;
      const { investmentId, sellPrice } = action.payload;
      const investmentToSell = state.investments.find(inv => inv.id === investmentId);
      if (!investmentToSell) return state;

      const updatedState = {
        ...state,
        cash: state.cash + sellPrice,
        investments: state.investments.filter(inv => inv.id !== investmentId),
      };
      updatedState.netWorth = calculateNetWorth(updatedState);
      return updatedState;
    }

    case 'ADJUST_FINANCES': {
      if (state.isGameOver) return state;
      const { cashDelta, debtDelta, incomeDelta, expensesDelta } = action.payload;
      const updatedState = { ...state };
      if (cashDelta) updatedState.cash += cashDelta;
      if (debtDelta) updatedState.debt += debtDelta;
      if (incomeDelta) updatedState.monthlyIncome += incomeDelta;
      if (expensesDelta) updatedState.monthlyExpenses += expensesDelta;
      
      updatedState.netWorth = calculateNetWorth(updatedState);
      return updatedState;
    }

    case 'UPDATE_PLAYER_DETAILS':
      return { ...state, ...action.payload };

    case 'PROCESS_EVENT_CHOICE': {
      if (state.isGameOver) return state;
      const { event, choiceIndex } = action.payload;
      const choice = event.choices[choiceIndex];
      if (!choice) return state;
      const changes = choice.action(state);
      const updatedState = { ...state, ...changes };
      updatedState.netWorth = calculateNetWorth(updatedState);
      return updatedState;
    }
    
    case 'SET_GAME_OVER':
      return { ...state, isGameOver: true, gameOverMessage: action.payload.message };

    default:
      return state;
  }
};

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_PLAYER_STATE);
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);

  // Update available quests and unlocked achievements based on current state
  const availableQuests = QUESTS_LIST.filter(quest => {
    if (state.completedQuestIds.includes(quest.id)) return false;
    if (quest.requires) {
      if (quest.requires.level && state.level < quest.requires.level) return false;
      if (quest.requires.completedQuestIds) {
        for (const reqId of quest.requires.completedQuestIds) {
          if (!state.completedQuestIds.includes(reqId)) return false;
        }
      }
    }
    return true;
  });

  const unlockedAchievements = ACHIEVEMENTS_LIST.filter(ach => state.unlockedAchievementIds.includes(ach.id));
  
  // Effect to check for new achievement unlocks when state changes (e.g. cash, networth)
  useEffect(() => {
    if (state.isGameOver) return;
    const newlyUnlocked = ACHIEVEMENTS_LIST.filter(
      ach => !state.unlockedAchievementIds.includes(ach.id) && ach.isUnlocked(state)
    );
    if (newlyUnlocked.length > 0) {
      // This might cause a loop if not careful, better to dispatch an action or handle in reducer.
      // For now, we will handle it within ADVANCE_MONTH or specific actions that change key metrics.
      // console.log("New achievements unlocked:", newlyUnlocked.map(a => a.title));
    }
  }, [state.cash, state.netWorth, state.investments, state.debt, state.unlockedAchievementIds, state.isGameOver]);


  // Random event trigger on month advance (simplified)
  useEffect(() => {
    if (state.isGameOver) return;
    // This effect is tied to gameDate changing. It means after ADVANCE_MONTH.
    // Ensure it doesn't run on initial load if gameDate is the same as INITIAL_PLAYER_STATE.
    if (state.gameDate !== INITIAL_PLAYER_STATE.gameDate) {
        const rand = Math.random();
        let cumulativeChance = 0;
        for (const event of RANDOM_EVENTS_LIST) {
            cumulativeChance += event.chance;
            if (rand < cumulativeChance) {
                setCurrentEvent(event);
                break;
            }
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameDate, state.isGameOver]);


  return (
    <GameStateContext.Provider value={{ state, dispatch, availableQuests, unlockedAchievements, currentEvent, setCurrentEvent }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameStateContextProps => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
