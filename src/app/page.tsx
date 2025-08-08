"use client";

import React from "react";
import { useHomeRedirect } from "@/hooks";
import { LoadingScreen, LandingPage } from "@/components/home";

export default function Home() {
  const { user, loading, mounted, shouldRedirect } = useHomeRedirect();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <LoadingScreen />;
  }

  // Show loading while auth is being checked
  if (loading) {
    return <LoadingScreen />;
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage />;
  }

  // Show loading while redirecting authenticated users
  if (shouldRedirect) {
    return <LoadingScreen message="Redirecting to dashboard..." />;
  }

  // This should never be reached, but just in case
  return null;
}
