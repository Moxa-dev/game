// src/app/page.tsx (Dashboard)
"use client";

import { FinancialSummaryCard } from '@/components/dashboard/financial-summary-card';
import { InvestmentsSummary } from '@/components/dashboard/investments-summary';
import { FinancialChart } from '@/components/dashboard/financial-chart';
import { AiAdvisorSection } from '@/components/dashboard/ai-advisor-section';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/context/game-state-context';
import { DollarSign, Landmark, TrendingUp, TrendingDown, CalendarDays, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EventModal } from '@/components/game/event-modal';
import { GameOverDialog } from '@/components/game/game-over-dialog';


export default function DashboardPage() {
  const { state, dispatch, currentEvent, setCurrentEvent } = useGameState();
  const { toast } = useToast();

  const handleAdvanceMonth = () => {
    if (state.isGameOver) return;
    dispatch({ type: 'ADVANCE_MONTH' });
    toast({
      title: "Month Advanced",
      description: `Welcome to the next month! Your finances have been updated.`,
    });
  };
  
  const closeEventModal = () => {
    setCurrentEvent(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FinancialSummaryCard
          title="Cash Balance"
          value={state.cash}
          icon={DollarSign}
          description="Your available liquid funds."
        />
        <FinancialSummaryCard
          title="Net Worth"
          value={state.netWorth}
          icon={Landmark}
          description="Total assets minus liabilities."
        />
        <FinancialSummaryCard
          title="Monthly Income"
          value={state.monthlyIncome}
          icon={TrendingUp}
          description="Your regular monthly earnings."
        />
        <FinancialSummaryCard
          title="Monthly Expenses"
          value={state.monthlyExpenses}
          icon={TrendingDown}
          description="Your regular monthly spending."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FinancialChart
          title="Net Worth Over Time"
          description="Track your financial growth."
          data={state.historicalData}
          dataKey="netWorth"
          color="hsl(var(--chart-1))"
        />
        <FinancialChart
          title="Cash Flow History"
          description="Cash balance changes monthly."
          data={state.historicalData}
          dataKey="cash"
          color="hsl(var(--chart-2))"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <InvestmentsSummary />
        <AiAdvisorSection />
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={handleAdvanceMonth} disabled={state.isGameOver}>
          <CalendarDays className="mr-2 h-5 w-5" />
          Advance to Next Month
        </Button>
      </div>

      {currentEvent && !state.isGameOver && (
        <EventModal
          event={currentEvent}
          isOpen={!!currentEvent}
          onClose={closeEventModal}
        />
      )}
      
      {state.isGameOver && <GameOverDialog />}
    </div>
  );
}
