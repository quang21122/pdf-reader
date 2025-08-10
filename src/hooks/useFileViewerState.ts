import { useState, useCallback } from "react";

export function useFileViewerState() {
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    console.log("Bookmark clicked");
  }, []);

  return {
    // State
    sidebarOpen,
    searchDropdownOpen,
    searchAnchorEl,
    settingsDialogOpen,

    // Handlers
    handleSidebarToggle,
    handleSidebarClose,
    handleSearchOpen,
    handleSearchClose,
    handleSettingsOpen,
    handleSettingsClose,
    handleBookmark,
  };
}
