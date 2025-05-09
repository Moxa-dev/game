// src/app/achievements/page.tsx
"use client";

import { AchievementCard } from '@/components/achievements/achievement-card';
import { useGameState } from '@/context/game-state-context';
import { ACHIEVEMENTS_LIST } from '@/data/achievements';
import { Progress } from '@/components/ui/progress';

export default function AchievementsPage() {
  const { state } = useGameState();
  const totalAchievements = ACHIEVEMENTS_LIST.length;
  const unlockedCount = state.unlockedAchievementIds.length;
  const progressPercentage = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Achievements</h1>
        <p className="text-muted-foreground">Track your financial milestones and accomplishments.</p>
      </header>

      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            Progress: {unlockedCount} / {totalAchievements} Unlocked
          </h3>
          <span className="text-sm font-semibold text-primary">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="w-full h-3" />
      </div>

      {ACHIEVEMENTS_LIST.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ACHIEVEMENTS_LIST.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={state.unlockedAchievementIds.includes(achievement.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No achievements defined yet. Check back later!</p>
        </div>
      )}
    </div>
  );
}
