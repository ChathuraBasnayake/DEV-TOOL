"use client";

import React from "react";
import CanvasWorkspace from "../components/CanvasWorkspace";

/**
 * Main application entrypoint rendering the interactive designer canvas workspace fullscreen.
 */
export default function Home() {
  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "var(--bg-app)",
      }}
    >
      <CanvasWorkspace />
    </main>
  );
}
