import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useNotifications } from "@/hooks/useNotifications";
import { getPDFDownloadUrl } from "@/utils/uploadUtils";
import { apolloClient } from "@/graphql/client";
import { GET_PDF_FILE_BY_ID } from "@/graphql/queries";
import { useFileViewerStore } from "@/stores";

/**
 * Custom hook for file viewer functionality
 * Handles loading file data and download URL
 */
export function useFileViewer(fileId: string) {
  const { user } = useAuth();
  const { error: showErrorNotification } = useNotifications();

  // Zustand store
  const {
    file,
    fileUrl,
    isLoading,
    error,
    setFile,
    setFileUrl,
    setLoading,
    setError,
  } = useFileViewerStore();

  // Load file data
  useEffect(() => {
    const loadFile = async () => {
      if (!user || !fileId) return;

      try {
        setLoading(true);
        setError(null);

        // Get file metadata from GraphQL
        const { data } = await apolloClient.query({
          query: GET_PDF_FILE_BY_ID,
          variables: { id: fileId, userId: user.id },
          fetchPolicy: "network-only",
        });

        if (!data.getPDFFile) {
          setError("File not found or you don't have permission to view it");
          return;
        }

        const fileData = data.getPDFFile;
        setFile(fileData);

        // Get download URL for viewing
        const downloadUrl = await getPDFDownloadUrl(fileData.file_path);
        setFileUrl(downloadUrl);
      } catch (err) {
        console.error("Error loading file:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load file";
        setError(errorMessage);
        showErrorNotification("Load Failed", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [
    user,
    fileId,
    showErrorNotification,
    setError,
    setFile,
    setFileUrl,
    setLoading,
  ]);

  return {
    file,
    fileUrl,
    isLoading,
    error,
  };
}
