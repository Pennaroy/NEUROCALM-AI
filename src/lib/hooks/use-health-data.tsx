'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type HealthData = {
  bloodPressure: { systolic: number; diastolic: number };
  oxygenLevel: number;
  heartRate: number;
  sleepQuality: string;
  dailySteps: number;
  stressLevel: 'low' | 'medium' | 'high';
  emotionalState: string;
  moodIndex: number;
  emotionalStability: number;
  sleepRecovery: number;
};

type Device = {
  id: string;
  name: string;
  connected: boolean;
  batteryLevel?: number;
  imageUrl: string;
};

type HealthDataContextType = {
  healthData: HealthData | null;
  devices: Device[];
  toggleDeviceConnection: (id: string) => void;
  addDevice: (device: Omit<Device, 'connected' | 'batteryLevel'>) => void;
};

const HealthDataContext = createContext<HealthDataContextType | null>(null);

const fluctuate = (base: number, range: number) => base + (Math.random() - 0.5) * range;

const initialDevices: Device[] = [
  { id: 'eeg', name: 'EEG Headset', connected: true, batteryLevel: 88, imageUrl: PlaceHolderImages.eeg_headset.imageUrl },
  { id: 'watch', name: 'Smartwatch', connected: true, batteryLevel: 62, imageUrl: PlaceHolderImages.smartwatch.imageUrl },
  { id: 'hrm', name: 'Heart Rate Monitor', connected: false, imageUrl: PlaceHolderImages.heart_rate_monitor.imageUrl },
  { id: 'sring', name: 'Smart Ring', connected: true, batteryLevel: 21, imageUrl: PlaceHolderImages.smart_ring.imageUrl },
  { id: 'oring', name: 'Oura Ring', connected: false, imageUrl: PlaceHolderImages.oura_ring.imageUrl },
  { id: 'fitbit', name: 'Fitbit Sense', connected: true, batteryLevel: 95, imageUrl: PlaceHolderImages.fitbit.imageUrl },
  { id: 'gfit', name: 'Google Fit', connected: false, imageUrl: PlaceHolderImages.google_fit.imageUrl },
  { id: 'ahealth', name: 'Apple Health', connected: true, batteryLevel: 100, imageUrl: PlaceHolderImages.apple_health.imageUrl },
];

export const HealthDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  useEffect(() => {
    const initialData: HealthData = {
      bloodPressure: { systolic: 120, diastolic: 80 },
      oxygenLevel: 98,
      heartRate: 75,
      sleepQuality: 'good',
      dailySteps: 5000,
      stressLevel: 'low',
      emotionalState: 'Calm',
      moodIndex: 8,
      emotionalStability: 7,
      sleepRecovery: 85,
    };
    setHealthData(initialData);

    const interval = setInterval(() => {
      setHealthData(prev => {
        if (!prev) return null;
        const newStressLevel = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high';
        return {
          ...prev,
          bloodPressure: {
            systolic: Math.round(fluctuate(120, 10)),
            diastolic: Math.round(fluctuate(80, 8)),
          },
          oxygenLevel: Math.round(fluctuate(98, 2)),
          heartRate: Math.round(fluctuate(75, 15)),
          dailySteps: prev.dailySteps + Math.round(Math.random() * 20),
          stressLevel: newStressLevel,
          emotionalState: newStressLevel === 'high' ? 'Stressed' : newStressLevel === 'medium' ? 'Anxious' : 'Calm',
          moodIndex: Math.round(fluctuate(7, 4)),
          emotionalStability: Math.round(fluctuate(7, 4)),
          sleepRecovery: Math.round(fluctuate(80, 20)),
        };
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);
  
  const toggleDeviceConnection = useCallback((id: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === id ? { ...device, connected: !device.connected } : device
      )
    );
  }, []);

  const addDevice = useCallback((newDevice: Omit<Device, 'connected' | 'batteryLevel'>) => {
    setDevices(prev => {
        if (prev.find(d => d.id === newDevice.id)) {
            return prev;
        }
        return [...prev, {...newDevice, connected: true, batteryLevel: Math.floor(Math.random() * 100) }]
    });
  }, []);

  const value = useMemo(() => ({
    healthData,
    devices,
    toggleDeviceConnection,
    addDevice,
  }), [healthData, devices, toggleDeviceConnection, addDevice]);

  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (context === undefined || context === null) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};
