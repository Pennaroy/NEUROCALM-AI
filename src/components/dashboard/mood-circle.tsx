import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MoodCircleProps = {
  moodIndex: number;
  emotionalState: string;
};

export function MoodCircle({ moodIndex, emotionalState }: MoodCircleProps) {
  const safeMoodIndex = Math.max(0, Math.min(10, moodIndex));
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (safeMoodIndex / 10) * circumference;

  const getColor = (index: number) => {
    if (index > 7) return 'stroke-chart-4';
    if (index > 4) return 'stroke-chart-2';
    if (index > 2) return 'stroke-chart-3';
    return 'stroke-destructive';
  };

  return (
    <Card className="flex flex-col items-center justify-center p-6 shadow-lg bg-background/80 backdrop-blur-sm">
      <div className="relative h-40 w-40">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          <circle
            className="stroke-current text-secondary"
            strokeWidth="10"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
          />
          <circle
            className={cn(`transform -rotate-90 origin-center transition-all duration-500`, getColor(safeMoodIndex))}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{safeMoodIndex}<span className="text-xl text-muted-foreground">/10</span></span>
          <span className="text-sm text-muted-foreground">Mood Index</span>
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold">{emotionalState}</p>
      <p className="text-sm text-muted-foreground">AI Generated State</p>
    </Card>
  );
}
