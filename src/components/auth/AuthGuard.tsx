"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  fallback,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login without return URL
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      fallback || (
        <Box className="min-h-screen flex items-center justify-center bg-gray-50">
          <Box className="text-center">
            <CircularProgress size={60} className="mb-4" />
            <Typography variant="h6" className="text-gray-600">
              Đang kiểm tra đăng nhập...
            </Typography>
          </Box>
        </Box>
      )
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  // User is authenticated, show protected content
  return <>{children}</>;
}

// Higher-order component version
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode;
    redirectTo?: string;
  }
) {
  const AuthGuardedComponent = (props: P) => {
    return (
      <AuthGuard fallback={options?.fallback} redirectTo={options?.redirectTo}>
        <Component {...props} />
      </AuthGuard>
    );
  };

  AuthGuardedComponent.displayName = `withAuthGuard(${
    Component.displayName || Component.name
  })`;

  return AuthGuardedComponent;
}
