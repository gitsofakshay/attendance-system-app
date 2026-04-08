import { useRouter } from 'expo-router';
import React from 'react';
import { SignupForm } from '../../component/auth/SignupForm';
import { ScreenContainer } from '../../component/common/ScreenContainer';
import { useAuth } from '../../hooks/useAuth';

export default function SignupScreen() {
  const { signUp, error, user, isUnapproved, isLoading } = useAuth(); 
  const router = useRouter();

  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
    role: 'teacher' | 'student'
  ) => {
    try {
      console.log('[Signup] Creating account for email:', email);
      await signUp(email, password, name, role);
      console.log('[Signup] Account created successfully, user state updated');
    } catch (err) {
      console.error('[Signup] Sign-up error:', err);
    }
  };

  // Watch for user state changes and navigate after successful signup
  React.useEffect(() => {
    if (isUnapproved && !isLoading) { 
      console.log('[Signup] User state received after signup, navigating to pending-approval');
      router.replace('/(auth)/pending-approval');
    }
  }, [isUnapproved, isLoading]);

  const handleSignInPress = () => {
    router.push('/(auth)/login');
  };

  return (
    <ScreenContainer>
      <SignupForm
        onSubmit={handleSignUp}
        onSignInPress={handleSignInPress}
        isLoading={isLoading} 
        error={error || undefined}
      />
    </ScreenContainer>
  );
}