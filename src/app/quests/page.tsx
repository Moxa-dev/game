// src/app/quests/page.tsx
"use client";

import { QuestCard } from '@/components/quests/quest-card';
import { useGameState } from '@/context/game-state-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function QuestsPage() {
  const { state, availableQuests } = useGameState();

  const completedQuests = availableQuests.filter(q => state.completedQuestIds.includes(q.id));
  const activeQuests = availableQuests.filter(q => !state.completedQuestIds.includes(q.id));

  return (
    <div className="space-y-6">
      <header className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Quests</h1>
        <p className="text-muted-foreground">Complete tasks to earn rewards and progress in your financial journey.</p>
      </header>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="active">
            Active Quests <Badge variant="secondary" className="ml-2">{activeQuests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <Badge variant="secondary" className="ml-2">{completedQuests.length}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {activeQuests.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  isCompletedByPlayer={false}
                  canAttempt={!state.completedQuestIds.includes(quest.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No active quests available. Keep playing to unlock more!</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed">
           {completedQuests.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  isCompletedByPlayer={true}
                  canAttempt={false}
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">You haven't completed any quests yet. Get started!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
