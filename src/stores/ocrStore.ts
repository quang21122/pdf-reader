import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { OCRResult, OCRProgress } from './types';

interface OCRStoreState {
  // OCR Results
  results: Record<string, OCRResult[]>; // fileId -> OCRResult[]
  currentResults: OCRResult[];
  
  // Processing state
  progress: Record<string, OCRProgress>; // fileId -> OCRProgress
  isProcessing: boolean;
  processingQueue: string[]; // fileIds in queue
  
  // Settings
  selectedLanguage: string;
  confidence_threshold: number;
  auto_save_results: boolean;
  
  // History
  processing_history: Array<{
    file_id: string;
    filename: string;
    started_at: number;
    completed_at?: number;
    status: 'completed' | 'failed' | 'cancelled';
    total_pages: number;
    processing_time?: number;
    error?: string;
  }>;
}

interface OCRStoreActions {
  // Results management
  setResults: (fileId: string, results: OCRResult[]) => void;
  addResult: (fileId: string, result: OCRResult) => void;
  updateResult: (fileId: string, resultId: string, updates: Partial<OCRResult>) => void;
  removeResults: (fileId: string) => void;
  setCurrentResults: (results: OCRResult[]) => void;
  
  // Progress management
  startProcessing: (fileId: string, totalPages: number, filename: string) => void;
  updateProgress: (fileId: string, currentPage: number, estimatedTimeRemaining?: number) => void;
  completeProcessing: (fileId: string) => void;
  failProcessing: (fileId: string, error: string) => void;
  cancelProcessing: (fileId: string) => void;
  clearProgress: (fileId: string) => void;
  
  // Queue management
  addToQueue: (fileId: string) => void;
  removeFromQueue: (fileId: string) => void;
  clearQueue: () => void;
  processNext: () => string | null;
  
  // Settings
  setSelectedLanguage: (language: string) => void;
  setConfidenceThreshold: (threshold: number) => void;
  setAutoSaveResults: (autoSave: boolean) => void;
  
  // Computed getters
  getResultsByFileId: (fileId: string) => OCRResult[];
  getProgressByFileId: (fileId: string) => OCRProgress | null;
  getCombinedText: (fileId: string) => string;
  getAverageConfidence: (fileId: string) => number;
  getProcessingStats: () => {
    total_processed: number;
    total_pages: number;
    average_processing_time: number;
    success_rate: number;
  };
  
  // Export/Import
  exportResults: (fileId: string) => string;
  exportAllResults: () => string;
  
  // Cleanup
  cleanup: (olderThanDays: number) => void;
  reset: () => void;
}

type OCRStore = OCRStoreState & OCRStoreActions;

const initialState: OCRStoreState = {
  results: {},
  currentResults: [],
  progress: {},
  isProcessing: false,
  processingQueue: [],
  selectedLanguage: 'eng',
  confidence_threshold: 70,
  auto_save_results: true,
  processing_history: [],
};

export const useOCRStore = create<OCRStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      // Results management
      setResults: (fileId, results) => set((state) => ({
        results: {
          ...state.results,
          [fileId]: results,
        },
      })),
      
      addResult: (fileId, result) => set((state) => ({
        results: {
          ...state.results,
          [fileId]: [...(state.results[fileId] || []), result],
        },
      })),
      
      updateResult: (fileId, resultId, updates) => set((state) => ({
        results: {
          ...state.results,
          [fileId]: (state.results[fileId] || []).map(result =>
            result.id === resultId ? { ...result, ...updates } : result
          ),
        },
      })),
      
      removeResults: (fileId) => set((state) => {
        const newResults = { ...state.results };
        delete newResults[fileId];
        return { results: newResults };
      }),
      
      setCurrentResults: (results) => set({ currentResults: results }),
      
      // Progress management
      startProcessing: (fileId, totalPages, filename) => set((state) => ({
        progress: {
          ...state.progress,
          [fileId]: {
            file_id: fileId,
            total_pages: totalPages,
            processed_pages: 0,
            current_page: 1,
            status: 'processing',
            start_time: Date.now(),
          },
        },
        isProcessing: true,
        processing_history: [
          ...state.processing_history,
          {
            file_id: fileId,
            filename,
            started_at: Date.now(),
            status: 'completed',
            total_pages: totalPages,
          },
        ],
      })),
      
      updateProgress: (fileId, currentPage, estimatedTimeRemaining) => set((state) => ({
        progress: {
          ...state.progress,
          [fileId]: {
            ...state.progress[fileId],
            current_page: currentPage,
            processed_pages: currentPage - 1,
            estimated_time_remaining: estimatedTimeRemaining,
          },
        },
      })),
      
      completeProcessing: (fileId) => set((state) => {
        const currentProgress = state.progress[fileId];
        const processingTime = currentProgress?.start_time 
          ? Date.now() - currentProgress.start_time 
          : 0;
        
        return {
          progress: {
            ...state.progress,
            [fileId]: {
              ...currentProgress,
              status: 'completed',
              processed_pages: currentProgress?.total_pages || 0,
            },
          },
          isProcessing: Object.values(state.progress).some(
            p => p.file_id !== fileId && p.status === 'processing'
          ),
          processing_history: state.processing_history.map(h =>
            h.file_id === fileId
              ? {
                  ...h,
                  completed_at: Date.now(),
                  processing_time: processingTime,
                  status: 'completed' as const,
                }
              : h
          ),
        };
      }),
      
      failProcessing: (fileId, error) => set((state) => ({
        progress: {
          ...state.progress,
          [fileId]: {
            ...state.progress[fileId],
            status: 'error',
            error,
          },
        },
        isProcessing: Object.values(state.progress).some(
          p => p.file_id !== fileId && p.status === 'processing'
        ),
        processing_history: state.processing_history.map(h =>
          h.file_id === fileId
            ? {
                ...h,
                completed_at: Date.now(),
                status: 'failed' as const,
                error,
              }
            : h
        ),
      })),
      
      cancelProcessing: (fileId) => set((state) => ({
        progress: {
          ...state.progress,
          [fileId]: {
            ...state.progress[fileId],
            status: 'idle',
          },
        },
        isProcessing: Object.values(state.progress).some(
          p => p.file_id !== fileId && p.status === 'processing'
        ),
        processingQueue: state.processingQueue.filter(id => id !== fileId),
        processing_history: state.processing_history.map(h =>
          h.file_id === fileId
            ? {
                ...h,
                completed_at: Date.now(),
                status: 'cancelled' as const,
              }
            : h
        ),
      })),
      
      clearProgress: (fileId) => set((state) => {
        const newProgress = { ...state.progress };
        delete newProgress[fileId];
        return { progress: newProgress };
      }),
      
      // Queue management
      addToQueue: (fileId) => set((state) => ({
        processingQueue: state.processingQueue.includes(fileId)
          ? state.processingQueue
          : [...state.processingQueue, fileId],
      })),
      
      removeFromQueue: (fileId) => set((state) => ({
        processingQueue: state.processingQueue.filter(id => id !== fileId),
      })),
      
      clearQueue: () => set({ processingQueue: [] }),
      
      processNext: () => {
        const { processingQueue } = get();
        if (processingQueue.length === 0) return null;
        
        const nextFileId = processingQueue[0];
        set((state) => ({
          processingQueue: state.processingQueue.slice(1),
        }));
        
        return nextFileId;
      },
      
      // Settings
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      setConfidenceThreshold: (threshold) => set({ confidence_threshold: threshold }),
      setAutoSaveResults: (autoSave) => set({ auto_save_results: autoSave }),
      
      // Computed getters
      getResultsByFileId: (fileId) => get().results[fileId] || [],
      
      getProgressByFileId: (fileId) => get().progress[fileId] || null,
      
      getCombinedText: (fileId) => {
        const results = get().results[fileId] || [];
        return results
          .sort((a, b) => a.page_number - b.page_number)
          .map(result => result.text)
          .join('\n\n');
      },
      
      getAverageConfidence: (fileId) => {
        const results = get().results[fileId] || [];
        if (results.length === 0) return 0;
        
        const totalConfidence = results.reduce((sum, result) => sum + result.confidence, 0);
        return totalConfidence / results.length;
      },
      
      getProcessingStats: () => {
        const { processing_history } = get();
        const completed = processing_history.filter(h => h.status === 'completed');
        
        const total_processed = processing_history.length;
        const total_pages = processing_history.reduce((sum, h) => sum + h.total_pages, 0);
        const total_time = completed.reduce((sum, h) => sum + (h.processing_time || 0), 0);
        const average_processing_time = completed.length > 0 ? total_time / completed.length : 0;
        const success_rate = total_processed > 0 ? (completed.length / total_processed) * 100 : 0;
        
        return {
          total_processed,
          total_pages,
          average_processing_time,
          success_rate,
        };
      },
      
      // Export/Import
      exportResults: (fileId) => {
        const results = get().results[fileId] || [];
        return JSON.stringify(results, null, 2);
      },
      
      exportAllResults: () => {
        const { results } = get();
        return JSON.stringify(results, null, 2);
      },
      
      // Cleanup
      cleanup: (olderThanDays) => set((state) => {
        const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
        
        return {
          processing_history: state.processing_history.filter(
            h => h.started_at > cutoffTime
          ),
        };
      }),
      
      reset: () => set(initialState),
    })),
    {
      name: 'ocr-store',
    }
  )
);
