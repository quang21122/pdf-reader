import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export interface ValidationErrors {
  [fieldName: string]: string;
}

/**
 * Custom hook for form validation
 * Provides flexible validation rules and error management
 */
export function useFormValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((fieldName: string, value: any): string | null => {
    const rule = rules[fieldName];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return rule.message || `${fieldName} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `${fieldName} must be at least ${rule.minLength} characters`;
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `${fieldName} must be no more than ${rule.maxLength} characters`;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `${fieldName} format is invalid`;
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((formData: { [key: string]: any }): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const validateSingleField = useCallback((fieldName: string, value: any): boolean => {
    const error = validateField(fieldName, value);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: error || ''
    }));

    return !error;
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  }, []);

  const hasErrors = Object.values(errors).some(error => error !== '');
  const getFieldError = (fieldName: string) => errors[fieldName] || '';

  return {
    errors,
    validateForm,
    validateSingleField,
    clearErrors,
    clearFieldError,
    hasErrors,
    getFieldError,
  };
}

/**
 * Common validation rules for reuse
 */
export const commonValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Password must be at least 6 characters long'
  },
  confirmPassword: (password: string) => ({
    required: true,
    custom: (value: string) => {
      if (value !== password) {
        return 'Password confirmation does not match';
      }
      return null;
    }
  }),
  required: (fieldName: string) => ({
    required: true,
    message: `${fieldName} is required`
  }),
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL'
  },
  pdfUrl: {
    pattern: /^https?:\/\/.+\.pdf$/i,
    message: 'Please enter a valid PDF URL'
  }
};
