'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HealthDataProvider } from "@/lib/hooks/use-health-data";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { BrainCircuit, HeartPulse, LayoutDashboard, LogOut, MessageSquare, Settings, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "AI Assistant", icon: MessageSquare },
  { href: "/eeg", label: "EEG Tracker", icon: Waves },
  { href: "/health", label: "Health Metrics", icon: HeartPulse },
  { href: "/account", label: "Account", icon: Settings },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Placeholder for logout logic
    router.push('/');
  };

  return (
    <HealthDataProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar className="border-r" collapsible="icon">
            <SidebarHeader className="p-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <BrainCircuit className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-bold font-headline group-data-[collapsible=icon]:hidden">
                  NeuroCalm
                </h2>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href)}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4">
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </Button>
            </SidebarFooter>
          </Sidebar>
          <main className="flex-1 flex flex-col overflow-y-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </HealthDataProvider>
  );
}
