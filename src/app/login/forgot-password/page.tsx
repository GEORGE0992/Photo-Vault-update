
import { AuthLayout } from "@/components/auth/AuthLayout";
// import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"; // Form removed for now

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Forgot Your Password?" 
      description="Password reset functionality is temporarily unavailable. It will be re-enabled using Firebase's secure password reset feature in a future update. Please contact support if you need immediate assistance."
    >
      {/* <ForgotPasswordForm /> */}
       <p className="text-center text-muted-foreground">
        Please return to the <a href="/login" className="text-primary hover:underline">login page</a>.
      </p>
    </AuthLayout>
  );
}
