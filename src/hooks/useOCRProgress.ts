import { useState, useCallback } from 'react';

export interface OCRProgress {
  status: string;
  progress: number;
  currentPage?: number;
  totalPages?: number;
  stage?: 'loading' | 'converting' | 'processing' | 'extracting' | 'completed' | 'error';
}

/**
 * Custom hook for managing OCR processing progress
 */
export function useOCRProgress() {
  const [progress, setProgress] = useState<OCRProgress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startProgress = useCallback((totalPages?: number) => {
    setIsProcessing(true);
    setProgress({
      status: 'Starting OCR processing...',
      progress: 0,
      totalPages,
      stage: 'loading'
    });
  }, []);

  const updateProgress = useCallback((update: Partial<OCRProgress>) => {
    setProgress(prev => {
      if (!prev) return null;
      return { ...prev, ...update };
    });
  }, []);

  const setLoadingStage = useCallback((status: string) => {
    updateProgress({
      status,
      stage: 'loading',
      progress: 10
    });
  }, [updateProgress]);

  const setConvertingStage = useCallback((status: string, progress: number = 25) => {
    updateProgress({
      status,
      stage: 'converting',
      progress
    });
  }, [updateProgress]);

  const setProcessingStage = useCallback((status: string, currentPage?: number, totalPages?: number) => {
    const progress = currentPage && totalPages 
      ? 30 + (currentPage / totalPages) * 60 
      : 50;
    
    updateProgress({
      status,
      stage: 'processing',
      progress,
      currentPage,
      totalPages
    });
  }, [updateProgress]);

  const setExtractingStage = useCallback((status: string, progress: number = 90) => {
    updateProgress({
      status,
      stage: 'extracting',
      progress
    });
  }, [updateProgress]);

  const completeProgress = useCallback((status: string = 'OCR processing completed!') => {
    setProgress({
      status,
      progress: 100,
      stage: 'completed'
    });
    setIsProcessing(false);
  }, []);

  const setError = useCallback((errorMessage: string) => {
    setProgress({
      status: errorMessage,
      progress: 0,
      stage: 'error'
    });
    setIsProcessing(false);
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(null);
    setIsProcessing(false);
  }, []);

  const getProgressPercentage = (): number => {
    return progress?.progress || 0;
  };

  const getProgressStatus = (): string => {
    return progress?.status || '';
  };

  const getCurrentStage = (): string => {
    return progress?.stage || 'loading';
  };

  const isInStage = (stage: OCRProgress['stage']): boolean => {
    return progress?.stage === stage;
  };

  return {
    progress,
    isProcessing,
    
    // Progress control
    startProgress,
    updateProgress,
    completeProgress,
    setError,
    resetProgress,
    
    // Stage setters
    setLoadingStage,
    setConvertingStage,
    setProcessingStage,
    setExtractingStage,
    
    // Getters
    getProgressPercentage,
    getProgressStatus,
    getCurrentStage,
    isInStage,
  };
}
