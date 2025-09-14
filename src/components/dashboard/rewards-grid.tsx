import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { rewardsData } from '@/lib/data';
import { Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RewardsGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Achievements
        </CardTitle>
        <CardDescription>Milestones you've unlocked.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {rewardsData.map((reward) => (
            <div
              key={reward.id}
              className={cn(
                'flex flex-col items-center justify-center gap-2 aspect-square p-2 rounded-lg border text-center transition-all duration-300',
                reward.unlocked
                  ? 'bg-primary/10 border-primary/20'
                  : 'bg-muted/50 opacity-50'
              )}
            >
              <reward.icon
                className={cn(
                  'h-8 w-8',
                  reward.unlocked ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span className="text-xs font-medium">{reward.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
