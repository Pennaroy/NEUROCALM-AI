import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type MetricCardProps = {
  title: string;
  value: string | number;
  unit?: string;
  Icon: LucideIcon;
  iconClassName?: string;
};

export function MetricCard({ title, value, unit, Icon, iconClassName }: MetricCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow bg-background/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-5 w-5 text-muted-foreground", iconClassName)} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {unit && <p className="text-xs text-muted-foreground">{unit}</p>}
      </CardContent>
    </Card>
  );
}
