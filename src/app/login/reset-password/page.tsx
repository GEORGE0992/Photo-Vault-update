
import { AuthLayout } from "@/components/auth/AuthLayout";
// import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"; // Form removed for now

export default function ResetPasswordPage() {
  return (
    <AuthLayout 
      title="Reset Your Password" 
      description="Password reset functionality is temporarily unavailable. It will be re-enabled using Firebase's secure password reset feature in a future update."
    >
      {/* <ResetPasswordForm /> */}
      <p className="text-center text-muted-foreground">
        Please return to the <a href="/login" className="text-primary hover:underline">login page</a>.
      </p>
    </AuthLayout>
  );
}
