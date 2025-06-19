
"use client";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function TwoFactorAuthPage() {

  return (
    <AuthLayout 
        title="Two-Factor Authentication" 
        description="This feature (Two-Factor Authentication) is temporarily unavailable. It will be re-enabled using Firebase's built-in security features in a future update. Please proceed by logging in directly if you have already signed up."
    >
      {/* <TwoFactorForm /> */}
      <p className="text-center text-muted-foreground">
        If you've just signed up or are logging in, you should be redirected shortly. 
        If not, please try navigating to the <a href="/login" className="text-primary hover:underline">login page</a>.
      </p>
    </AuthLayout>
  );
}
