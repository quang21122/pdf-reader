"use client";

import React from "react";
import { useHomeRedirect } from "@/hooks";
import { LoadingScreen, LandingPage } from "@/components/home";

export default function Home() {
  const { user, loading, mounted, shouldRedirect } = useHomeRedirect();

  if (!mounted) {
    return <LoadingScreen />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LandingPage />;
  }

  if (shouldRedirect) {
    return <LoadingScreen message="Redirecting to dashboard..." />;
  }

  return null;
}
