
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ForgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas";
import { useAuth } from "@/context/AuthContext";
import { Mail, ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const { requestPasswordReset } = useAuth();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const success = await requestPasswordReset(data.email);
    if (success) {
      toast({
        title: "Request Sent",
        description: "If an account with that email exists, an OTP for password reset has been sent to your email. (Mock OTP: 123456). You can proceed to the reset password page.",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...form.register("email")}
            aria-invalid={form.formState.errors.email ? "true" : "false"}
            className="pl-10"
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
        Send Reset OTP
      </Button>
      <p className="text-sm text-center">
        <Link href="/login" className="font-medium text-primary hover:underline flex items-center justify-center">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Login
        </Link>
      </p>
       <p className="text-xs text-center text-muted-foreground pt-4">
        (For Mock: After submitting, manually navigate or click <Link href="/login/reset-password"className="underline">here to reset password</Link> using OTP '123456' sent to your email.)
      </p>
    </form>
  );
}
