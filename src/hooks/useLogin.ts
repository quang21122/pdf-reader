import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

interface UseLoginOptions {
  onSuccess?: () => void;
  redirectTo?: string;
  autoRedirect?: boolean;
}

interface LoginError {
  message: string;
  type: 'validation' | 'auth' | 'network';
}

/**
 * Custom hook for handling login functionality
 * Manages form state, validation, authentication, and redirects
 */
export function useLogin(options: UseLoginOptions = {}) {
  const { onSuccess, redirectTo = '/dashboard', autoRedirect = true } = options;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<LoginError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, user } = useAuth();

  // Handle auto-redirect when user is authenticated
  useEffect(() => {
    if (user && !isLoading && autoRedirect) {
      // Delay to ensure auth state is fully propagated
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          // Force a page reload to ensure fresh auth state
          window.location.href = redirectTo;
        }
      }, 500);
    }
  }, [user, isLoading, onSuccess, redirectTo, autoRedirect]);

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError({
        message: 'Email is required',
        type: 'validation'
      });
      return false;
    }

    if (!password.trim()) {
      setError({
        message: 'Password is required',
        type: 'validation'
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError({
        message: 'Please enter a valid email address',
        type: 'validation'
      });
      return false;
    }

    return true;
  };

  const getErrorMessage = (errorMessage: string): string => {
    if (errorMessage.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your login credentials.';
    } else if (errorMessage.includes('Email not confirmed')) {
      return 'Account not verified. Please check your email and click the verification link.';
    } else if (errorMessage.includes('Too many requests')) {
      return 'Too many login attempts. Please try again in a few minutes.';
    } else if (errorMessage.includes('User not found')) {
      return 'No account found with this email. Please sign up for a new account.';
    }
    return errorMessage;
  };

  const handleLogin = async () => {
    setError(null);
    
    if (!validateForm()) {
      return false;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await signIn(email, password);

      if (authError) {
        setError({
          message: getErrorMessage(authError.message),
          type: 'auth'
        });
        return false;
      }

      return true;
    } catch (err) {
      setError({
        message: 'An unexpected error occurred. Please try again.',
        type: 'network'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return {
    // Form state
    email,
    password,
    setEmail,
    setPassword,
    
    // Error handling
    error,
    clearError,
    
    // Loading state
    isLoading,
    
    // Form validation
    isFormValid,
    
    // Actions
    handleLogin,
    resetForm,
    
    // User state
    user,
  };
}
