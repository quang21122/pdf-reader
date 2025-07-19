import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/utils/supabaseClient";

interface UseResetPasswordOptions {
  onSuccess?: () => void;
  redirectTo?: string;
  autoRedirect?: boolean;
}

interface ResetPasswordError {
  message: string;
  type: "validation" | "auth" | "network" | "token";
}

/**
 * Custom hook for handling password reset functionality
 * Manages new password state, validation, and password update
 */
export function useResetPassword(options: UseResetPasswordOptions = {}) {
  const { onSuccess, redirectTo = "/login", autoRedirect = true } = options;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<ResetPasswordError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const router = useRouter();
  const { updatePassword } = useAuth();

  // Get tokens from URL hash parameters (Supabase format)
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    // Parse URL hash parameters on client side
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1); // Remove the # symbol

      // Try hash parameters first (standard Supabase format)
      let params = new URLSearchParams(hash);

      // If no hash parameters, try query parameters as fallback
      if (!params.has("access_token") && window.location.search) {
        params = new URLSearchParams(window.location.search);
      }

      setUrlParams(params);
    }
  }, []);

  const accessToken = urlParams?.get("access_token");
  const refreshToken = urlParams?.get("refresh_token");
  const type = urlParams?.get("type");
  const urlError = urlParams?.get("error");
  const errorDescription = urlParams?.get("error_description");

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      // Check for error parameters first
      if (urlError) {
        setError({
          message: errorDescription || "An error occurred with the reset link.",
          type: "token",
        });
        setIsValidToken(false);
        return;
      }

      // Check if this is a recovery type and has access token
      if (type !== "recovery" || !accessToken) {
        setError({
          message:
            "Invalid or missing reset token. Please request a new password reset.",
          type: "token",
        });
        setIsValidToken(false);
        return;
      }

      try {
        // Set the session with the tokens from URL
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (sessionError) {
          setError({
            message:
              "Reset token has expired or is invalid. Please request a new password reset.",
            type: "token",
          });
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
          // Clear the hash from URL for security and cleaner UX
          if (typeof window !== "undefined") {
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
      } catch {
        setError({
          message: "Failed to validate reset token. Please try again.",
          type: "token",
        });
        setIsValidToken(false);
      }
    };

    // Only run validation when urlParams is available
    if (urlParams) {
      validateToken();
    }
  }, [urlParams, accessToken, refreshToken, type, urlError, errorDescription]);

  const validateForm = (): boolean => {
    if (!password.trim() || !confirmPassword.trim()) {
      setError({
        message: "Please fill in all required fields",
        type: "validation",
      });
      return false;
    }

    if (password.length < 6) {
      setError({
        message: "Password must be at least 6 characters long",
        type: "validation",
      });
      return false;
    }

    if (password !== confirmPassword) {
      setError({
        message: "Password confirmation does not match",
        type: "validation",
      });
      return false;
    }

    return true;
  };

  const handleResetPassword = async (): Promise<boolean> => {
    setError(null);
    setSuccess(null);

    if (!isValidToken) {
      setError({
        message: "Invalid reset token. Please request a new password reset.",
        type: "token",
      });
      return false;
    }

    if (!validateForm()) {
      return false;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await updatePassword(password);

      if (authError) {
        let errorMessage = authError.message;

        if (
          authError.message.includes("Invalid token") ||
          authError.message.includes("expired")
        ) {
          errorMessage =
            "Reset token has expired. Please request a new password reset.";
        }

        setError({
          message: errorMessage,
          type: "auth",
        });
        return false;
      } else {
        const successMessage =
          "Password has been reset successfully! You can now sign in with your new password.";
        setSuccess(successMessage);

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
    } catch {
      setError({
        message: "An unexpected error occurred. Please try again.",
        type: "network",
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
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
  };

  const isFormValid =
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword &&
    password.length >= 6;

  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = password.length >= 6;

  return {
    // Form state
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,

    // Token validation
    isValidToken,
    accessToken,
    refreshToken,

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
    handleResetPassword,
    resetForm,
  };
}
