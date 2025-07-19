import { useState, useCallback } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export interface MenuAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  divider?: boolean;
  color?: 'default' | 'error';
}

/**
 * Custom hook for managing user menu functionality
 * Handles menu state, user actions, and navigation
 */
export function useUserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSignOut = useCallback(async () => {
    handleMenuClose();
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [signOut, router, handleMenuClose]);

  const handleProfile = useCallback(() => {
    handleMenuClose();
    router.push('/profile');
  }, [router, handleMenuClose]);

  const handleSettings = useCallback(() => {
    handleMenuClose();
    router.push('/settings');
  }, [router, handleMenuClose]);

  const handleDashboard = useCallback(() => {
    handleMenuClose();
    router.push('/dashboard');
  }, [router, handleMenuClose]);

  const navigateToPage = useCallback((path: string) => {
    handleMenuClose();
    router.push(path);
  }, [router, handleMenuClose]);

  // Get user display information
  const getUserDisplayName = (): string => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  const getUserEmail = (): string => {
    return user?.email || '';
  };

  const getUserAvatar = (): string | undefined => {
    return user?.user_metadata?.avatar_url;
  };

  const getUserInitials = (): string => {
    const name = getUserDisplayName();
    const email = getUserEmail();
    
    if (name && name !== 'User') {
      return name.charAt(0).toUpperCase();
    }
    
    return email.charAt(0).toUpperCase();
  };

  // Default menu actions
  const getDefaultMenuActions = (): MenuAction[] => [
    {
      label: 'Dashboard',
      onClick: handleDashboard,
    },
    {
      label: 'Settings',
      onClick: handleSettings,
    },
    {
      label: 'Sign Out',
      onClick: handleSignOut,
      divider: true,
      color: 'error' as const,
    },
  ];

  return {
    // Menu state
    anchorEl,
    isMenuOpen,
    
    // Menu actions
    handleMenuOpen,
    handleMenuClose,
    
    // User actions
    handleSignOut,
    handleProfile,
    handleSettings,
    handleDashboard,
    navigateToPage,
    
    // User information
    user,
    loading,
    getUserDisplayName,
    getUserEmail,
    getUserAvatar,
    getUserInitials,
    
    // Menu configuration
    getDefaultMenuActions,
  };
}
