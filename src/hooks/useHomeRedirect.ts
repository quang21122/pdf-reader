import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * Custom hook for handling home page redirect logic
 * Manages mounting state and redirects authenticated users to dashboard
 */
export const useHomeRedirect = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    console.log("Home useEffect triggered:", {
      user: !!user,
      loading,
      mounted,
      pathname:
        typeof window !== "undefined" ? window.location.pathname : "SSR",
    });

    if (!loading && user && mounted) {
      console.log("User is already logged in, redirecting to dashboard...");

      // Only redirect if we're actually on home page
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        router.push("/dashboard");

        // Backup redirect using window.location
        setTimeout(() => {
          if (window.location.pathname === "/") {
            console.log("Router.push failed, using window.location");
            window.location.href = "/dashboard";
          }
        }, 1000);
      }
    }
  }, [user, loading, router, mounted]);

  return {
    user,
    loading,
    mounted,
    isAuthenticated: !!user,
    shouldRedirect: !loading && user && mounted,
  };
};
