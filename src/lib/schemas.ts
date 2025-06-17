
import { z } from 'zod';

export const PasswordSchema = z.string().min(8, { message: "Password must be at least 8 characters." })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character." });

export const SignupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).max(20, { message: "Username must be at most 20 characters." }).trim().optional().or(z.literal("")),
  email: z.string().email({ message: "Please enter a valid email address." }).trim(),
  password: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }).trim(),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const TwoFactorSchema = z.object({
  code: z.string().length(6, { message: "Two-factor code must be 6 digits." }).regex(/^\d+$/, {message: "Code must be numeric"}),
});

export type TwoFactorFormData = z.infer<typeof TwoFactorSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }).trim(),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }).regex(/^\d+$/, {message: "OTP must be numeric"}), // This OTP is for a mock flow if not using Firebase's email link directly
  newPassword: PasswordSchema,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
