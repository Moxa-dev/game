// src/components/layout/app-layout.tsx
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, ListChecks, Trophy, Settings, LogOut, UserCircle, Briefcase, Landmark, ShieldAlert } from 'lucide-react';
import { useGameState } from '@/context/game-state-context';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: () => number | string | null;
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state, dispatch } = useGameState();

  const navItems: NavItem[] = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/quests', label: 'Quests', icon: ListChecks },
    { href: '/achievements', label: 'Achievements', icon: Trophy },
    { href: '/investments', label: 'Investments', icon: Landmark },
    { href: '/career', label: 'Career', icon: Briefcase },
    { href: '/liabilities', label: 'Liabilities', icon: ShieldAlert },
  ];
  
  const handleResetGame = () => {
    if(confirm("Are you sure you want to reset the game? All progress will be lost.")){
      dispatch({ type: 'INITIALIZE_GAME' });
    }
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="sidebar" collapsible="icon" className="border-r">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-sidebar-primary group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:ring-1">
                <AvatarImage src={`https://picsum.photos/seed/${state.playerName}/100/100`} alt={state.playerName} data-ai-hint="professional avatar"/>
                <AvatarFallback>{state.playerName.substring(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-lg text-sidebar-foreground">{state.playerName}</span>
                <span className="text-xs text-sidebar-foreground/70">Level: {state.level}</span>
              </div>
            </div>
          </SidebarHeader>

          <Separator className="bg-sidebar-border" />

          <SidebarContent className="p-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={{ children: item.label, className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
                      className="group-data-[collapsible=icon]:justify-center"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                       {item.badge && item.badge() !== null && (
                        <Badge variant="secondary" className="ml-auto group-data-[collapsible=icon]:hidden">
                          {item.badge()}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <Separator className="bg-sidebar-border" />
          
          <SidebarFooter className="p-4 mt-auto group-data-[collapsible=icon]:p-2">
             <Button variant="outline" size="sm" onClick={handleResetGame} className="w-full group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-0">
                <LogOut className="h-4 w-4 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
               <span className="ml-2 group-data-[collapsible=icon]:hidden">Reset Game</span>
             </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col bg-background">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm">
            <div className="flex items-center gap-4">
               <SidebarTrigger className="md:hidden" /> {/* Only show on mobile */}
               <h1 className="text-2xl font-semibold text-foreground">FinanceLife Sim</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                Date: {format(parseISO(state.gameDate), 'MMM yyyy')}
              </Badge>
              <UserCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
