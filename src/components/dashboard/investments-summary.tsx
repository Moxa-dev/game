// src/components/dashboard/investments-summary.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/context/game-state-context';
import { Landmark, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function InvestmentsSummary() {
  const { state, dispatch } = useGameState();
  const totalInvestmentValue = state.investments.reduce((sum, inv) => sum + inv.value, 0);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">My Investments</CardTitle>
          <Landmark className="h-6 w-6 text-primary" />
        </div>
        <CardDescription>Overview of your investment portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Value:</span>
            <span className="font-semibold text-lg text-green-600">${totalInvestmentValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Number of Holdings:</span>
            <span className="font-semibold">{state.investments.length}</span>
          </div>
          
          {state.investments.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Top Holdings:</h4>
              <ul className="space-y-1 text-xs">
                {state.investments.slice(0, 3).map(inv => (
                  <li key={inv.id} className="flex justify-between">
                    <span>{inv.name} ({inv.type})</span>
                    <span>${inv.value.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link href="/investments" passHref>
            <Button variant="outline" className="w-full mt-4">
              <TrendingUp className="mr-2 h-4 w-4" /> Manage Investments
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
