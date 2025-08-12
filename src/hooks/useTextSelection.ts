import { useEffect } from "react";

export function useTextSelection(onTextSelected: (text: string) => void) {
  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const selectedText = selection.toString().trim();

        // Check if the selection is within a PDF container
        const target = event.target as HTMLElement;
        const pdfContainer =
          target.closest("[data-pdf-viewer]") ||
          target.closest(".react-pdf__Page") ||
          target.closest(".textLayer");

        // Only trigger if selection is from PDF content and has meaningful length
        if (pdfContainer && selectedText.length > 2) {
          onTextSelected(selectedText);

          // Don't auto-clear selection - let user continue selecting text
          // User can manually clear by clicking elsewhere or pressing Escape
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Press Escape to clear text selection
      if (event.key === "Escape") {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
        }
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onTextSelected]);
}
