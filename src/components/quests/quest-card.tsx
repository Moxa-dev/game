// src/components/quests/quest-card.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ListChecks, Award, DollarSign } from 'lucide-react';
import type { Quest } from '@/types/game';
import { useGameState } from '@/context/game-state-context';
import { useToast } from '@/hooks/use-toast';

interface QuestCardProps {
  quest: Quest;
  isCompletedByPlayer: boolean;
  canAttempt: boolean;
}

export function QuestCard({ quest, isCompletedByPlayer, canAttempt }: QuestCardProps) {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();

  const handleAttemptQuest = () => {
    if (!quest.isCompleted(state)) {
       toast({
        title: "Quest Incomplete",
        description: "You haven't met the conditions for this quest yet.",
        variant: "destructive",
      });
      return;
    }
    dispatch({ type: 'COMPLETE_QUEST', payload: { questId: quest.id } });
    toast({
      title: "Quest Completed!",
      description: `You earned ${quest.reward.experience} EXP ${quest.reward.cash ? `and $${quest.reward.cash}` : ''}.`,
    });
  };

  return (
    <Card className={`shadow-md transition-all duration-300 ${isCompletedByPlayer ? 'bg-secondary/30 opacity-70' : 'hover:shadow-lg'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{quest.title}</CardTitle>
          {isCompletedByPlayer ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <ListChecks className="h-6 w-6 text-primary" />
          )}
        </div>
        <CardDescription>{quest.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-accent" />
            <span>Reward: {quest.reward.experience} EXP</span>
          </div>
          {quest.reward.cash && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span>+ ${quest.reward.cash}</span>
            </div>
          )}
           {quest.requires?.level && (
            <p className="text-xs text-muted-foreground">Requires Level: {quest.requires.level}</p>
          )}
        </div>
      </CardContent>
      {!isCompletedByPlayer && (
        <CardFooter>
          <Button 
            onClick={handleAttemptQuest} 
            disabled={!canAttempt || !quest.isCompleted(state)}
            className="w-full"
          >
            {quest.isCompleted(state) ? "Claim Reward" : "Check Conditions"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
