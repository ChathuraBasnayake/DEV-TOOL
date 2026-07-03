"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
}

export default function Badge({
  children,
  variant = "neutral",
  style,
  className = "",
  ...props
}: BadgeProps) {
  // Map variant strings to color tokens
  const variantStyles: Record<string, React.CSSProperties> = {
    success: {
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      border: "1px solid var(--state-success-border)",
      color: "var(--color-success)",
    },
    warning: {
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      border: "1px solid var(--state-warn-border)",
      color: "var(--color-warn)",
    },
    error: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      border: "1px solid var(--state-error-border)",
      color: "var(--color-error)",
    },
    info: {
      backgroundColor: "rgba(14, 165, 233, 0.1)",
      border: "1px solid var(--state-info-border)",
      color: "var(--color-info)",
    },
    neutral: {
      backgroundColor: "var(--bg-active)",
      border: "1px solid var(--border-color)",
      color: "var(--text-secondary)",
    },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "var(--radius-sm)",
        padding: "2px 6px",
        fontSize: "0.68rem",
        fontWeight: 700,
        lineHeight: 1,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        ...variantStyles[variant],
        ...style,
      }}
      className={`ui-badge badge-${variant} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
