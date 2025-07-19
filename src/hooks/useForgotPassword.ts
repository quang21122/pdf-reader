import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

interface UseForgotPasswordOptions {
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
}

interface ForgotPasswordError {
  message: string;
  type: "validation" | "auth" | "network";
}

/**
 * Custom hook for handling forgot password functionality
 * Manages email state, validation, and password reset request
 */
export function useForgotPassword(options: UseForgotPasswordOptions = {}) {
  const { onSuccess, onError } = options;

  const [email, setEmail] = useState("");
  const [error, setError] = useState<ForgotPasswordError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { resetPassword } = useAuth();

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setError({
        message: "Please enter your email address",
        type: "validation",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError({
        message: "Please enter a valid email address",
        type: "validation",
      });
      return false;
    }

    return true;
  };

  const handleForgotPassword = async (
    emailToReset?: string
  ): Promise<boolean> => {
    const targetEmail = emailToReset || email;
    setError(null);
    setSuccess(null);

    if (!validateEmail(targetEmail)) {
      return false;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await resetPassword(targetEmail);

      if (authError) {
        const errorMessage = authError.message.includes("User not found")
          ? "No account found with this email address"
          : authError.message;

        setError({
          message: errorMessage,
          type: "auth",
        });
        onError?.(errorMessage);
        return false;
      } else {
        const successMessage =
          "Password reset email has been sent! Please check your inbox and follow the instructions.";
        setSuccess(successMessage);
        onSuccess?.(targetEmail);
        return true;
      }
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError({
        message: errorMessage,
        type: "network",
      });
      onError?.(errorMessage);
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
    setEmail("");
    setError(null);
    setSuccess(null);
  };

  const isFormValid =
    email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return {
    // Form state
    email,
    setEmail,

    // Error and success handling
    error,
    success,
    clearError,
    clearSuccess,

    // Loading state
    isLoading,

    // Form validation
    isFormValid,

    // Actions
    handleForgotPassword,
    resetForm,
  };
}
