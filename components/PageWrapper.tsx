"use client";

import type { CSSProperties } from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Pure CSS page entrance animation — no useState/useEffect,
 * content is always visible even if React fails to hydrate.
 */
export default function PageWrapper({ children, className = "", style }: PageWrapperProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
