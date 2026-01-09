'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Smartphone, Apple } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  otp: z.string().optional(),
  connectAppleHealth: z.boolean().default(false),
  connectGoogleFit: z.boolean().default(false),
  terms: z.boolean().default(false).refine(val => val === true, {
    message: "You must accept the terms and conditions."
  }),
});

export function LoginForm() {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      otp: '',
      connectAppleHealth: false,
      connectGoogleFit: true,
      terms: false,
    },
  });

  function handleSendOtp() {
    // In a real app, this would trigger a backend service to send an OTP
    setOtpSent(true);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Placeholder for actual login logic
    router.push('/dashboard');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or Phone</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="you@neurocalm.ai" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {otpSent && (
           <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
         {!otpSent && (
          <Button variant="secondary" className="w-full" onClick={handleSendOtp}>
            Sign In with Email OTP
          </Button>
        )}
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Connect Health Services</p>
            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="connectGoogleFit"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Connect Google Fit
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="connectAppleHealth"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Connect Apple Health
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the <Link href="#" className="text-primary hover:underline">Terms & Conditions</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg">
          Sign In
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
        <Button variant="outline" className="w-full" size="lg">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20h-24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8 8 0 0 1 24 36c-5.223 0-9.651-3.358-11.303-8h-8.034C7.943 35.125 15.27 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20h-24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.053 36.551 44 30.732 44 24c0-1.341-.138-2.65-.389-3.917z" />
          </svg>
          Google
        </Button>
        <Button variant="outline" className="w-full" size="lg">
          <Apple className="mr-2 h-4 w-4" />
          Apple
        </Button>
        </div>
      </form>
    </Form>
  );
}
