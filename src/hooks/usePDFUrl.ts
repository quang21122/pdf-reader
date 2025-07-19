import { useState, useCallback, useEffect } from 'react';
import { usePDFValidation } from './usePDFValidation';

export interface PDFUrlState {
  url: string;
  isValid: boolean;
  isLoaded: boolean;
  error: string | null;
}

export interface UsePDFUrlOptions {
  autoValidate?: boolean;
  validateOnChange?: boolean;
  initialUrl?: string;
  onUrlChange?: (url: string) => void;
  onValidationComplete?: (isValid: boolean) => void;
}

/**
 * Custom hook for managing PDF URL state and validation
 * Provides URL management with built-in validation
 */
export function usePDFUrl(options: UsePDFUrlOptions = {}) {
  const {
    autoValidate = false,
    validateOnChange = false,
    initialUrl = '',
    onUrlChange,
    onValidationComplete
  } = options;

  const [pdfUrl, setPdfUrl] = useState(initialUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { validatePDFUrl, checkPDFAccessibility, isValidating } = usePDFValidation();

  // Handle URL changes
  const handleUrlChange = useCallback((newUrl: string) => {
    setPdfUrl(newUrl);
    setError(null);
    setIsLoaded(false);
    onUrlChange?.(newUrl);

    // Auto-validate if enabled
    if (validateOnChange && newUrl.trim()) {
      const validation = validatePDFUrl(newUrl);
      if (!validation.isValid) {
        setError(validation.error?.message || 'Invalid PDF URL');
        onValidationComplete?.(false);
      } else {
        setError(null);
        onValidationComplete?.(true);
      }
    }
  }, [validatePDFUrl, validateOnChange, onUrlChange, onValidationComplete]);

  // Load and validate PDF
  const loadPDF = useCallback(async (url?: string): Promise<boolean> => {
    const targetUrl = url || pdfUrl;
    
    if (!targetUrl.trim()) {
      setError('Please enter a PDF URL');
      return false;
    }

    setError(null);
    setIsLoaded(false);

    try {
      const validation = await checkPDFAccessibility(targetUrl);
      
      if (validation.isValid) {
        setIsLoaded(true);
        setError(null);
        onValidationComplete?.(true);
        return true;
      } else {
        setError(validation.error?.message || 'PDF validation failed');
        setIsLoaded(false);
        onValidationComplete?.(false);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF';
      setError(errorMessage);
      setIsLoaded(false);
      onValidationComplete?.(false);
      return false;
    }
  }, [pdfUrl, checkPDFAccessibility, onValidationComplete]);

  // Quick validation without loading
  const validateUrl = useCallback((url?: string): boolean => {
    const targetUrl = url || pdfUrl;
    const validation = validatePDFUrl(targetUrl);
    
    if (!validation.isValid) {
      setError(validation.error?.message || 'Invalid PDF URL');
      return false;
    }
    
    setError(null);
    return true;
  }, [pdfUrl, validatePDFUrl]);

  // Reset state
  const resetPDF = useCallback(() => {
    setPdfUrl('');
    setIsLoaded(false);
    setError(null);
  }, []);

  // Set URL from predefined samples
  const loadSamplePDF = useCallback((sampleUrl: string) => {
    handleUrlChange(sampleUrl);
    if (autoValidate) {
      loadPDF(sampleUrl);
    }
  }, [handleUrlChange, autoValidate, loadPDF]);

  // Auto-validate on mount if initial URL is provided
  useEffect(() => {
    if (autoValidate && initialUrl.trim()) {
      loadPDF(initialUrl);
    }
  }, [autoValidate, initialUrl, loadPDF]);

  // Common sample PDF URLs
  const getSamplePDFUrls = useCallback(() => [
    {
      name: 'Sample PDF 1',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      name: 'Sample PDF 2', 
      url: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf'
    }
  ], []);

  const isValidUrl = !error && pdfUrl.trim() !== '';
  const canProcess = isLoaded && !error && !isValidating;

  return {
    // State
    pdfUrl,
    isLoaded,
    error,
    isValidating,
    isValidUrl,
    canProcess,
    
    // Actions
    setPdfUrl: handleUrlChange,
    loadPDF,
    validateUrl,
    resetPDF,
    loadSamplePDF,
    
    // Utilities
    getSamplePDFUrls,
    
    // Computed state
    state: {
      url: pdfUrl,
      isValid: isValidUrl,
      isLoaded,
      error
    } as PDFUrlState
  };
}
