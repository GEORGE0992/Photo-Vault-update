
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast"; // Toast is now handled in AuthContext
import { TwoFactorSchema, type TwoFactorFormData } from "@/lib/schemas";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck } from "lucide-react";

export function TwoFactorForm() {
  const { tempEmail, completeLoginAfterTwoFactor } = useAuth();

  const form = useForm<TwoFactorFormData>({
    resolver: zodResolver(TwoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (data: TwoFactorFormData) => {
    if (tempEmail) {
      completeLoginAfterTwoFactor(tempEmail, data.code);
    } else {
        // This case should ideally be prevented by the page-level useEffect redirecting if tempEmail is null
        console.error("2FA submission attempt without tempEmail. This should not happen.");
        // Optionally, redirect or show a generic error
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="code">One-Time Password</Label>
        <Input
          id="code"
          type="text"
          inputMode="numeric"
          placeholder="123456"
          {...form.register("code")}
          aria-invalid={form.formState.errors.code ? "true" : "false"}
          maxLength={6}
        />
        {form.formState.errors.code && (
          <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
        <ShieldCheck className="mr-2 h-5 w-5" /> Verify Code
      </Button>
    </form>
  );
}
