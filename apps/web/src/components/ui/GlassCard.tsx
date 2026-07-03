"use client";

import React from "react";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

export default function GlassCard({
  children,
  style,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
      className={`glass-panel ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
