import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { PDFFile } from "./types";

interface HighlightData {
  id: string;
  pageNumber: number;
  text: string;
  boundingRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color: string;
  createdAt: Date;
}

interface TextAnnotationData {
  id: string;
  pageNumber: number;
  text: string;
  position: {
    x: number;
    y: number;
  };
  fontSize: number;
  color: string;
  fontFamily: string;
  createdAt: Date;
}

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
  isTextAnnotationMode: boolean;
  isHighlightMode: boolean;

  // Highlight state
  highlights: HighlightData[];

  // Text annotations state
  textAnnotations: TextAnnotationData[];
  hasUnsavedChanges: boolean;

  // Undo/Redo state
  undoRedoHistory: {
    highlights: HighlightData[];
    textAnnotations: TextAnnotationData[];
  }[];
  undoRedoIndex: number;
  maxHistorySize: number;

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
  setTextAnnotationMode: (enabled: boolean) => void;
  toggleTextAnnotationMode: () => void;
  setHighlightMode: (enabled: boolean) => void;
  toggleHighlightMode: () => void;

  // Highlights
  addHighlight: (highlight: Omit<HighlightData, "id" | "createdAt">) => void;
  removeHighlight: (id: string) => void;
  clearHighlights: () => void;
  getHighlightsForPage: (pageNumber: number) => HighlightData[];

  // Text Annotations
  addTextAnnotation: (
    annotation: Omit<TextAnnotationData, "id" | "createdAt">
  ) => void;
  removeTextAnnotation: (id: string) => void;
  updateTextAnnotation: (
    id: string,
    updates: Partial<Omit<TextAnnotationData, "id" | "createdAt">>
  ) => void;
  clearTextAnnotations: () => void;
  getTextAnnotationsForPage: (pageNumber: number) => TextAnnotationData[];

  // Save functionality
  saveAnnotations: () => Promise<void>;
  markUnsavedChanges: () => void;
  markChangesSaved: () => void;
  refreshPDF: () => void;

  // Undo/Redo functionality
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;

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
  isTextAnnotationMode: false,
  isHighlightMode: false,
  highlights: [],
  textAnnotations: [],
  hasUnsavedChanges: false,
  undoRedoHistory: [{ highlights: [], textAnnotations: [] }],
  undoRedoIndex: 0,
  maxHistorySize: 50,
  searchQuery: "",
  searchResults: [],
  currentSearchIndex: -1,
  pageHistory: [1],
  historyIndex: 0,
};

export const usePDFViewerStore = create<PDFViewerStore>()(
  devtools(
    subscribeWithSelector((set, get) => {
      // Add fullscreen change listener when store is created
      if (typeof document !== "undefined") {
        const handleFullscreenChange = () => {
          const isCurrentlyFullscreen = !!(
            document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).msFullscreenElement
          );
          set({ isFullscreen: isCurrentlyFullscreen });
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener(
          "webkitfullscreenchange",
          handleFullscreenChange
        );
        document.addEventListener("msfullscreenchange", handleFullscreenChange);
      }

      return {
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
        toggleFullscreen: async () => {
          const state = get();
          const newFullscreenState = !state.isFullscreen;

          try {
            if (newFullscreenState) {
              // Enter fullscreen
              if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
              } else if (
                (document.documentElement as any).webkitRequestFullscreen
              ) {
                // Safari
                await (
                  document.documentElement as any
                ).webkitRequestFullscreen();
              } else if (
                (document.documentElement as any).msRequestFullscreen
              ) {
                // IE/Edge
                await (document.documentElement as any).msRequestFullscreen();
              }
            } else {
              // Exit fullscreen
              if (document.exitFullscreen) {
                await document.exitFullscreen();
              } else if ((document as any).webkitExitFullscreen) {
                // Safari
                await (document as any).webkitExitFullscreen();
              } else if ((document as any).msExitFullscreen) {
                // IE/Edge
                await (document as any).msExitFullscreen();
              }
            }

            // Update state after successful fullscreen change
            set({ isFullscreen: newFullscreenState });
          } catch (error) {
            console.error("Failed to toggle fullscreen:", error);
            // Don't update state if fullscreen operation failed
          }
        },
        setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),

        // Tools
        setDrawMode: (enabled) => set({ isDrawMode: enabled }),
        toggleDrawMode: () =>
          set((state) => ({ isDrawMode: !state.isDrawMode })),
        setTextAnnotationMode: (enabled) =>
          set({ isTextAnnotationMode: enabled }),
        toggleTextAnnotationMode: () =>
          set((state) => ({
            isTextAnnotationMode: !state.isTextAnnotationMode,
          })),
        setHighlightMode: (enabled) => set({ isHighlightMode: enabled }),
        toggleHighlightMode: () =>
          set((state) => ({ isHighlightMode: !state.isHighlightMode })),

        // Highlights
        addHighlight: (highlight) => {
          // Save current state to history before making changes
          get().saveToHistory();

          const newHighlight: HighlightData = {
            ...highlight,
            id: `highlight_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 11)}`,
            createdAt: new Date(),
          };
          set((state) => ({
            highlights: [...state.highlights, newHighlight],
            hasUnsavedChanges: true,
          }));
        },
        removeHighlight: (id) => {
          // Save current state to history before making changes
          get().saveToHistory();

          set((state) => ({
            highlights: state.highlights.filter((h) => h.id !== id),
            hasUnsavedChanges: true,
          }));
        },
        clearHighlights: () => {
          // Save current state to history before making changes
          get().saveToHistory();

          set({ highlights: [], hasUnsavedChanges: true });
        },
        getHighlightsForPage: (pageNumber) => {
          const { highlights } = get();
          return highlights.filter((h) => h.pageNumber === pageNumber);
        },

        // Text Annotations
        addTextAnnotation: (annotation) => {
          // Save current state to history before making changes
          get().saveToHistory();

          const newAnnotation: TextAnnotationData = {
            ...annotation,
            id: `text_annotation_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 11)}`,
            createdAt: new Date(),
          };
          set((state) => ({
            textAnnotations: [...state.textAnnotations, newAnnotation],
            hasUnsavedChanges: true,
          }));
        },
        removeTextAnnotation: (id) => {
          // Save current state to history before making changes
          get().saveToHistory();

          set((state) => ({
            textAnnotations: state.textAnnotations.filter((a) => a.id !== id),
            hasUnsavedChanges: true,
          }));
        },
        updateTextAnnotation: (id, updates) => {
          // Save current state to history before making changes
          get().saveToHistory();

          set((state) => ({
            textAnnotations: state.textAnnotations.map((a) =>
              a.id === id ? { ...a, ...updates } : a
            ),
            hasUnsavedChanges: true,
          }));
        },
        clearTextAnnotations: () => {
          // Save current state to history before making changes
          get().saveToHistory();

          set({ textAnnotations: [], hasUnsavedChanges: true });
        },
        getTextAnnotationsForPage: (pageNumber) => {
          const { textAnnotations } = get();
          return textAnnotations.filter((a) => a.pageNumber === pageNumber);
        },

        // Save functionality
        saveAnnotations: async () => {
          const { fileId, fileUrl, textAnnotations, highlights, currentFile } =
            get();
          if (!fileId || !fileUrl) {
            console.warn("No file ID or URL available for saving");
            return;
          }

          try {
            console.log("Saving annotations to PDF for file:", fileId);

            // Import PDF modifier dynamically to avoid SSR issues
            const { saveModifiedPDFToSupabase } = await import(
              "@/utils/pdfModifier"
            );

            // Save the modified PDF back to Supabase (overwrite original)
            const result = await saveModifiedPDFToSupabase(
              fileUrl,
              textAnnotations,
              highlights,
              fileId,
              currentFile?.filename || "document.pdf"
            );

            console.log("Save result:", result);

            // Wait a bit for the file to be processed on the server
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Force refresh the PDF URL to show updated content
            const baseUrl = fileUrl.split("?")[0];
            const refreshUrl = `${baseUrl}?v=${Date.now()}`;

            console.log("Refreshing PDF URL from:", fileUrl, "to:", refreshUrl);

            // Update state with new URL but keep annotations temporarily
            set({
              fileUrl: refreshUrl,
            });

            // Wait for PDF to load with new content, then clear annotations
            setTimeout(() => {
              set({
                hasUnsavedChanges: false,
                textAnnotations: [],
                highlights: [],
              });
              console.log("Annotations cleared after PDF refresh");
            }, 2000);

            console.log("PDF with annotations saved successfully");
          } catch (error) {
            console.error("Failed to save PDF with annotations:", error);
            throw error;
          }
        },
        markUnsavedChanges: () => set({ hasUnsavedChanges: true }),
        markChangesSaved: () => set({ hasUnsavedChanges: false }),
        refreshPDF: () => {
          const { fileUrl } = get();
          if (fileUrl) {
            // Force refresh by adding timestamp to URL
            const refreshUrl = `${fileUrl}?refresh=${Date.now()}`;
            set({ fileUrl: refreshUrl });
          }
        },

        // Undo/Redo functionality
        saveToHistory: () => {
          const {
            highlights,
            textAnnotations,
            undoRedoHistory,
            undoRedoIndex,
            maxHistorySize,
          } = get();

          // Create new history entry
          const newEntry = {
            highlights: [...highlights],
            textAnnotations: [...textAnnotations],
          };

          // Remove any history after current index (when we're not at the end)
          const newHistory = undoRedoHistory.slice(0, undoRedoIndex + 1);

          // Add new entry
          newHistory.push(newEntry);

          // Limit history size
          if (newHistory.length > maxHistorySize) {
            newHistory.shift();
          }

          set({
            undoRedoHistory: newHistory,
            undoRedoIndex: newHistory.length - 1,
          });
        },

        undo: () => {
          const { undoRedoHistory, undoRedoIndex } = get();

          if (undoRedoIndex > 0) {
            const newIndex = undoRedoIndex - 1;
            const historyEntry = undoRedoHistory[newIndex];

            set({
              highlights: [...historyEntry.highlights],
              textAnnotations: [...historyEntry.textAnnotations],
              undoRedoIndex: newIndex,
              hasUnsavedChanges: true,
            });
          }
        },

        redo: () => {
          const { undoRedoHistory, undoRedoIndex } = get();

          if (undoRedoIndex < undoRedoHistory.length - 1) {
            const newIndex = undoRedoIndex + 1;
            const historyEntry = undoRedoHistory[newIndex];

            set({
              highlights: [...historyEntry.highlights],
              textAnnotations: [...historyEntry.textAnnotations],
              undoRedoIndex: newIndex,
              hasUnsavedChanges: true,
            });
          }
        },

        canUndo: () => {
          const { undoRedoIndex } = get();
          return undoRedoIndex > 0;
        },

        canRedo: () => {
          const { undoRedoHistory, undoRedoIndex } = get();
          return undoRedoIndex < undoRedoHistory.length - 1;
        },

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
      };
    }),
    { name: "pdf-viewer-store" }
  )
);
