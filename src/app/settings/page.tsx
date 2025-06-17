
"use client";

import { AppShell } from "@/components/layout/AppShell";
// import { Button } from "@/components/ui/button"; // Button might not be needed for now
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch"; // Switch for 2FA removed
import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast"; // Toast for 2FA not needed now
import { Mail } from "lucide-react"; // Shield icons removed
// import Image from "next/image"; // QR code image removed
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth(); 
  // const { toast } = useToast(); // Removed
  
  // const [isTwoFactorUISetup, setIsTwoFactorUISetup] = useState(false); // Removed
  // const [showQrCode, setShowQrCode] = useState(false);  // Removed

  // useEffect(() => { // 2FA logic removed
  //   if (user) {
  //     // setIsTwoFactorUISetup(user.isTwoFactorEnabled || false); // Property doesn't exist on Firebase user yet
  //   }
  // }, [user]);

  // const handleToggleTwoFactorSetup = () => { // Removed
  // };

  // const handleConfirmTwoFactorSetup = () => { // Removed
  // };

  return (
    <AppShell>
      <div className="space-y-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Account Settings</h1>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Profile Information</CardTitle>
            <CardDescription>Manage your username (if set) and email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username (Display Name)</Label>
              <Input id="username" value={user?.displayName || "Not set"} readOnly className="bg-muted cursor-not-allowed" />
            </div>
             <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" type="email" value={user?.email || ""} readOnly className="bg-muted cursor-not-allowed pl-10" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Security</CardTitle>
            <CardDescription>
              Account security features like Two-Factor Authentication (2FA) and Password Management 
              will be available here once re-integrated with Firebase Authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Advanced security settings are temporarily unavailable.
            </p>
            {/* 2FA UI Removed
            <div className="flex items-center justify-between p-4 border rounded-lg">
              ...
            </div>

            {showQrCode && !isTwoFactorUISetup && (
              ...
            )}
             {isTwoFactorUISetup && !showQrCode && (
               ...
             )}
            */}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
