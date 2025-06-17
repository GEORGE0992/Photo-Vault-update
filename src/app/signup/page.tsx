import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout title="Create Account" description="Join Photo Vault to securely store your memories.">
      <SignupForm />
    </AuthLayout>
  );
}
