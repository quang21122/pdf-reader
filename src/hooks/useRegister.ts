import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

interface UseRegisterOptions {
  onSuccess?: () => void;
  redirectTo?: string;
  autoRedirect?: boolean;
}

interface RegisterError {
  message: string;
  type: 'validation' | 'auth' | 'network';
}

/**
 * Custom hook for handling user registration functionality
 * Manages form state, validation, registration, and redirects
 */
export function useRegister(options: UseRegisterOptions = {}) {
  const { onSuccess, redirectTo = '/login', autoRedirect = true } = options;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<RegisterError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError({
        message: 'Please fill in all required fields',
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

    if (password.length < 6) {
      setError({
        message: 'Password must be at least 6 characters long',
        type: 'validation'
      });
      return false;
    }

    if (password !== confirmPassword) {
      setError({
        message: 'Password confirmation does not match',
        type: 'validation'
      });
      return false;
    }

    if (!acceptTerms) {
      setError({
        message: 'Please accept the terms of service and privacy policy',
        type: 'validation'
      });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return false;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await signUp(email, password);

      if (authError) {
        setError({
          message: authError.message,
          type: 'auth'
        });
        return false;
      } else {
        setSuccess(
          'Registration successful! Please check your email to verify your account.'
        );
        
        if (autoRedirect) {
          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push(redirectTo);
            }
          }, 2000);
        }
        
        return true;
      }
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

  const clearSuccess = () => {
    setSuccess(null);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAcceptTerms(false);
    setError(null);
    setSuccess(null);
  };

  const isFormValid = 
    email.trim() !== '' && 
    password.trim() !== '' && 
    confirmPassword.trim() !== '' && 
    acceptTerms;

  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = password.length >= 6;

  return {
    // Form state
    email,
    password,
    confirmPassword,
    acceptTerms,
    setEmail,
    setPassword,
    setConfirmPassword,
    setAcceptTerms,
    
    // Error and success handling
    error,
    success,
    clearError,
    clearSuccess,
    
    // Loading state
    isLoading,
    
    // Form validation
    isFormValid,
    passwordsMatch,
    isPasswordValid,
    
    // Actions
    handleRegister,
    resetForm,
  };
}
