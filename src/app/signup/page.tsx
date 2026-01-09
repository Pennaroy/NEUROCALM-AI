import { SignupForm } from '@/components/auth/signup-form';
import { Brain } from '@/components/shared/brain';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
        <Brain className="h-full w-full" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground font-headline">
              Create Your Account
            </h1>
            <p className="text-muted-foreground mt-2">
              Begin your journey to mental clarity.
            </p>
        </div>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
