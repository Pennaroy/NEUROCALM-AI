'use client';

import { generateDailyMentalHealthSummary } from '@/ai/flows/generate-daily-mental-health-summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHealthData } from '@/lib/hooks/use-health-data';
import { useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';

export function DailySummary() {
  const { healthData } = useHealthData();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getSummary = useCallback(async () => {
    if (!healthData) return;
    setLoading(true);
    try {
      const result = await generateDailyMentalHealthSummary({
        moodIndex: healthData.moodIndex,
        emotionalStabilityRating: healthData.emotionalStability,
        stressRiskLevel: healthData.stressLevel,
        sleepRecoveryScore: healthData.sleepRecovery,
        dailyActivity: `Completed ${healthData.dailySteps} steps.`,
        heartRate: healthData.heartRate,
        bloodPressure: `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`,
        oxygenLevel: healthData.oxygenLevel,
      });
      setSummary(result.summary);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      setSummary("Could not generate your daily summary at this time.");
    } finally {
      setLoading(false);
    }
  }, [healthData]);

  useEffect(() => {
    getSummary();
  }, [getSummary]);

  return (
    <Card className="shadow-lg bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary" />
          <span>AI Daily Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && !summary ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
        ) : (
          <p className="text-muted-foreground">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
}
