import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  requireAuth?: boolean;
  external?: boolean;
}

/**
 * Custom hook for navigation functionality
 * Provides navigation helpers and route management
 */
export function useNavigation() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const navigateTo = useCallback(
    (path: string, external: boolean = false) => {
      if (external) {
        window.open(path, "_blank");
      } else {
        router.push(path);
      }
    },
    [router]
  );

  const navigateBack = useCallback(() => {
    router.back();
  }, [router]);

  const navigateForward = useCallback(() => {
    router.forward();
  }, [router]);

  const refreshPage = useCallback(() => {
    router.refresh();
  }, [router]);

  const replaceRoute = useCallback(
    (path: string) => {
      router.replace(path);
    },
    [router]
  );

  // Specific navigation functions
  const goToHome = useCallback(() => {
    navigateTo("/");
  }, [navigateTo]);

  const goToDashboard = useCallback(() => {
    navigateTo("/dashboard");
  }, [navigateTo]);

  const goToLogin = useCallback(() => {
    navigateTo("/login");
  }, [navigateTo]);

  const goToRegister = useCallback(() => {
    navigateTo("/register");
  }, [navigateTo]);

  const goToProfile = useCallback(() => {
    navigateTo("/profile");
  }, [navigateTo]);

  const goToUpload = useCallback(() => {
    navigateTo("/upload");
  }, [navigateTo]);

  // Check if user can access a route
  const canAccessRoute = useCallback(
    (requireAuth: boolean = false): boolean => {
      if (!requireAuth) return true;
      return !!user && !loading;
    },
    [user, loading]
  );

  // Get navigation items based on auth state
  const getNavigationItems = useCallback((): NavigationItem[] => {
    const items: NavigationItem[] = [
      {
        label: "Home",
        path: "/",
        requireAuth: false,
      },
    ];

    if (user) {
      items.push(
        {
          label: "Dashboard",
          path: "/dashboard",
          requireAuth: true,
        },
        {
          label: "Upload PDF",
          path: "/upload",
          requireAuth: true,
        }
      );
    } else {
      items.push(
        {
          label: "Sign In",
          path: "/login",
          requireAuth: false,
        },
        {
          label: "Sign Up",
          path: "/register",
          requireAuth: false,
        }
      );
    }

    return items;
  }, [user]);

  // Get filtered navigation items that user can access
  const getAccessibleNavigationItems = useCallback((): NavigationItem[] => {
    return getNavigationItems().filter((item) =>
      canAccessRoute(item.requireAuth)
    );
  }, [getNavigationItems, canAccessRoute]);

  // Check if current route requires authentication
  const isProtectedRoute = useCallback((pathname: string): boolean => {
    const protectedRoutes = ["/dashboard", "/upload", "/profile", "/settings"];
    return protectedRoutes.some((route) => pathname.startsWith(route));
  }, []);

  // Redirect to login if accessing protected route without auth
  const redirectToLoginIfNeeded = useCallback(
    (pathname: string) => {
      if (isProtectedRoute(pathname) && !user && !loading) {
        goToLogin();
        return true;
      }
      return false;
    },
    [isProtectedRoute, user, loading, goToLogin]
  );

  // Get breadcrumb items for current route
  const getBreadcrumbs = useCallback(
    (pathname: string): { label: string; path?: string }[] => {
      const segments = pathname.split("/").filter(Boolean);
      const breadcrumbs: { label: string; path?: string }[] = [
        { label: "Home", path: "/" },
      ];

      let currentPath = "";
      segments.forEach((segment) => {
        currentPath += `/${segment}`;

        const label =
          segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
        breadcrumbs.push({
          label,
          path: currentPath,
        });
      });

      return breadcrumbs;
    },
    []
  );

  return {
    // Basic navigation
    navigateTo,
    navigateBack,
    navigateForward,
    refreshPage,
    replaceRoute,

    // Specific navigation
    goToHome,
    goToDashboard,
    goToLogin,
    goToRegister,
    goToProfile,
    goToUpload,

    // Route checking
    canAccessRoute,
    isProtectedRoute,
    redirectToLoginIfNeeded,

    // Navigation items
    getNavigationItems,
    getAccessibleNavigationItems,
    getBreadcrumbs,

    // Auth state
    user,
    loading,
  };
}
