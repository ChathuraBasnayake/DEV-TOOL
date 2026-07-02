"use client";

import React from "react";
import { Background, BackgroundVariant } from "@xyflow/react";

/**
 * Sleek Dot-Grid Backdrop themed to coordinate with Light and Dark system variables.
 */
export default function CanvasBackground() {
  return (
    <Background
      variant={BackgroundVariant.Dots}
      gap={16}
      size={1}
      color="var(--border-color)"
      style={{ opacity: 0.6 }}
    />
  );
}
