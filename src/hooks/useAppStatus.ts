import { usePDFStore, useOCRStore, useUIStore } from "@/stores";

/**
 * Custom hook for getting application status information
 * Provides easy access to loading states, file counts, and error status
 */
export const useAppStatus = () => {
  const { files, isUploading } = usePDFStore();
  const { isProcessing } = useOCRStore();
  const { notifications, loading_states } = useUIStore();
  
  const isAppLoading =
    isUploading || isProcessing || Object.values(loading_states).some(Boolean);

  return {
    isLoading: isAppLoading,
    isUploading,
    isProcessing,
    filesCount: files.length,
    notificationsCount: notifications.length,
    hasErrors: notifications.some((n: any) => n.type === "error"),
  };
};
