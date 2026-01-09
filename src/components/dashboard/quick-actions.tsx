import { Button } from '@/components/ui/button';
import { Zap, Activity, Moon, Brain } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    { label: "Calm Me", href: "/assistant?action=calm", icon: Zap },
    { label: "Analyze Today", href: "/assistant?action=analyze", icon: Brain },
    { label: "Sleep Score", href: "/health#sleep", icon: Moon },
    { label: "Activity Insights", href: "/health#activity", icon: Activity },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Button key={action.label} asChild variant="outline" className="h-24 flex-col gap-2 shadow-sm hover:shadow-md transition-shadow justify-center bg-background/80 backdrop-blur-sm">
          <Link href={action.href}>
            <action.icon className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
