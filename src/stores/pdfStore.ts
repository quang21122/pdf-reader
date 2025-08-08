import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { PDFFile } from "./types";

interface UploadProgress {
  file_id: string;
  filename: string;
  progress: number;
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
}

interface PDFStoreState {
  // Files data
  files: PDFFile[];
  currentFile: PDFFile | null;
  selectedFiles: string[];

  // Upload state
  uploadProgress: Record<string, UploadProgress>;
  isUploading: boolean;

  // Filters and search
  searchQuery: string;
  sortBy: "name" | "date" | "size";
  sortOrder: "asc" | "desc";
  filterStatus: "all" | "ready" | "processing" | "error";

  // Pagination
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

interface PDFStoreActions {
  // File management
  setFiles: (files: PDFFile[]) => void;
  addFile: (file: PDFFile) => void;
  updateFile: (id: string, updates: Partial<PDFFile>) => void;
  removeFile: (id: string) => void;
  setCurrentFile: (file: PDFFile | null) => void;

  // Selection
  selectFile: (id: string) => void;
  selectMultipleFiles: (ids: string[]) => void;
  clearSelection: () => void;
  toggleFileSelection: (id: string) => void;

  // Upload management
  startUpload: (fileId: string, filename: string) => void;
  updateUploadProgress: (fileId: string, progress: number) => void;
  completeUpload: (fileId: string, file: PDFFile) => void;
  failUpload: (fileId: string, error: string) => void;
  clearUploadProgress: (fileId: string) => void;

  // Search and filter
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: "name" | "date" | "size") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setFilterStatus: (status: "all" | "ready" | "processing" | "error") => void;

  // Pagination
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;

  // Computed getters
  getFilteredFiles: () => PDFFile[];
  getFileById: (id: string) => PDFFile | undefined;
  getSelectedFilesData: () => PDFFile[];
  getTotalPages: () => number;

  // Bulk operations
  deleteSelectedFiles: () => void;
  markSelectedAsProcessed: () => void;

  // Reset
  reset: () => void;
}

type PDFStore = PDFStoreState & PDFStoreActions;

const initialState: PDFStoreState = {
  files: [],
  currentFile: null,
  selectedFiles: [],
  uploadProgress: {},
  isUploading: false,
  searchQuery: "",
  sortBy: "date",
  sortOrder: "desc",
  filterStatus: "all",
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
};

export const usePDFStore = create<PDFStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // File management
      setFiles: (files) => set({ files, totalItems: files.length }),

      addFile: (file) =>
        set((state) => ({
          files: [file, ...state.files],
          totalItems: state.totalItems + 1,
        })),

      updateFile: (id, updates) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === id ? { ...file, ...updates } : file
          ),
          currentFile:
            state.currentFile?.id === id
              ? { ...state.currentFile, ...updates }
              : state.currentFile,
        })),

      removeFile: (id) =>
        set((state) => ({
          files: state.files.filter((f) => f.id !== id),
          selectedFiles: state.selectedFiles.filter((fileId) => fileId !== id),
          currentFile: state.currentFile?.id === id ? null : state.currentFile,
          totalItems: state.totalItems - 1,
        })),

      setCurrentFile: (file) => set({ currentFile: file }),

      // Selection
      selectFile: (id) => set({ selectedFiles: [id] }),

      selectMultipleFiles: (ids) => set({ selectedFiles: ids }),

      clearSelection: () => set({ selectedFiles: [] }),

      toggleFileSelection: (id) =>
        set((state) => ({
          selectedFiles: state.selectedFiles.includes(id)
            ? state.selectedFiles.filter((fileId) => fileId !== id)
            : [...state.selectedFiles, id],
        })),

      // Upload management
      startUpload: (fileId, filename) =>
        set((state) => ({
          uploadProgress: {
            ...state.uploadProgress,
            [fileId]: {
              file_id: fileId,
              filename,
              progress: 0,
              status: "uploading",
            },
          },
          isUploading: true,
        })),

      updateUploadProgress: (fileId, progress) =>
        set((state) => ({
          uploadProgress: {
            ...state.uploadProgress,
            [fileId]: {
              ...state.uploadProgress[fileId],
              progress,
            },
          },
        })),

      completeUpload: (fileId, _file) =>
        set((state) => ({
          uploadProgress: {
            ...state.uploadProgress,
            [fileId]: {
              ...state.uploadProgress[fileId],
              progress: 100,
              status: "completed",
            },
          },
          isUploading: Object.values(state.uploadProgress).some(
            (upload) =>
              upload.file_id !== fileId && upload.status === "uploading"
          ),
        })),

      failUpload: (fileId, error) =>
        set((state) => ({
          uploadProgress: {
            ...state.uploadProgress,
            [fileId]: {
              ...state.uploadProgress[fileId],
              status: "error",
              error,
            },
          },
          isUploading: Object.values(state.uploadProgress).some(
            (upload) =>
              upload.file_id !== fileId && upload.status === "uploading"
          ),
        })),

      clearUploadProgress: (fileId) =>
        set((state) => {
          const newProgress = { ...state.uploadProgress };
          delete newProgress[fileId];
          return { uploadProgress: newProgress };
        }),

      // Search and filter
      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (order) => set({ sortOrder: order }),
      setFilterStatus: (status) =>
        set({ filterStatus: status, currentPage: 1 }),

      // Pagination
      setCurrentPage: (page) => set({ currentPage: page }),
      setItemsPerPage: (items) => set({ itemsPerPage: items, currentPage: 1 }),

      // Computed getters
      getFilteredFiles: () => {
        const { files, searchQuery, sortBy, sortOrder, filterStatus } = get();

        let filtered = files;

        // Apply search filter
        if (searchQuery) {
          filtered = filtered.filter((file) =>
            file.filename.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply status filter
        if (filterStatus !== "all") {
          filtered = filtered.filter((file) => file.status === filterStatus);
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sortBy) {
            case "name":
              comparison = a.filename.localeCompare(b.filename);
              break;
            case "date":
              comparison =
                new Date(a.upload_date).getTime() -
                new Date(b.upload_date).getTime();
              break;
            case "size":
              comparison = a.file_size - b.file_size;
              break;
          }

          return sortOrder === "asc" ? comparison : -comparison;
        });

        return filtered;
      },

      getFileById: (id) => get().files.find((file) => file.id === id),

      getSelectedFilesData: () => {
        const { files, selectedFiles } = get();
        return files.filter((file) => selectedFiles.includes(file.id));
      },

      getTotalPages: () => {
        const { itemsPerPage } = get();
        const filteredFiles = get().getFilteredFiles();
        return Math.ceil(filteredFiles.length / itemsPerPage);
      },

      // Bulk operations
      deleteSelectedFiles: () =>
        set((state) => ({
          files: state.files.filter(
            (file) => !state.selectedFiles.includes(file.id)
          ),
          selectedFiles: [],
          totalItems: state.totalItems - state.selectedFiles.length,
        })),

      markSelectedAsProcessed: () =>
        set((state) => ({
          files: state.files.map((file) =>
            state.selectedFiles.includes(file.id)
              ? { ...file, status: "ready" as const }
              : file
          ),
        })),

      // Reset
      reset: () => set(initialState),
    })),
    {
      name: "pdf-store",
    }
  )
);
