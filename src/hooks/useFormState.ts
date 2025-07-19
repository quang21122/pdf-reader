import { useState, useCallback } from 'react';

export interface FormState {
  [key: string]: any;
}

export interface FormStateOptions {
  initialState?: FormState;
  onSubmit?: (formData: FormState) => Promise<boolean> | boolean;
  onSuccess?: (formData: FormState) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
}

/**
 * Custom hook for managing form state and submission
 * Provides a centralized way to handle form data, loading states, and submission
 */
export function useFormState(options: FormStateOptions = {}) {
  const {
    initialState = {},
    onSubmit,
    onSuccess,
    onError,
    resetOnSuccess = false
  } = options;

  const [formData, setFormData] = useState<FormState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const updateField = useCallback((fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  const updateFields = useCallback((updates: Partial<FormState>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setIsSubmitted(false);
    setSubmitCount(0);
  }, [initialState]);

  const resetToInitial = useCallback(() => {
    setFormData(initialState);
  }, [initialState]);

  const handleSubmit = useCallback(async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!onSubmit) {
      console.warn('useFormState: No onSubmit handler provided');
      return false;
    }

    setIsLoading(true);
    setIsSubmitted(true);
    setSubmitCount(prev => prev + 1);

    try {
      const result = await onSubmit(formData);
      
      if (result) {
        onSuccess?.(formData);
        if (resetOnSuccess) {
          resetForm();
        }
        return true;
      } else {
        onError?.('Form submission failed');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [formData, onSubmit, onSuccess, onError, resetOnSuccess, resetForm]);

  const getFieldValue = useCallback((fieldName: string) => {
    return formData[fieldName];
  }, [formData]);

  const hasFieldValue = useCallback((fieldName: string) => {
    const value = formData[fieldName];
    return value !== undefined && value !== null && value !== '';
  }, [formData]);

  const isFieldEmpty = useCallback((fieldName: string) => {
    return !hasFieldValue(fieldName);
  }, [hasFieldValue]);

  const getFormValues = useCallback(() => {
    return { ...formData };
  }, [formData]);

  const setFormData_ = useCallback((newData: FormState) => {
    setFormData(newData);
  }, []);

  return {
    // Form data
    formData,
    setFormData: setFormData_,
    
    // Field operations
    updateField,
    updateFields,
    getFieldValue,
    hasFieldValue,
    isFieldEmpty,
    getFormValues,
    
    // Form operations
    resetForm,
    resetToInitial,
    handleSubmit,
    
    // State
    isLoading,
    isSubmitted,
    submitCount,
  };
}

/**
 * Simplified hook for basic form state management without submission logic
 */
export function useSimpleFormState<T extends FormState>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);

  const updateField = useCallback(<K extends keyof T>(fieldName: K, value: T[K]) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
  }, [initialState]);

  const getFieldValue = useCallback(<K extends keyof T>(fieldName: K): T[K] => {
    return formData[fieldName];
  }, [formData]);

  return {
    formData,
    updateField,
    resetForm,
    getFieldValue,
    setFormData,
  };
}
