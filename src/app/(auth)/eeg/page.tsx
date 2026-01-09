'use client';

import { HealthChart } from "@/components/health/health-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PageHeader } from "@/components/shared/page-header";

type EEGDataPoint = {
  time: number;
  value: number;
};

const waveTypes = ["Alpha", "Beta", "Theta", "Delta"];
const emotionPredictions = [
  { name: 'Calm', value: 75, fill: "url(#grad-calm)" },
  { name: 'Stress', value: 15, fill: "url(#grad-stress)" },
  { name: 'Anxiety', value: 8, fill: "url(#grad-anxiety)" },
  { name: 'Fatigue', value: 2, fill: "url(#grad-fatigue)" },
];

const generateInitialData = (): EEGDataPoint[] => {
  const data: EEGDataPoint[] = [];
  const now = Date.now();
  for (let i = 50; i > 0; i--) {
    data.push({
      time: now - i * 100,
      value: Math.sin(i / 5) * 20 + (Math.random() - 0.5) * 10,
    });
  }
  return data;
};

export default function EEGPage() {
  const [eegData, setEegData] = useState<EEGDataPoint[]>(generateInitialData);
  const [activeWave, setActiveWave] = useState("Alpha");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const i = now / 100;
      const freq = activeWave === "Alpha" ? 5 : activeWave === "Beta" ? 2 : activeWave === "Theta" ? 8 : 12;
      setEegData(prev => [...prev.slice(1), { time: now, value: Math.sin(i / freq) * 20 + (Math.random() - 0.5) * 10 }]);
    }, 100);

    return () => clearInterval(interval);
  }, [activeWave]);

  const chartConfig = {
    calm: { label: "Calm", color: "hsl(var(--chart-4))" },
    stress: { label: "Stress", color: "hsl(var(--destructive))" },
    anxiety: { label: "Anxiety", color: "hsl(var(--chart-3))" },
    fatigue: { label: "Fatigue", color: "hsl(var(--chart-5))" },
  };

  return (
    <>
      <PageHeader title="EEG Emotion Tracker" description="Analyze brainwave patterns and emotion predictions." />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-cross-gradient">
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Real-time EEG Wave Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="Alpha" onValueChange={setActiveWave}>
              <TabsList className="grid w-full grid-cols-4">
                {waveTypes.map(wave => (
                  <TabsTrigger key={wave} value={wave}>{wave} Waves</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeWave} className="mt-4">
                <HealthChart title={`${activeWave} Waves (µV)`} data={eegData} dataKey="value" color="--chart-1" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Emotion Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Based on combined biometric and EEG analysis, your dominant emotional states are predicted to be:</p>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart layout="vertical" data={emotionPredictions} margin={{left: 10}}>
                <defs>
                  <linearGradient id="grad-calm" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="grad-stress" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="grad-anxiety" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="grad-fatigue" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80}/>
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="value" radius={4}>
                  <LabelList dataKey="value" position="right" offset={8} className="fill-foreground" fontSize={12} formatter={(value: number) => `${value}%`} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
