import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { PDFFile } from "./types";

interface FileViewerState {
  // Current file data
  file: PDFFile | null;
  fileUrl: string | null;
  fileId: string | null;
  
  // Loading states
  isLoading: boolean;
  isLoadingFile: boolean;
  isLoadingUrl: boolean;
  
  // Error states
  error: string | null;
  fileError: string | null;
  urlError: string | null;
  
  // UI states
  showToolbar: boolean;
  toolbarHeight: number;
  
  // Recent files
  recentFiles: PDFFile[];
  maxRecentFiles: number;
}

interface FileViewerActions {
  // File operations
  setFile: (file: PDFFile | null) => void;
  setFileUrl: (url: string | null) => void;
  setFileId: (id: string | null) => void;
  
  // Loading operations
  setLoading: (loading: boolean) => void;
  setLoadingFile: (loading: boolean) => void;
  setLoadingUrl: (loading: boolean) => void;
  
  // Error operations
  setError: (error: string | null) => void;
  setFileError: (error: string | null) => void;
  setUrlError: (error: string | null) => void;
  clearErrors: () => void;
  
  // UI operations
  setShowToolbar: (show: boolean) => void;
  toggleToolbar: () => void;
  setToolbarHeight: (height: number) => void;
  
  // Recent files operations
  addToRecentFiles: (file: PDFFile) => void;
  removeFromRecentFiles: (fileId: string) => void;
  clearRecentFiles: () => void;
  
  // Combined operations
  loadFile: (fileId: string, file: PDFFile, fileUrl: string) => void;
  
  // Reset
  reset: () => void;
}

type FileViewerStore = FileViewerState & FileViewerActions;

const initialState: FileViewerState = {
  file: null,
  fileUrl: null,
  fileId: null,
  isLoading: false,
  isLoadingFile: false,
  isLoadingUrl: false,
  error: null,
  fileError: null,
  urlError: null,
  showToolbar: true,
  toolbarHeight: 64,
  recentFiles: [],
  maxRecentFiles: 10,
};

export const useFileViewerStore = create<FileViewerStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      // File operations
      setFile: (file) => set({ file }),
      setFileUrl: (url) => set({ fileUrl: url }),
      setFileId: (id) => set({ fileId: id }),
      
      // Loading operations
      setLoading: (loading) => set({ isLoading: loading }),
      setLoadingFile: (loading) => set({ isLoadingFile: loading }),
      setLoadingUrl: (loading) => set({ isLoadingUrl: loading }),
      
      // Error operations
      setError: (error) => set({ error }),
      setFileError: (error) => set({ fileError: error }),
      setUrlError: (error) => set({ urlError: error }),
      clearErrors: () => set({ 
        error: null, 
        fileError: null, 
        urlError: null 
      }),
      
      // UI operations
      setShowToolbar: (show) => set({ showToolbar: show }),
      toggleToolbar: () => set((state) => ({ showToolbar: !state.showToolbar })),
      setToolbarHeight: (height) => set({ toolbarHeight: height }),
      
      // Recent files operations
      addToRecentFiles: (file) => {
        const { recentFiles, maxRecentFiles } = get();
        const filtered = recentFiles.filter(f => f.id !== file.id);
        const newRecentFiles = [file, ...filtered].slice(0, maxRecentFiles);
        set({ recentFiles: newRecentFiles });
      },
      removeFromRecentFiles: (fileId) => {
        const { recentFiles } = get();
        const filtered = recentFiles.filter(f => f.id !== fileId);
        set({ recentFiles: filtered });
      },
      clearRecentFiles: () => set({ recentFiles: [] }),
      
      // Combined operations
      loadFile: (fileId, file, fileUrl) => {
        set({
          fileId,
          file,
          fileUrl,
          isLoading: false,
          error: null,
          fileError: null,
          urlError: null,
        });
        get().addToRecentFiles(file);
      },
      
      // Reset
      reset: () => set(initialState),
    })),
    { name: "file-viewer-store" }
  )
);
