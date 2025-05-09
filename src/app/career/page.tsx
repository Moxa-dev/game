// src/app/career/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameState } from "@/context/game-state-context";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, TrendingUp, DollarSign, ArrowRightLeft } from "lucide-react";

// Mock job data for demonstration
const availableJobs = [
  { id: 'job1', title: 'Intern', income: 1200, expenses: 800, requiredLevel: 1, description: "Basic entry-level position. Low pay, but a start!" },
  { id: 'job2', title: 'Junior Developer', income: 2500, expenses: 1000, requiredLevel: 2, description: "Start your coding career. Decent pay, moderate expenses." },
  { id: 'job3', title: 'Senior Analyst', income: 4000, expenses: 1500, requiredLevel: 3, description: "Analyze data and make an impact. Good pay, higher lifestyle costs." },
  { id: 'job4', title: 'Project Manager', income: 5500, expenses: 2000, requiredLevel: 4, description: "Lead projects to success. Great pay, demanding lifestyle." },
];

export default function CareerPage() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();

  // For simplicity, we assume the player always has one "current job" implicitly defined by their income/expenses.
  // This page allows "switching" to one of the predefined jobs.
  
  const handleChangeJob = (job: typeof availableJobs[0]) => {
    if (state.level < job.requiredLevel) {
      toast({ title: "Not Qualified", description: `You need to be Level ${job.requiredLevel} for this job.`, variant: "destructive" });
      return;
    }

    const incomeChange = job.income - state.monthlyIncome;
    const expenseChange = job.expenses - state.monthlyExpenses;

    dispatch({
      type: 'ADJUST_FINANCES',
      payload: { incomeDelta: incomeChange, expensesDelta: expenseChange }
    });
    toast({ title: "Career Move!", description: `You are now a ${job.title}. Your finances have been updated.` });
  };

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Career Management</h1>
        <p className="text-muted-foreground">Manage your job, income, and professional growth.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Current Financial Status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <DollarSign className="h-7 w-7 text-green-500"/>
            <div>
              <p className="text-sm font-medium">Monthly Income</p>
              <p className="text-xl font-semibold">${state.monthlyIncome.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <DollarSign className="h-7 w-7 text-red-500"/>
            <div>
              <p className="text-sm font-medium">Monthly Expenses</p>
              <p className="text-xl font-semibold">${state.monthlyExpenses.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <TrendingUp className="h-7 w-7 text-blue-500"/>
            <div>
              <p className="text-sm font-medium">Net Monthly Cashflow</p>
              <p className={`text-xl font-semibold ${state.monthlyIncome - state.monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(state.monthlyIncome - state.monthlyExpenses).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Career Paths</CardTitle>
          <CardDescription>Explore different job opportunities. Higher levels unlock better jobs.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {availableJobs.map((job) => (
            <Card key={job.id} className={`${state.level < job.requiredLevel ? 'opacity-60 bg-muted/50' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardDescription>{job.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Income:</strong> ${job.income.toLocaleString()}/month</p>
                <p><strong>Est. Expenses:</strong> ${job.expenses.toLocaleString()}/month</p>
                <p><strong>Required Level:</strong> {job.requiredLevel}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleChangeJob(job)}
                  disabled={state.level < job.requiredLevel || state.isGameOver || (state.monthlyIncome === job.income && state.monthlyExpenses === job.expenses) }
                >
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  {state.monthlyIncome === job.income && state.monthlyExpenses === job.expenses ? 'Currently Employed' : 
                   state.level < job.requiredLevel ? `Requires Level ${job.requiredLevel}` : 'Switch to this Job'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
