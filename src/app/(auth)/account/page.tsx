'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { customizeAssistantPersonality } from '@/ai/flows/customize-assistant-personality';
import { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { PlusCircle, BatteryFull, BatteryMedium, BatteryLow, Wifi, WifiOff, Loader, ShieldCheck, Cloud, CloudOff, Camera, User } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useHealthData } from '@/lib/hooks/use-health-data';


const accountFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email(),
  phone: z.string().optional(),
  assistantPersonality: z.enum(['calm', 'friendly', 'humorous', 'professional']),
  weight: z.preprocess((val) => Number(val), z.number().positive().optional()),
  height: z.preprocess((val) => Number(val), z.number().positive().optional()),
  age: z.preprocess((val) => Number(val), z.number().positive().int().optional()),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  region: z.string().optional(),
  bodyType: z.enum(['ectomorph', 'mesomorph', 'endomorph']).optional(),
  language: z.string().optional(),
});


type Device = {
  id: string;
  name: string;
  connected: boolean;
  batteryLevel?: number;
  imageUrl: string;
};


const DeviceStatus = ({ device, onToggle }: { device: Device, onToggle: (id: string) => void }) => {
  const getBatteryIcon = () => {
    if (!device.connected || device.batteryLevel === undefined) return null;
    if (device.batteryLevel > 75) return <BatteryFull className="h-5 w-5 text-green-500" />;
    if (device.batteryLevel > 25) return <BatteryMedium className="h-5 w-5 text-yellow-500" />;
    return <BatteryLow className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg ${device.connected ? 'bg-secondary/50' : ''}`}>
      <div className="flex items-center gap-4">
        <Image src={device.imageUrl} alt={device.name} width={40} height={40} className="rounded-md" />
        <div>
          <p className="font-medium">{device.name}</p>
          <p className="text-sm text-muted-foreground">{device.connected ? `Connected` : 'Not Connected'}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {device.connected && device.batteryLevel !== undefined && (
          <div className="flex items-center gap-2">
            {getBatteryIcon()}
            <span className="text-sm font-medium">{device.batteryLevel}%</span>
          </div>
        )}
        <Button 
          variant={device.connected ? 'destructive' : 'outline'} 
          size="sm"
          onClick={() => onToggle(device.id)}
        >
          {device.connected ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
    </div>
  );
};


export default function AccountPage() {
  const { toast } = useToast();
  const { devices, toggleDeviceConnection } = useHealthData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [cloudSync, setCloudSync] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(PlaceHolderImages.avatar.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: 'Jamie Appleseed',
      email: 'jamie@neurocalm.ai',
      phone: '123-456-7890',
      assistantPersonality: 'friendly',
      weight: 70,
      height: 175,
      age: 30,
      gender: 'prefer-not-to-say',
      region: 'us-west',
      bodyType: 'mesomorph',
      language: 'en',
    },
  });

  async function onSubmit(values: z.infer<typeof accountFormSchema>) {
    setIsSubmitting(true);
    try {
      const result = await customizeAssistantPersonality({ personality: values.assistantPersonality });
      if (result.success) {
        toast({
          title: 'Settings Saved',
          description: "Your account and preference details have been updated.",
        });
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not save your settings.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const handleAddDevice = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 5000); // Simulate search for 5 seconds
  };
  
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <PageHeader title="Account Settings" description="Manage your profile and preferences." />
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-primary">
                      <AvatarImage src={avatarPreview || undefined} alt="Profile picture" />
                      <AvatarFallback>
                        <User className="w-12 h-12" />
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      type="button" 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div className="grid flex-1 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input type="email" {...field} readOnly /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                 <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input type="tel" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                  <CardDescription>Provide additional details for more personalized insights.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="weight" render={({ field }) => (<FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="height" render={({ field }) => (<FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger /></FormControl><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem><SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="bodyType" render={({ field }) => (<FormItem><FormLabel>Body Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger /></FormControl><SelectContent><SelectItem value="ectomorph">Ectomorph</SelectItem><SelectItem value="mesomorph">Mesomorph</SelectItem><SelectItem value="endomorph">Endomorph</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  </div>
                   <div className="grid md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="language" render={({ field }) => (<FormItem><FormLabel>Language</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger /></FormControl><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Spanish</SelectItem><SelectItem value="fr">French</SelectItem><SelectItem value="de">German</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="region" render={({ field }) => (<FormItem><FormLabel>Region</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger /></FormControl><SelectContent><SelectItem value="us-west">US West</SelectItem><SelectItem value="us-east">US East</SelectItem><SelectItem value="eu-central">EU Central</SelectItem><SelectItem value="apac-south">APAC South</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                   </div>
                </CardContent>
              </Card>

             <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your NeuroCalm AI experience.</CardDescription>
                </CardHeader>
                <CardContent>
                   <FormField
                    control={form.control}
                    name="assistantPersonality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI Personality</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger /></FormControl>
                          <SelectContent>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="calm">Calm</SelectItem>
                            <SelectItem value="humorous">Humorous</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose how you want your AI assistant to interact with you.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save All Changes'}
                  </Button>
                </CardFooter>
              </Card>
          </form>
        </Form>
        
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Device Integrations</CardTitle>
              <CardDescription>Connect your wearable devices to NeuroCalm AI.</CardDescription>
            </div>
             <Button variant="outline" size="sm" onClick={handleAddDevice}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {devices.map(device => (
              <DeviceStatus key={device.id} device={device} onToggle={toggleDeviceConnection} />
            ))}
          </CardContent>
        </Card>

         <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Cloud Sync</CardTitle>
            <CardDescription>Manage your data backup and storage preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                {cloudSync ? <Cloud className="text-primary"/> : <CloudOff className="text-muted-foreground"/>}
                <div>
                    <label htmlFor="cloud-sync-switch" className="font-medium cursor-pointer">Enable Cloud Data Sync</label>
                    <p className="text-sm text-muted-foreground">
                        Automatically back up your data to the cloud.
                    </p>
                </div>
              </div>
              <Switch
                id="cloud-sync-switch"
                checked={cloudSync}
                onCheckedChange={setCloudSync}
                aria-labelledby="cloud-sync-switch"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/> Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your data is protected with end-to-end 256-bit encryption. We are committed to ensuring the privacy and security of your personal information.
            </p>
          </CardContent>
        </Card>

        <footer className="text-center text-xs text-muted-foreground py-4">
          © {new Date().getFullYear()} NeuroCalm AI. All rights reserved.
        </footer>
      </div>

      <Dialog open={isSearching} onOpenChange={setIsSearching}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Searching for Devices</DialogTitle>
            <DialogDescription>
              Keep your device nearby and powered on.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-12">
            <div className="relative flex items-center justify-center w-48 h-48">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping"></div>
              <div className="absolute inset-4 border-t-2 border-primary rounded-full animate-spin"></div>
              <Loader className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
