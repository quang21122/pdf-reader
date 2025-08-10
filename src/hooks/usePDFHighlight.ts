import { useCallback } from "react";
import { SearchResult } from "./usePDFSearch";

export function usePDFHighlight() {
  const highlightTextMatches = useCallback(
    (
      span: Element,
      text: string,
      query: string,
      pageElement: Element,
      className: string = "pdf-search-highlight",
      backgroundColor: string = "#ffff00",
      opacity: number = 0.6,
      zIndex: number = 10
    ) => {
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();

      // Find all occurrences of the query in the text
      const matches: { start: number; end: number }[] = [];
      let index = 0;

      while (index < lowerText.length) {
        const foundIndex = lowerText.indexOf(lowerQuery, index);
        if (foundIndex === -1) break;

        matches.push({
          start: foundIndex,
          end: foundIndex + query.length,
        });
        index = foundIndex + 1;
      }

      // Create highlights for each match
      matches.forEach((match) => {
        // Use Range API for more accurate text positioning
        const range = document.createRange();
        const textNode = span.firstChild;

        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          try {
            range.setStart(textNode, match.start);
            range.setEnd(textNode, match.end);

            const rects = range.getClientRects();

            // Handle multi-line matches by creating highlights for each rect
            Array.from(rects).forEach((rect) => {
              if (rect.width > 0 && rect.height > 0) {
                const pageRect = pageElement.getBoundingClientRect();

                const highlight = document.createElement("div");
                highlight.className = className;
                highlight.style.cssText = `
                position: absolute;
                background-color: ${backgroundColor} !important;
                opacity: ${opacity} !important;
                pointer-events: none;
                z-index: ${zIndex} !important;
                left: ${rect.left - pageRect.left}px;
                top: ${rect.top - pageRect.top}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                border-radius: 2px;
                box-shadow: 0 0 2px rgba(255, 255, 0, 0.8);
                mix-blend-mode: multiply;
              `;

                (pageElement as HTMLElement).style.position = "relative";
                pageElement.appendChild(highlight);
              }
            });
          } catch (error) {
            // Fallback to character-based calculation if Range API fails
            const spanRect = span.getBoundingClientRect();
            const pageRect = pageElement.getBoundingClientRect();
            const charWidth = spanRect.width / text.length;
            const matchStart = match.start * charWidth;
            const matchWidth = (match.end - match.start) * charWidth;

            const highlight = document.createElement("div");
            highlight.className = className;
            highlight.style.cssText = `
            position: absolute;
            background-color: ${backgroundColor} !important;
            opacity: ${opacity} !important;
            pointer-events: none;
            z-index: ${zIndex} !important;
            left: ${spanRect.left - pageRect.left + matchStart}px;
            top: ${spanRect.top - pageRect.top}px;
            width: ${matchWidth}px;
            height: ${spanRect.height}px;
            border-radius: 2px;
            box-shadow: 0 0 2px rgba(255, 255, 0, 0.8);
            mix-blend-mode: multiply;
          `;

            (pageElement as HTMLElement).style.position = "relative";
            pageElement.appendChild(highlight);
          }
        }
      });
    },
    []
  );

  const removeHighlights = useCallback(() => {
    const highlights = document.querySelectorAll(".pdf-search-highlight");
    highlights.forEach((highlight) => highlight.remove());

    const currentHighlights = document.querySelectorAll(
      ".pdf-search-current-highlight"
    );
    currentHighlights.forEach((highlight) => highlight.remove());
  }, []);

  const highlightSearchResults = useCallback(
    async (query: string) => {
      removeHighlights();

      if (!query.trim()) return;

      // Wait for text layers to be available
      let textLayers = document.querySelectorAll(
        ".react-pdf__Page__textContent"
      );

      // If no text layers found, try alternative selectors and wait
      if (textLayers.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        textLayers = document.querySelectorAll(".react-pdf__Page__textContent");
      }

      if (textLayers.length === 0) {
        textLayers = document.querySelectorAll(".textLayer");
      }

      if (textLayers.length === 0) {
        textLayers = document.querySelectorAll("[class*='textContent']");
      }

      textLayers.forEach((textLayer) => {
        const textSpans = textLayer.querySelectorAll("span");

        textSpans.forEach((span) => {
          const text = span.textContent || "";
          const lowerText = text.toLowerCase();
          const lowerQuery = query.toLowerCase();

          if (lowerText.includes(lowerQuery)) {
            const pageElement = span.closest(".react-pdf__Page");
            if (pageElement) {
              highlightTextMatches(span, text, query, pageElement);
            }
          }
        });
      });
    },
    [highlightTextMatches, removeHighlights]
  );

  const highlightCurrentResult = useCallback(
    (result: SearchResult, query: string) => {
      // Remove current result highlight
      const currentHighlights = document.querySelectorAll(
        ".pdf-search-current-highlight"
      );
      currentHighlights.forEach((h) => h.remove());

      // Add current result highlight (different color)
      const textLayers = document.querySelectorAll(
        ".react-pdf__Page__textContent"
      );
      textLayers.forEach((textLayer) => {
        const pageElement = textLayer.closest(".react-pdf__Page");
        const pageNumber = pageElement?.id?.replace("page_", "");

        if (pageNumber === result.pageNumber.toString()) {
          const textSpans = textLayer.querySelectorAll("span");

          for (let i = 0; i < textSpans.length; i++) {
            const span = textSpans[i];
            const text = span.textContent || "";
            if (text.toLowerCase().includes(query.toLowerCase())) {
              highlightTextMatches(
                span,
                text,
                query,
                pageElement!,
                "pdf-search-current-highlight",
                "#ff9800",
                0.8,
                11
              );
              break;
            }
          }
        }
      });
    },
    [highlightTextMatches]
  );

  const scrollToResult = useCallback(
    (result: SearchResult, onGoToPage: (pageNumber: number) => void) => {
      onGoToPage(result.pageNumber);

      setTimeout(() => {
        const pageElement = document.getElementById(
          `page_${result.pageNumber}`
        );
        if (pageElement) {
          pageElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    },
    []
  );

  return {
    highlightSearchResults,
    highlightCurrentResult,
    removeHighlights,
    scrollToResult,
  };
}
