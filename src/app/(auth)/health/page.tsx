'use client';

import { HealthChart } from "@/components/health/health-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

type ChartDataPoint = {
  time: number;
  value: number;
};

const generateInitialData = (base: number, range: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = Date.now();
  for (let i = 10; i > 0; i--) {
    data.push({
      time: now - i * 5000,
      value: Math.round(base + (Math.random() - 0.5) * range),
    });
  }
  return data;
};

export default function HealthPage() {
  const [heartRateData, setHeartRateData] = useState<ChartDataPoint[]>(() => generateInitialData(75, 20));
  const [bpData, setBpData] = useState<ChartDataPoint[]>(() => generateInitialData(120, 10));
  const [spo2Data, setSpo2Data] = useState<ChartDataPoint[]>(() => generateInitialData(98, 2));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setHeartRateData(prev => [...prev.slice(1), { time: now, value: Math.round(75 + (Math.random() - 0.5) * 20) }]);
      setBpData(prev => [...prev.slice(1), { time: now, value: Math.round(120 + (Math.random() - 0.5) * 10) }]);
      setSpo2Data(prev => [...prev.slice(1), { time: now, value: Math.round(98 + (Math.random() - 0.5) * 2) }]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PageHeader title="Health Metrics" description="Visualize your real-time biometric data." />
      <div className="p-4 sm:p-6 lg:p-8 grid gap-6 md:grid-cols-2 bg-cross-gradient">
        <HealthChart title="Heart Rate (BPM)" data={heartRateData} dataKey="value" color="--chart-1" />
        <HealthChart title="Blood Pressure (Systolic)" data={bpData} dataKey="value" color="--chart-2" />
        <HealthChart title="Oxygen Saturation (SpO₂)" data={spo2Data} dataKey="value" color="--chart-3" />
        <Card id="sleep" className="bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Sleep Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Sleep Score: 82/100</p>
              <Progress value={82} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">You had a good night's sleep with 4 hours of deep sleep and 2 hours of REM sleep.</p>
          </CardContent>
        </Card>
        <Card id="activity" className="col-span-1 md:col-span-2 bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Activity Ring</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
              <div className="relative h-48 w-48">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--chart-4))" strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 * (1 - 0.7)} transform="rotate(-90 50 50)" strokeLinecap="round"/>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="hsl(var(--chart-5))" strokeWidth="10" strokeDasharray="220" strokeDashoffset={220 * (1 - 0.9)} transform="rotate(-90 50 50)" strokeLinecap="round"/>
                  <text x="50" y="50" textAnchor="middle" dy=".3em" className="fill-foreground font-bold text-lg">7k/10k</text>
                  <text x="50" y="65" textAnchor="middle" className="fill-muted-foreground text-xs">Steps</text>
                </svg>
              </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
