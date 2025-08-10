import { useState, useCallback } from "react";

export interface SearchResult {
  pageNumber: number;
  text: string;
  context: string;
  position: { x: number; y: number };
}

export function usePDFSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);

  const searchInPDFText = useCallback(
    async (query: string): Promise<SearchResult[]> => {
      // Try multiple selectors to find text content
      let textLayers = document.querySelectorAll(
        ".react-pdf__Page__textContent"
      );

      // If no text layers found, try alternative selectors
      if (textLayers.length === 0) {
        textLayers = document.querySelectorAll(".textLayer");
      }

      if (textLayers.length === 0) {
        textLayers = document.querySelectorAll("[class*='textContent']");
      }

      // Wait a bit for text layers to be available if they're not ready yet
      if (textLayers.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        textLayers = document.querySelectorAll(".react-pdf__Page__textContent");
      }

      const results: SearchResult[] = [];
      const pagesWithMatches = new Set<number>();

      textLayers.forEach((textLayer) => {
        const pageElement =
          textLayer.closest(".react-pdf__Page") ||
          textLayer.closest("[id*='page']");
        const pageId =
          pageElement?.id ||
          pageElement?.getAttribute("data-page-number") ||
          "";
        const pageNumber = parseInt(pageId.replace(/\D/g, "") || "0");

        if (pageNumber > 0) {
          const textSpans = textLayer.querySelectorAll("span");

          textSpans.forEach((span) => {
            const text = span.textContent || "";
            const lowerText = text.toLowerCase();
            const lowerQuery = query.toLowerCase();

            if (lowerText.includes(lowerQuery)) {
              // Only add one result per page to show page count, not word count
              if (!pagesWithMatches.has(pageNumber)) {
                pagesWithMatches.add(pageNumber);

                // Get context around the match
                const matchIndex = lowerText.indexOf(lowerQuery);
                const contextStart = Math.max(0, matchIndex - 30);
                const contextEnd = Math.min(
                  text.length,
                  matchIndex + query.length + 30
                );
                const context = text.substring(contextStart, contextEnd);

                results.push({
                  pageNumber,
                  text: query,
                  context: `...${context}...`,
                  position: { x: 0, y: 0 },
                });
              }
            }
          });
        }
      });

      return results;
    },
    []
  );

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setCurrentResultIndex(-1);
        return [];
      }

      setIsSearching(true);

      try {
        const results = await searchInPDFText(query);
        setSearchResults(results);
        setCurrentResultIndex(results.length > 0 ? 0 : -1);
        return results;
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
        setCurrentResultIndex(-1);
        return [];
      } finally {
        setIsSearching(false);
      }
    },
    [searchInPDFText]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setCurrentResultIndex(-1);
  }, []);

  const nextResult = useCallback(() => {
    if (searchResults.length > 0) {
      const nextIndex = (currentResultIndex + 1) % searchResults.length;
      setCurrentResultIndex(nextIndex);
      return searchResults[nextIndex];
    }
    return null;
  }, [searchResults, currentResultIndex]);

  const prevResult = useCallback(() => {
    if (searchResults.length > 0) {
      const prevIndex =
        currentResultIndex === 0
          ? searchResults.length - 1
          : currentResultIndex - 1;
      setCurrentResultIndex(prevIndex);
      return searchResults[prevIndex];
    }
    return null;
  }, [searchResults, currentResultIndex]);

  const goToResult = useCallback(
    (index: number) => {
      if (index >= 0 && index < searchResults.length) {
        setCurrentResultIndex(index);
        return searchResults[index];
      }
      return null;
    },
    [searchResults]
  );

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    currentResultIndex,
    isSearching,
    performSearch,
    clearSearch,
    nextResult,
    prevResult,
    goToResult,
  };
}
