
"use client";

import { AppShell } from "@/components/layout/AppShell";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone, DollarSign, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const TILL_NUMBER = "3475874"; 

  const handleMockPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required.",
        variant: "destructive",
      });
      return;
    }
    if (!amount.trim() || parseFloat(amount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }
    if (!/^0\d{9}$/.test(phoneNumber)) {
        toast({
            title: "Validation Error",
            description: "Please enter a valid 10-digit phone number starting with 0 (e.g., 0712345678).",
            variant: "destructive",
        });
        return;
    }

    setIsProcessingPayment(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessingPayment(false);
    toast({
      title: "M-Pesa STK Push Initiated (Mock)",
      description: `Phone: ${phoneNumber}, Amount: KES ${parseFloat(amount).toFixed(2)} to Till: ${TILL_NUMBER}. In a real app, you would receive a prompt on your phone.`,
      duration: 7000,
    });
    setPhoneNumber("");
    setAmount("");
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative min-h-screen overflow-hidden rounded-lg shadow-xl">
          <Image
            src="/images/dashboard-hero.jpg" 
            alt="Bootstrap Bosses Background"
            fill
            style={{ objectFit: "cover" }}
            className="absolute inset-0 z-0"
            priority
            data-ai-hint="logo emblem"
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
              MPESA TILL: {TILL_NUMBER}
            </div>
            <footer className="pt-8 text-sm text-gray-300 drop-shadow-sm">
              group created by Zakia💝
            </footer>
          </div>
        </div>

        {/* Mock M-Pesa Payment Section */}
        <Card className="shadow-lg w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-center">Make a Contribution (Mock)</CardTitle>
            <CardDescription className="text-center">
              Simulate a payment to M-Pesa Till: <strong>{TILL_NUMBER}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMockPayment} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  Your M-Pesa Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="e.g., 0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  disabled={isProcessingPayment}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  Amount (KES)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  disabled={isProcessingPayment}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isProcessingPayment}>
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Contribute with M-Pesa (Simulate)"
                )}
              </Button>
            </form>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
              This is a mock payment. No real transaction will occur.
            </p>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
