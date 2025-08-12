import { useState, useCallback } from "react";

export function useFileViewerState() {
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState(0); // 0 = Pages, 1 = Bookmarks
  const [translateSidebarOpen, setTranslateSidebarOpen] = useState(false);
  const [selectedTextForTranslation, setSelectedTextForTranslation] =
    useState("");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  // Handlers
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleSidebarOpenToTab = useCallback((tabIndex: number) => {
    setSidebarTab(tabIndex);
    setSidebarOpen(true);
  }, []);

  const handleSearchOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setSearchAnchorEl(event.currentTarget);
      setSearchDropdownOpen(true);
    },
    []
  );

  const handleSearchClose = useCallback(() => {
    setSearchDropdownOpen(false);
    setSearchAnchorEl(null);
  }, []);

  const handleSettingsOpen = useCallback(() => {
    setSettingsDialogOpen(true);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setSettingsDialogOpen(false);
  }, []);

  const handleBookmark = useCallback(() => {
    // Open sidebar and switch to bookmarks tab
    handleSidebarOpenToTab(1);
  }, [handleSidebarOpenToTab]);

  const handleTranslateToggle = useCallback(() => {
    setTranslateSidebarOpen((prev) => !prev);
  }, []);

  const handleTranslateClose = useCallback(() => {
    setTranslateSidebarOpen(false);
  }, []);

  const handleTextSelected = useCallback(
    (text: string) => {
      setSelectedTextForTranslation(text);
      if (!translateSidebarOpen) {
        setTranslateSidebarOpen(true);
      }

      // Show a brief notification or feedback that text was captured
      console.log(
        "Text selected for translation:",
        text.substring(0, 50) + "..."
      );
    },
    [translateSidebarOpen]
  );

  return {
    // State
    sidebarOpen,
    sidebarTab,
    translateSidebarOpen,
    selectedTextForTranslation,
    searchDropdownOpen,
    searchAnchorEl,
    settingsDialogOpen,

    // Handlers
    handleSidebarToggle,
    handleSidebarClose,
    handleSidebarOpenToTab,
    setSidebarTab,
    handleSearchOpen,
    handleSearchClose,
    handleSettingsOpen,
    handleSettingsClose,
    handleBookmark,
    handleTranslateToggle,
    handleTranslateClose,
    handleTextSelected,
  };
}
