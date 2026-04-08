import { useRouter } from 'expo-router';
import React from 'react';
import { LoginForm } from '../../component/auth/LoginForm';
import { ScreenContainer } from '../../component/common/ScreenContainer';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const { signIn, error, user, isUnapproved, isLoading } = useAuth();  // ✅ Use global isLoading and isUnapproved
  const router = useRouter();

  const handleSignIn = async (email: string, password: string) => {
    try {
      console.log('[Login] Starting sign-in with email:', email);
      await signIn(email, password);
      console.log('[Login] Sign-in successful, user state updated');
    } catch (err: any) {
      console.error('[Login] Sign-in error:', err);
    }
  };

  // Watch for user state changes and navigate after successful signin
  React.useEffect(() => {
    if (user && !isLoading && !isUnapproved) {  // ✅ Only navigate if user is approved
      console.log('[Login] User state received, navigating based on role');
      console.log('[Login] User:', { role: user.role, approved: user.approved });
      
      if (user.role === 'admin') {
        console.log('[Login] Admin user, redirecting to admin dashboard');
        router.replace('/(admin)/dashboard');
      } else if (user.role === 'teacher') {
        console.log('[Login] Teacher user, redirecting to teacher dashboard');
        router.replace('/(teacher)/dashboard');
      } else if (user.role === 'student') {
        console.log('[Login] Student user, redirecting to student dashboard');
        router.replace('/(student)/dashboard');
      }
    }
  }, [user, isUnapproved, isLoading]);

  // Navigate to pending approval if user is unapproved
  React.useEffect(() => {
    if (isUnapproved && !isLoading) {
      console.log('[Login] User is unapproved, redirecting to pending-approval');
      router.replace('/(auth)/pending-approval');
    }
  }, [isUnapproved, isLoading, router]);

  const handleSignUpPress = () => {
    router.push('/(auth)/signup');
  };

  return (
    <ScreenContainer>
      <LoginForm
        onSubmit={handleSignIn}
        onSignUpPress={handleSignUpPress}
        isLoading={isLoading}  // ✅ Pass global isLoading
        error={error || undefined}
      />
    </ScreenContainer>
  );
}