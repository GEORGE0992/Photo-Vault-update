
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, LogOut, Settings, ClipboardList } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


export function AppHeader() {
  const { user, logout } = useAuth();

  // Helper function to get the display name, falling back to email part or "User"
  const getDisplayName = () => {
    if (user?.displayName && user.displayName.trim() !== "") {
      return user.displayName.trim();
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  // Helper function to get the avatar initial, falling back to email initial or "U"
  const getAvatarInitial = () => {
    if (user?.displayName && user.displayName.trim() !== "") {
      return user.displayName.trim().charAt(0).toUpperCase();
    }
    if (user?.email && user.email.trim() !== "") {
      return user.email.trim().charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="text-foreground hover:bg-accent/10 px-2 sm:px-3">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-0 h-5 w-5 sm:mr-2" /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-foreground hover:bg-accent/10 px-2 sm:px-3">
            <Link href="/contributions">
              <ClipboardList className="mr-0 h-5 w-5 sm:mr-2" /> <span className="hidden sm:inline">Contributions</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-foreground hover:bg-accent/10 px-2 sm:px-3">
            <Link href="/settings">
              <Settings className="mr-0 h-5 w-5 sm:mr-2" /> <span className="hidden sm:inline">Settings</span>
            </Link>
          </Button>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage 
                      src={`https://placehold.co/100x100.png?text=${getAvatarInitial()}`} 
                      alt={getDisplayName()} 
                      data-ai-hint="avatar placeholder"
                    />
                    <AvatarFallback>{getAvatarInitial()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email || "No email"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}
