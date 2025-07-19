import { useState } from 'react';

/**
 * Custom hook for managing password visibility state
 * Useful for password input fields with show/hide toggle
 */
export function usePasswordVisibility(initialVisible: boolean = false) {
  const [showPassword, setShowPassword] = useState(initialVisible);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const hidePassword = () => {
    setShowPassword(false);
  };

  const showPasswordField = () => {
    setShowPassword(true);
  };

  return {
    showPassword,
    togglePasswordVisibility,
    hidePassword,
    showPasswordField,
  };
}

/**
 * Custom hook for managing multiple password fields visibility
 * Useful for forms with password and confirm password fields
 */
export function useMultiplePasswordVisibility() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const hideAllPasswords = () => {
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return {
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    hideAllPasswords,
  };
}
