import Link from 'next/link';
import { Brain } from '@/components/shared/brain';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 z-0 opacity-50">
        <Brain className="h-full w-full" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-7xl font-headline">
          NeuroCalm AI
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          Your Mind Companion for Mental Wellness & Emotional Balance.
        </p>        
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
