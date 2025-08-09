import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface UploadState {
  // Selected file
  selectedFile: File | null;
  
  // Upload progress
  isUploading: boolean;
  progress: number;
  
  // States
  error: string | null;
  success: boolean;
  uploadedFile: any | null;
  
  // Validation
  validationErrors: string[];
  
  // Settings
  maxFileSize: number; // MB
  allowedTypes: string[];
  
  // History
  uploadHistory: Array<{
    id: string;
    filename: string;
    size: number;
    uploadDate: string;
    status: "success" | "error";
    error?: string;
  }>;
}

interface UploadActions {
  // File selection
  setSelectedFile: (file: File | null) => void;
  clearSelectedFile: () => void;
  
  // Upload progress
  setUploading: (uploading: boolean) => void;
  setProgress: (progress: number) => void;
  updateProgress: (progress: number) => void;
  
  // States
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  setUploadedFile: (file: any | null) => void;
  
  // Validation
  addValidationError: (error: string) => void;
  clearValidationErrors: () => void;
  validateFile: (file: File) => boolean;
  
  // Settings
  setMaxFileSize: (size: number) => void;
  setAllowedTypes: (types: string[]) => void;
  
  // History
  addToHistory: (upload: {
    id: string;
    filename: string;
    size: number;
    status: "success" | "error";
    error?: string;
  }) => void;
  clearHistory: () => void;
  
  // Combined operations
  startUpload: (file: File) => void;
  completeUpload: (uploadedFile: any) => void;
  failUpload: (error: string) => void;
  
  // Reset
  reset: () => void;
  resetUploadState: () => void;
}

type UploadStore = UploadState & UploadActions;

const initialState: UploadState = {
  selectedFile: null,
  isUploading: false,
  progress: 0,
  error: null,
  success: false,
  uploadedFile: null,
  validationErrors: [],
  maxFileSize: 50, // 50MB default
  allowedTypes: ["application/pdf"],
  uploadHistory: [],
};

export const useUploadStore = create<UploadStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      // File selection
      setSelectedFile: (file) => {
        set({ selectedFile: file });
        if (file) {
          get().validateFile(file);
        } else {
          get().clearValidationErrors();
        }
      },
      clearSelectedFile: () => set({ selectedFile: null }),
      
      // Upload progress
      setUploading: (uploading) => set({ isUploading: uploading }),
      setProgress: (progress) => set({ progress: Math.max(0, Math.min(100, progress)) }),
      updateProgress: (progress) => get().setProgress(progress),
      
      // States
      setError: (error) => set({ error }),
      setSuccess: (success) => set({ success }),
      setUploadedFile: (file) => set({ uploadedFile: file }),
      
      // Validation
      addValidationError: (error) => {
        const { validationErrors } = get();
        if (!validationErrors.includes(error)) {
          set({ validationErrors: [...validationErrors, error] });
        }
      },
      clearValidationErrors: () => set({ validationErrors: [] }),
      validateFile: (file) => {
        const { maxFileSize, allowedTypes } = get();
        get().clearValidationErrors();
        
        let isValid = true;
        
        // Check file type
        if (!allowedTypes.includes(file.type)) {
          get().addValidationError(`File type ${file.type} is not allowed`);
          isValid = false;
        }
        
        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxFileSize) {
          get().addValidationError(`File size (${fileSizeMB.toFixed(1)}MB) exceeds limit of ${maxFileSize}MB`);
          isValid = false;
        }
        
        // Check if file is empty
        if (file.size === 0) {
          get().addValidationError("File is empty");
          isValid = false;
        }
        
        return isValid;
      },
      
      // Settings
      setMaxFileSize: (size) => set({ maxFileSize: size }),
      setAllowedTypes: (types) => set({ allowedTypes: types }),
      
      // History
      addToHistory: (upload) => {
        const { uploadHistory } = get();
        const newHistory = [
          {
            ...upload,
            uploadDate: new Date().toISOString(),
          },
          ...uploadHistory.slice(0, 49), // Keep last 50 uploads
        ];
        set({ uploadHistory: newHistory });
      },
      clearHistory: () => set({ uploadHistory: [] }),
      
      // Combined operations
      startUpload: (file) => {
        set({
          selectedFile: file,
          isUploading: true,
          progress: 0,
          error: null,
          success: false,
          uploadedFile: null,
        });
      },
      completeUpload: (uploadedFile) => {
        const { selectedFile } = get();
        set({
          isUploading: false,
          progress: 100,
          success: true,
          uploadedFile,
          error: null,
        });
        
        if (selectedFile) {
          get().addToHistory({
            id: uploadedFile?.id || Date.now().toString(),
            filename: selectedFile.name,
            size: selectedFile.size,
            status: "success",
          });
        }
      },
      failUpload: (error) => {
        const { selectedFile } = get();
        set({
          isUploading: false,
          error,
          success: false,
          uploadedFile: null,
        });
        
        if (selectedFile) {
          get().addToHistory({
            id: Date.now().toString(),
            filename: selectedFile.name,
            size: selectedFile.size,
            status: "error",
            error,
          });
        }
      },
      
      // Reset
      reset: () => set(initialState),
      resetUploadState: () => set({
        isUploading: false,
        progress: 0,
        error: null,
        success: false,
        uploadedFile: null,
        validationErrors: [],
      }),
    })),
    { name: "upload-store" }
  )
);
