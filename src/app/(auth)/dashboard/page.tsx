'use client';

import { MetricCard } from '@/components/dashboard/metric-card';
import { MoodCircle } from '@/components/dashboard/mood-circle';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { DailySummary } from '@/components/dashboard/daily-summary';
import { useHealthData } from '@/lib/hooks/use-health-data';
import { HeartPulse, Droplets, Wind, Footprints, Smartphone, Wifi, WifiOff, Link as LinkIcon } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { healthData, devices } = useHealthData();

  if (!healthData) {
    return (
      <>
        <PageHeader title="Dashboard" description="An overview of your mental wellness." />
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-64" />
            <div className="lg:col-span-3 grid grid-cols-2 gap-6">
              <Skeleton className="h-[124px]" />
              <Skeleton className="h-[124px]" />
              <Skeleton className="h-[124px]" />
              <Skeleton className="h-[124px]" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </>
    );
  }

  const connectedCount = devices.filter(d => d.connected).length;

  return (
    <>
      <PageHeader title="Dashboard" description="An overview of your mental wellness." />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-cross-gradient">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MoodCircle moodIndex={healthData.moodIndex} emotionalState={healthData.emotionalState} />
          <div className="lg:col-span-3 grid grid-cols-2 gap-6">
            <MetricCard
              title="Heart Rate"
              value={healthData.heartRate}
              unit="BPM"
              Icon={HeartPulse}
              iconClassName="text-chart-1"
            />
            <MetricCard
              title="Blood Pressure"
              value={`${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`}
              unit="mmHg"
              Icon={Droplets}
              iconClassName="text-chart-2"
            />
            <MetricCard
              title="SpO₂"
              value={`${healthData.oxygenLevel}%`}
              Icon={Wind}
              iconClassName="text-chart-3"
            />
            <MetricCard
              title="Daily Steps"
              value={healthData.dailySteps.toLocaleString()}
              Icon={Footprints}
              iconClassName="text-chart-4"
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <DailySummary />
          <div className="space-y-4 md:col-span-2">
             <Card className="shadow-lg bg-background/80 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="text-primary" />
                  <span>Device Status</span>
                </CardTitle>
                <CardDescription>{connectedCount} of {devices.length} devices connected.</CardDescription>
              </CardHeader>
              <CardContent>
                {connectedCount > 0 ? (
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full max-w-full"
                  >
                    <CarouselContent>
                      {devices.map((device) => (
                        <CarouselItem key={device.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4">
                           <div className="flex flex-col items-center gap-2 p-1">
                              <div className="relative">
                                <Image src={device.imageUrl} alt={device.name} width={64} height={64} className="rounded-full border-2 p-1 border-border" />
                                <div className={`absolute bottom-0 right-0 rounded-full p-1 border-2 border-background ${device.connected ? 'bg-green-500' : 'bg-muted'}`}>
                                  {device.connected ? <Wifi className="h-3 w-3 text-white" /> : <WifiOff className="h-3 w-3 text-muted-foreground" />}
                                </div>
                              </div>
                              <p className="text-xs text-center font-medium truncate w-full">{device.name}</p>
                            </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                  </Carousel>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <WifiOff className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg">No Devices Connected</h3>
                    <p className="text-muted-foreground text-sm mb-4">Connect your devices to start tracking your health data.</p>
                    <Button asChild>
                      <Link href="/account">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Connect Devices
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
         <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <QuickActions />
          </div>
      </div>
    </>
  );
}
