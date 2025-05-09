// src/components/dashboard/ai-advisor-section.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Bot, AlertCircle } from 'lucide-react';
import { useGameState } from '@/context/game-state-context';
import { getFinancialAdvice, type FinancialAdviceInput, type FinancialAdviceOutput } from '@/ai/flows/financial-advisor';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '../ui/textarea';

export function AiAdvisorSection() {
  const { state } = useGameState();
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = async () => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);

    const totalInvestmentValue = state.investments.reduce((sum, inv) => sum + inv.value, 0);

    const input: FinancialAdviceInput = {
      income: state.monthlyIncome,
      expenses: state.monthlyExpenses,
      investments: totalInvestmentValue,
      debt: state.debt,
      netWorth: state.netWorth,
    };

    try {
      const result: FinancialAdviceOutput = await getFinancialAdvice(input);
      setAdvice(result.advice);
    } catch (err) {
      console.error("Error getting financial advice:", err);
      setError("Sorry, I couldn't fetch advice right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <CardTitle className="text-xl">AI Financial Advisor</CardTitle>
        </div>
        <CardDescription>Get personalized financial tips based on your current game state.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
        {advice && !isLoading && (
          <div className="p-4 bg-secondary/50 rounded-md border border-border">
            <div className="flex items-start gap-3">
              <Bot className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <p className="text-sm text-foreground whitespace-pre-wrap">{advice}</p>
            </div>
          </div>
        )}
         {!advice && !isLoading && !error && (
          <p className="text-sm text-muted-foreground text-center py-4">Click the button below to get your personalized financial advice!</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetAdvice} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Getting Advice...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Get Financial Advice
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
