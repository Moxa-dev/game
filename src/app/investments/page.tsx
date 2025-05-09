// src/app/investments/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGameState } from "@/context/game-state-context";
import { useToast } from "@/hooks/use-toast";
import type { Investment } from "@/types/game";
import { DollarSign, Landmark, TrendingUp, ShoppingCart, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { format, parseISO } from "date-fns";

export default function InvestmentsPage() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();

  const [investmentName, setInvestmentName] = useState("");
  const [investmentValue, setInvestmentValue] = useState("");
  const [investmentType, setInvestmentType] = useState<Investment['type']>('stocks');

  const handleBuyInvestment = (e: FormEvent) => {
    e.preventDefault();
    const value = parseFloat(investmentValue);
    if (!investmentName || isNaN(value) || value <= 0) {
      toast({ title: "Invalid Input", description: "Please provide a valid name and positive value.", variant: "destructive" });
      return;
    }
    if (state.cash < value) {
      toast({ title: "Insufficient Funds", description: "You don't have enough cash to make this investment.", variant: "destructive" });
      return;
    }

    dispatch({
      type: 'BUY_INVESTMENT',
      payload: { name: investmentName, value, type: investmentType }
    });
    toast({ title: "Investment Purchased!", description: `${investmentName} added to your portfolio.` });
    setInvestmentName("");
    setInvestmentValue("");
  };

  const handleSellInvestment = (investmentId: string, currentValue: number) => {
    // For simplicity, selling at current market value. Could add transaction costs or bid-ask spread.
    const sellPrice = currentValue * (1 - (Math.random() * 0.05)); // Simulate slight slippage/cost, up to 5%
    dispatch({ type: 'SELL_INVESTMENT', payload: { investmentId, sellPrice } });
    toast({ title: "Investment Sold!", description: `Sold for $${sellPrice.toFixed(2)}.` });
  };
  
  const totalInvestmentValue = state.investments.reduce((sum, inv) => sum + inv.value, 0);

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Investments</h1>
        <p className="text-muted-foreground">Buy and sell assets to grow your portfolio.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-4 rounded-md border p-4">
                <Landmark className="h-8 w-8 text-primary"/>
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Total Investment Value</p>
                    <p className="text-sm text-muted-foreground">Current market value of all holdings.</p>
                </div>
                <div className="text-2xl font-bold text-green-600">${totalInvestmentValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
             <div className="flex items-center space-x-4 rounded-md border p-4">
                <DollarSign className="h-8 w-8 text-primary"/>
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Available Cash</p>
                    <p className="text-sm text-muted-foreground">Funds ready for investment.</p>
                </div>
                <div className="text-2xl font-bold">${state.cash.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Buy New Investment</CardTitle>
            <CardDescription>Expand your portfolio by acquiring new assets.</CardDescription>
          </CardHeader>
          <form onSubmit={handleBuyInvestment}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="investmentName">Asset Name (e.g., ACME Corp Stock)</Label>
                <Input id="investmentName" value={investmentName} onChange={(e) => setInvestmentName(e.target.value)} placeholder="ACME Corp Stock" />
              </div>
              <div>
                <Label htmlFor="investmentValue">Amount to Invest ($)</Label>
                <Input id="investmentValue" type="number" value={investmentValue} onChange={(e) => setInvestmentValue(e.target.value)} placeholder="1000" />
              </div>
              <div>
                <Label htmlFor="investmentType">Asset Type</Label>
                <Select value={investmentType} onValueChange={(value: Investment['type']) => setInvestmentType(value)}>
                  <SelectTrigger id="investmentType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stocks">Stocks</SelectItem>
                    <SelectItem value="bonds">Bonds</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={state.isGameOver}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Buy Investment
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Holdings</CardTitle>
            <CardDescription>Your existing investments.</CardDescription>
          </CardHeader>
          <CardContent>
            {state.investments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">You don't own any investments yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Purchased</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.investments.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.name}</TableCell>
                      <TableCell>{inv.type.charAt(0).toUpperCase() + inv.type.slice(1)}</TableCell>
                      <TableCell>{format(parseISO(inv.purchaseDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">${inv.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="destructive" size="sm" onClick={() => handleSellInvestment(inv.id, inv.value)} disabled={state.isGameOver}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
