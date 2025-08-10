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
  rotation: number; // 0, 90, 180, 270 degrees

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Viewer settings
  viewMode: "single" | "continuous";
  fitMode: "width" | "height" | "page";
  showThumbnails: boolean;
  showBookmarks: boolean;
  isFullscreen: boolean;

  // Tools state
  isDrawMode: boolean;
  isTextSelectMode: boolean;

  // Search state
  searchQuery: string;
  searchResults: any[];
  currentSearchIndex: number;

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

  // Rotation operations
  setRotation: (rotation: number) => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  resetRotation: () => void;
  fitToWidth: () => void;
  fitToHeight: () => void;
  fitToPage: () => void;

  // State operations
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // View settings
  setViewMode: (mode: "single" | "continuous") => void;
  setFitMode: (mode: "width" | "height" | "page") => void;
  toggleThumbnails: () => void;
  toggleBookmarks: () => void;
  toggleFullscreen: () => void;
  setFullscreen: (fullscreen: boolean) => void;

  // Tools
  setDrawMode: (enabled: boolean) => void;
  toggleDrawMode: () => void;
  setTextSelectMode: (enabled: boolean) => void;
  toggleTextSelectMode: () => void;

  // Search
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void;
  nextSearchResult: () => void;
  prevSearchResult: () => void;
  clearSearch: () => void;

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
  rotation: 0,
  isLoading: false,
  error: null,
  viewMode: "continuous",
  fitMode: "width",
  showThumbnails: false,
  showBookmarks: false,
  isFullscreen: false,
  isDrawMode: false,
  isTextSelectMode: true,
  searchQuery: "",
  searchResults: [],
  currentSearchIndex: -1,
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

      // Rotation operations
      setRotation: (rotation) => set({ rotation: rotation % 360 }),
      rotateClockwise: () => {
        const { rotation } = get();
        set({ rotation: (rotation + 90) % 360 });
      },
      rotateCounterClockwise: () => {
        const { rotation } = get();
        set({ rotation: (rotation - 90 + 360) % 360 });
      },
      resetRotation: () => set({ rotation: 0 }),

      // State operations
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // View settings
      setViewMode: (mode) => set({ viewMode: mode }),
      setFitMode: (mode) => set({ fitMode: mode }),
      toggleThumbnails: () =>
        set((state) => ({ showThumbnails: !state.showThumbnails })),
      toggleBookmarks: () =>
        set((state) => ({ showBookmarks: !state.showBookmarks })),
      toggleFullscreen: () =>
        set((state) => ({ isFullscreen: !state.isFullscreen })),
      setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),

      // Tools
      setDrawMode: (enabled) => set({ isDrawMode: enabled }),
      toggleDrawMode: () => set((state) => ({ isDrawMode: !state.isDrawMode })),
      setTextSelectMode: (enabled) => set({ isTextSelectMode: enabled }),
      toggleTextSelectMode: () =>
        set((state) => ({ isTextSelectMode: !state.isTextSelectMode })),

      // Search
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchResults: (results) =>
        set({
          searchResults: results,
          currentSearchIndex: results.length > 0 ? 0 : -1,
        }),
      nextSearchResult: () => {
        const { searchResults, currentSearchIndex } = get();
        if (searchResults.length > 0) {
          const nextIndex = (currentSearchIndex + 1) % searchResults.length;
          set({ currentSearchIndex: nextIndex });
        }
      },
      prevSearchResult: () => {
        const { searchResults, currentSearchIndex } = get();
        if (searchResults.length > 0) {
          const prevIndex =
            currentSearchIndex === 0
              ? searchResults.length - 1
              : currentSearchIndex - 1;
          set({ currentSearchIndex: prevIndex });
        }
      },
      clearSearch: () =>
        set({ searchQuery: "", searchResults: [], currentSearchIndex: -1 }),

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
