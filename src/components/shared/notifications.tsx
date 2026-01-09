'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Zap, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { personalizedAIReminders } from '@/ai/flows/personalized-ai-reminders';
import { useHealthData } from '@/lib/hooks/use-health-data';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type Reminder = {
  id: string;
  text: string;
  time: string;
};

const initialAlerts = [
    { id: '1', text: 'High stress level detected. Consider a short break.', time: '2m ago', icon: Zap, iconColor: 'text-destructive' },
    { id: '2', text: 'Device connection lost: Smartwatch.', time: '15m ago', icon: Info, iconColor: 'text-yellow-500' },
    { id: '3', text: 'Heart rate slightly elevated during rest.', time: '1h ago', icon: Info, iconColor: 'text-yellow-500' },
];

export function Notifications() {
  const { healthData } = useHealthData();
  const [reminders, setReminders] = useState<string[] | null>(null);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const getReminders = useCallback(async () => {
    if (!healthData || hasFetched) return;
    setLoadingReminders(true);
    setHasFetched(true);
    try {
      const result = await personalizedAIReminders({
        emotionalState: healthData.emotionalState,
        bloodPressure: `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`,
        oxygenLevel: healthData.oxygenLevel,
        heartRate: healthData.heartRate,
        sleepQuality: healthData.sleepQuality,
        dailyActivity: `Completed ${healthData.dailySteps} steps.`,
        wellnessGoals: ['stress reduction', 'sleep improvement'],
        assistantPersonality: 'friendly',
      });
      setReminders(result.reminders);
    } catch (error) {
      console.error('Failed to generate reminders:', error);
      setReminders(['Could not generate reminders at this time.']);
    } finally {
      setLoadingReminders(false);
    }
  }, [healthData, hasFetched]);

  const onOpenChange = (open: boolean) => {
    if (open && !hasFetched) {
        getReminders();
    }
  }


  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Tabs defaultValue="alerts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="reminders">AI Reminders</TabsTrigger>
          </TabsList>
          <TabsContent value="alerts" className="mt-4 space-y-4">
            {initialAlerts.map((alert) => (
               <div key={alert.id} className="flex items-start gap-3">
                <alert.icon className={`mt-1 h-4 w-4 shrink-0 ${alert.iconColor}`} />
                <div className='flex-1'>
                  <p className="text-sm">{alert.text}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="reminders" className="mt-4 space-y-4">
            {loadingReminders ? (
                 Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-4 w-4 mt-1 rounded-full" />
                        <div className='flex-1 space-y-2'>
                           <Skeleton className="h-3 w-full" />
                           <Skeleton className="h-3 w-2/3" />
                        </div>
                    </div>
                ))
            ) : (
                reminders?.map((reminder, index) => (
                <div key={index} className="flex items-start gap-3">
                    <Clock className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <div className="flex-1">
                    <p className="text-sm">{reminder}</p>
                    </div>
                </div>
                ))
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
