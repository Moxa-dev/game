// src/components/achievements/achievement-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Achievement } from '@/types/game';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export function AchievementCard({ achievement, isUnlocked }: AchievementCardProps) {
  const IconComponent = achievement.icon;

  return (
    <Card className={`shadow-md transition-all duration-300 ${isUnlocked ? 'border-accent border-2 ring-2 ring-accent/50' : 'opacity-60 hover:opacity-100'}`}>
      <CardHeader className="items-center text-center">
        <div className={`p-3 rounded-full mb-2 ${isUnlocked ? 'bg-accent/20' : 'bg-muted'}`}>
          <IconComponent className={`h-10 w-10 ${isUnlocked ? 'text-accent' : 'text-muted-foreground'}`} />
        </div>
        <CardTitle className={`text-lg ${isUnlocked ? 'text-accent-foreground' : 'text-foreground'}`}>{achievement.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription className={isUnlocked ? 'text-foreground/90' : 'text-muted-foreground'}>
          {achievement.description}
        </CardDescription>
        {!isUnlocked && (
          <p className="text-xs text-muted-foreground mt-2">(Not yet unlocked)</p>
        )}
      </CardContent>
    </Card>
  );
}
