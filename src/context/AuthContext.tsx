
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { auth } from "@/lib/firebase"; // Import Firebase auth instance
import type { User as FirebaseUser } from 'firebase/auth';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile, // Import updateProfile
  sendPasswordResetEmail // Import sendPasswordResetEmail
} from 'firebase/auth';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string | null;
  // isTwoFactorEnabled?: boolean; // This would come from your DB, not directly Firebase Auth for basic setup
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>; // Re-added
  resetPassword: (otp: string, newPassword: string) => Promise<boolean>; // Mock, as Firebase handles this differently
  tempEmail: string | null; // For 2FA flow, now mock
  completeLoginAfterTwoFactor: (email: string, code: string) => void; // Mock
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tempEmail, setTempEmail] = useState<string | null>(null); // For 2FA / password reset email
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({ 
          uid: firebaseUser.uid, 
          email: firebaseUser.email,
          displayName: firebaseUser.displayName 
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, passwordInput: string) => {
    setIsLoading(true);
    setTempEmail(null);
    try {
      await signInWithEmailAndPassword(auth, email, passwordInput);
      // onAuthStateChanged handles setUser
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push('/contributions');
    } catch (error: any) {
      console.error("Login error:", error);
      toast({ title: "Login Failed", description: error.message || "Invalid email or password.", variant: "destructive" });
      setUser(null); // Ensure user is null on failed login
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (username: string, email: string, passwordInput: string) => {
    setIsLoading(true);
    setTempEmail(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, passwordInput);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: username.trim() || null });
         // Update local user state immediately after profile update for instant reflection
        setUser(prevUser => prevUser ? { ...prevUser, displayName: username.trim() || null } : null);
        if (auth.currentUser) { // Refresh user to get latest profile
            await auth.currentUser.reload();
            const refreshedFirebaseUser = auth.currentUser;
             if (refreshedFirebaseUser) {
                setUser({
                    uid: refreshedFirebaseUser.uid,
                    email: refreshedFirebaseUser.email,
                    displayName: refreshedFirebaseUser.displayName,
                });
            }
        }
      }
      toast({ title: "Signup Successful!", description: `Welcome, ${username || email}!` });
      router.push('/contributions');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({ title: "Signup Failed", description: error.message || "Could not create account.", variant: "destructive" });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setTempEmail(null);
      router.push('/login');
    } catch (error: any) {
      console.error("Logout error:", error);
       toast({ title: "Logout Failed", description: error.message || "Could not log out.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (emailForReset: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, emailForReset);
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, a password reset link has been sent. Please check your inbox.",
      });
      setTempEmail(emailForReset); // Store email for potential next step if we had custom OTP
      // With Firebase, user clicks link in email, so no OTP on our side usually.
      // router.push('/login/reset-password'); // Optional: redirect to a page saying "check your email"
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Password reset request error:", error);
      toast({
        title: "Password Reset Failed",
        description: error.message || "Could not send password reset email. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  // This resetPassword function using OTP is now largely a MOCK for the UI flow,
  // as Firebase's sendPasswordResetEmail handles the actual reset via a link.
  // A real custom OTP flow would require a backend.
  const resetPassword = async (otp: string, newPasswordValue: string): Promise<boolean> => {
    toast({
      title: "Password Reset (Mock)",
      description: "In a real Firebase flow, you'd reset via an email link. This OTP step is for UI demonstration. If the link was used, your password would be reset.",
    });
    // Simulate success for UI testing.
    if (otp === "123456" && tempEmail) { // Example mock OTP
        console.log(`Mock password reset for ${tempEmail} with new password ${newPasswordValue}`);
        setTempEmail(null);
        return true;
    }
    return false;
  };
  
  // Mock 2FA function - Firebase has its own MFA
  const completeLoginAfterTwoFactor = (email: string, code: string) => {
    console.warn("completeLoginAfterTwoFactor is a mock. Firebase MFA should be used.");
    if (email === tempEmail && code === "123123") { // Mock code
      toast({ title: "Login Successful (Mock 2FA)", description: "Welcome back!" });
      router.push('/contributions');
    } else {
      toast({ title: "2FA Failed (Mock)", description: "Invalid 2FA code.", variant: "destructive" });
    }
    setTempEmail(null);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    requestPasswordReset,
    resetPassword,
    tempEmail,
    completeLoginAfterTwoFactor,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
