import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { PDFFile } from "./types";

interface PDFViewerState {
  // Current file being viewed
  currentFile: PDFFile | null;
  fileUrl: string | null;
  fileId: string | null;
  
  // PDF document state
  numPages: number;
  currentPage: number;
  scale: number;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Viewer settings
  fitMode: "width" | "height" | "page";
  showThumbnails: boolean;
  showBookmarks: boolean;
  
  // Navigation history
  pageHistory: number[];
  historyIndex: number;
}

interface PDFViewerActions {
  // File operations
  setCurrentFile: (file: PDFFile | null) => void;
  setFileUrl: (url: string | null) => void;
  setFileId: (id: string | null) => void;
  
  // Document operations
  setNumPages: (pages: number) => void;
  setCurrentPage: (page: number) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  
  // Scale operations
  setScale: (scale: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitToWidth: () => void;
  fitToHeight: () => void;
  fitToPage: () => void;
  
  // State operations
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Settings
  setFitMode: (mode: "width" | "height" | "page") => void;
  toggleThumbnails: () => void;
  toggleBookmarks: () => void;
  
  // Navigation history
  addToHistory: (page: number) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  
  // Reset
  reset: () => void;
}

type PDFViewerStore = PDFViewerState & PDFViewerActions;

const initialState: PDFViewerState = {
  currentFile: null,
  fileUrl: null,
  fileId: null,
  numPages: 0,
  currentPage: 1,
  scale: 1.0,
  isLoading: false,
  error: null,
  fitMode: "width",
  showThumbnails: false,
  showBookmarks: false,
  pageHistory: [1],
  historyIndex: 0,
};

export const usePDFViewerStore = create<PDFViewerStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      // File operations
      setCurrentFile: (file) => set({ currentFile: file }),
      setFileUrl: (url) => set({ fileUrl: url }),
      setFileId: (id) => set({ fileId: id }),
      
      // Document operations
      setNumPages: (pages) => set({ numPages: pages }),
      setCurrentPage: (page) => {
        const state = get();
        if (page >= 1 && page <= state.numPages) {
          set({ currentPage: page });
          get().addToHistory(page);
        }
      },
      goToPage: (page) => get().setCurrentPage(page),
      nextPage: () => {
        const { currentPage, numPages } = get();
        if (currentPage < numPages) {
          get().setCurrentPage(currentPage + 1);
        }
      },
      prevPage: () => {
        const { currentPage } = get();
        if (currentPage > 1) {
          get().setCurrentPage(currentPage - 1);
        }
      },
      
      // Scale operations
      setScale: (scale) => {
        const clampedScale = Math.max(0.5, Math.min(3.0, scale));
        set({ scale: clampedScale });
      },
      zoomIn: () => {
        const { scale } = get();
        get().setScale(scale + 0.2);
      },
      zoomOut: () => {
        const { scale } = get();
        get().setScale(scale - 0.2);
      },
      resetZoom: () => set({ scale: 1.0 }),
      fitToWidth: () => set({ fitMode: "width", scale: 1.0 }),
      fitToHeight: () => set({ fitMode: "height", scale: 1.0 }),
      fitToPage: () => set({ fitMode: "page", scale: 1.0 }),
      
      // State operations
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Settings
      setFitMode: (mode) => set({ fitMode: mode }),
      toggleThumbnails: () => set((state) => ({ showThumbnails: !state.showThumbnails })),
      toggleBookmarks: () => set((state) => ({ showBookmarks: !state.showBookmarks })),
      
      // Navigation history
      addToHistory: (page) => {
        const { pageHistory, historyIndex } = get();
        const newHistory = pageHistory.slice(0, historyIndex + 1);
        newHistory.push(page);
        set({
          pageHistory: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },
      goBack: () => {
        const { pageHistory, historyIndex } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const page = pageHistory[newIndex];
          set({
            currentPage: page,
            historyIndex: newIndex,
          });
        }
      },
      goForward: () => {
        const { pageHistory, historyIndex } = get();
        if (historyIndex < pageHistory.length - 1) {
          const newIndex = historyIndex + 1;
          const page = pageHistory[newIndex];
          set({
            currentPage: page,
            historyIndex: newIndex,
          });
        }
      },
      canGoBack: () => {
        const { historyIndex } = get();
        return historyIndex > 0;
      },
      canGoForward: () => {
        const { pageHistory, historyIndex } = get();
        return historyIndex < pageHistory.length - 1;
      },
      
      // Reset
      reset: () => set(initialState),
    })),
    { name: "pdf-viewer-store" }
  )
);
