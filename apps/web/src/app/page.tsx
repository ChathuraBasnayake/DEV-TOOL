"use client";

import React from "react";
import TopBar from "../components/TopBar";
import CanvasWorkspace from "../components/CanvasWorkspace";

/**
 * Main application entrypoint rendering the top navigation bar and
 * interactive designer canvas workspace.
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar />
      <div style={{ flex: 1, position: "relative" }}>
        <CanvasWorkspace />
      </div>
    </main>
  );
}
