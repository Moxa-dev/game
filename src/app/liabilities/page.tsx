// src/app/liabilities/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGameState } from "@/context/game-state-context";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, Banknote, HandCoins } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function LiabilitiesPage() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();

  const [loanAmount, setLoanAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");

  const handleTakeLoan = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(loanAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a positive loan amount.", variant: "destructive" });
      return;
    }
    // Simple loan limit: e.g., not more than current net worth or a fixed cap
    const loanLimit = Math.max(1000, state.netWorth * 0.5); 
    if (amount > loanLimit) {
       toast({ title: "Loan Limit Exceeded", description: `You can borrow up to $${loanLimit.toFixed(0)}.`, variant: "destructive" });
      return;
    }

    dispatch({ type: 'ADJUST_FINANCES', payload: { cashDelta: amount, debtDelta: amount } });
    toast({ title: "Loan Approved!", description: `$${amount} added to your cash and debt.` });
    setLoanAmount("");
  };

  const handleRepayDebt = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(repayAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a positive repayment amount.", variant: "destructive" });
      return;
    }
    if (amount > state.cash) {
      toast({ title: "Insufficient Cash", description: "You don't have enough cash to repay this amount.", variant: "destructive" });
      return;
    }
    if (amount > state.debt) {
      toast({ title: "Overpayment", description: `You only owe $${state.debt.toFixed(2)}. Repaying maximum possible.`, variant: "default" });
      const actualRepayAmount = state.debt;
      dispatch({ type: 'ADJUST_FINANCES', payload: { cashDelta: -actualRepayAmount, debtDelta: -actualRepayAmount } });
      setRepayAmount("");
      return;
    }

    dispatch({ type: 'ADJUST_FINANCES', payload: { cashDelta: -amount, debtDelta: -amount } });
    toast({ title: "Debt Repaid!", description: `$${amount} of your debt has been cleared.` });
    setRepayAmount("");
  };
  
  // Simple monthly interest calculation (e.g. 1% for display, actual applied in game logic)
  const estimatedMonthlyInterest = state.debt * 0.01;

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Liabilities</h1>
        <p className="text-muted-foreground">Handle your debts and loans effectively.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Current Debt Status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
           <div className="flex items-center space-x-4 rounded-md border p-4">
                <ShieldAlert className="h-8 w-8 text-destructive"/>
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Total Outstanding Debt</p>
                    <p className="text-sm text-muted-foreground">The total amount you owe.</p>
                </div>
                <div className="text-2xl font-bold text-destructive">${state.debt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
            <div className="flex items-center space-x-4 rounded-md border p-4">
                <Banknote className="h-8 w-8 text-orange-500"/>
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Est. Monthly Interest</p>
                    <p className="text-sm text-muted-foreground">Approximate interest on current debt (1% rate).</p>
                </div>
                <div className="text-2xl font-bold text-orange-600">${estimatedMonthlyInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Take a Loan</CardTitle>
            <CardDescription>Borrow funds if you need liquidity. Be mindful of interest!</CardDescription>
          </CardHeader>
          <form onSubmit={handleTakeLoan}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                <Input id="loanAmount" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="500" />
              </div>
               <p className="text-xs text-muted-foreground">Max loan available: ${Math.max(1000, state.netWorth * 0.5).toFixed(0)} (variable limit)</p>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={state.isGameOver}>
                <HandCoins className="mr-2 h-4 w-4" /> Request Loan
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repay Debt</CardTitle>
            <CardDescription>Reduce your outstanding debt to save on interest.</CardDescription>
          </CardHeader>
          <form onSubmit={handleRepayDebt}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="repayAmount">Repayment Amount ($)</Label>
                <Input id="repayAmount" type="number" value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} placeholder="100" />
              </div>
               <p className="text-xs text-muted-foreground">Current debt: ${state.debt.toFixed(2)}. Available cash: ${state.cash.toFixed(2)}.</p>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={state.debt <= 0 || state.isGameOver}>
                <Banknote className="mr-2 h-4 w-4" /> Make Repayment
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
