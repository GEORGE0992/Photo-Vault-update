
"use client";

import { AppShell } from "@/components/layout/AppShell";
import Image from "next/image";
// import { useState } from "react"; // No longer needed for M-Pesa
// import { Button } from "@/components/ui/button"; // No longer needed for M-Pesa form
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // No longer needed for M-Pesa form
// import { Input } from "@/components/ui/input"; // No longer needed for M-Pesa form
// import { Label } from "@/components/ui/label"; // No longer needed for M-Pesa form
// import { useToast } from "@/hooks/use-toast"; // No longer needed for M-Pesa
// import { Phone, DollarSign, Loader2 } from "lucide-react"; // Icons and Loader2 no longer needed for M-Pesa
// No longer importing M-Pesa flow
// import { initiateMpesaStkPush, type MpesaStkPushInput, type MpesaStkPushOutput } from "@/ai/flows/mpesa-stk-push-flow";

export default function DashboardPage() {
  // const { toast } = useToast(); // Removed as no longer used
  // const [phoneNumber, setPhoneNumber] = useState(""); // Removed
  // const [amount, setAmount] = useState(""); // Removed
  // const [isProcessingPayment, setIsProcessingPayment] = useState(false); // Removed

  // handleMockPayment function removed

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative min-h-[calc(80vh-12rem)] overflow-hidden rounded-lg shadow-xl">
          <Image
            src="https://placehold.co/1200x800.png"
            alt="Bootstrap Bosses Background"
            fill
            style={{ objectFit: "cover" }}
            className="absolute inset-0 z-0"
            data-ai-hint="emblem motivation"
            priority
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-6 bg-black/60 p-4 text-center text-white sm:p-6 md:p-8">
            <h1 className="text-4xl font-bold tracking-tight drop-shadow-md sm:text-5xl md:text-7xl font-headline">
              BOOTSTRAP BOSSES
            </h1>
            <p className="max-w-2xl drop-shadow-sm sm:text-lg md:text-xl font-body">
              Bosses don&apos;t wait for opportunities, they create them😎🙎‍♀️
              <br />
              A group for strong young lads with great ambition and a growth mindset.
            </p>
            <div className="transform rounded-lg bg-accent px-6 py-3 text-lg font-semibold text-accent-foreground shadow-md transition-transform duration-300 hover:scale-105 md:text-xl">
              MPESA TILL: 3475874 {/* This can stay as static text if desired */}
            </div>
            <footer className="pt-8 text-sm text-gray-300 drop-shadow-sm">
              group created by Zakia💝
            </footer>
          </div>
        </div>

        {/* Mock M-Pesa Payment Section Removed */}
      </div>
    </AppShell>
  );
}
