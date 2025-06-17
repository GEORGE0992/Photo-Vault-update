
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ResetPasswordSchema, type ResetPasswordFormData } from "@/lib/schemas"; 
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, KeyRound, ShieldCheck, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetPasswordForm() {
  const { toast } = useToast();
  const { resetPassword } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const success = await resetPassword(data.otp, data.newPassword);
    if (success) {
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. Please log in with your new password.",
      });
      router.push("/login");
    } else {
      toast({
        title: "Password Reset Failed",
        description: "Invalid OTP or an error occurred. (Hint: The OTP sent to your email is 123456)",
        variant: "destructive",
      });
    }
  };

  const passwordRequirements = [
    "At least 8 characters",
    "At least one lowercase letter",
    "At least one uppercase letter",
    "At least one number",
    "At least one special character",
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="otp">One-Time Password (from Email)</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            placeholder="123456"
            {...form.register("otp")}
            aria-invalid={form.formState.errors.otp ? "true" : "false"}
            maxLength={6}
            className="pl-10"
          />
        </div>
        {form.formState.errors.otp && (
          <p className="text-sm text-destructive">{form.formState.errors.otp.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...form.register("newPassword")}
            aria-invalid={form.formState.errors.newPassword ? "true" : "false"}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
        {form.formState.errors.newPassword ? (
          <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>
        ) : (
           <ul className="mt-1 text-xs text-muted-foreground list-disc list-inside space-y-0.5">
            {passwordRequirements.map(req => <li key={req}>{req}</li>)}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmNewPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            {...form.register("confirmNewPassword")}
            aria-invalid={form.formState.errors.confirmNewPassword ? "true" : "false"}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
        {form.formState.errors.confirmNewPassword && (
          <p className="text-sm text-destructive">{form.formState.errors.confirmNewPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
        <ShieldCheck className="mr-2 h-5 w-5" /> Reset Password
      </Button>
      <p className="text-sm text-center">
        <Link href="/login" className="font-medium text-primary hover:underline flex items-center justify-center">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Login
        </Link>
      </p>
    </form>
  );
}
