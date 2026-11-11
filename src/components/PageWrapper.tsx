"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only show loading screen on first visit (per session)
    const alreadySeen = sessionStorage.getItem("lsShown");
    if (alreadySeen) {
      setLoading(false);
    }
    setMounted(true);
  }, []);

  const handleDone = () => {
    sessionStorage.setItem("lsShown", "1");
    setLoading(false);
  };

  // Avoid SSR mismatch — render nothing until hydrated
  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-background z-[9999]" aria-hidden="true" />
    );
  }

  return (
    <>
      {loading && <LoadingScreen onDone={handleDone} />}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: "opacity 0.5s ease 0.2s",
        }}
      >
        {children}
      </div>
    </>
  );
}

