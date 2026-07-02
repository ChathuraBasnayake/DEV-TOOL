"use client";

import React from "react";
import { useReactFlow } from "@xyflow/react";
import { ZoomIn, ZoomOut, Maximize, Trash2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useCanvasStore } from "../store/canvasStore";

/**
 * Premium Floating Controls Panel overlays on the bottom left corner.
 * Integrates zoom actions, viewport overrides, selection deletion, and clean utilities.
 */
export default function CanvasControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const selectedNodeId = useCanvasStore((state) => state.selectedNodeId);
  const deleteNode = useCanvasStore((state) => state.deleteNode);
  const setNodes = useCanvasStore((state) => state.setNodes);
  const setEdges = useCanvasStore((state) => state.setEdges);
  const setSelectedNodeId = useCanvasStore((state) => state.setSelectedNodeId);

  // Clear all nodes and edges with validation
  const handleClear = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the entire workspace? This action cannot be undone."
      )
    ) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      toast.success("Workspace cleared");
    }
  };

  // Delete currently focused node
  const handleDeleteSelected = () => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
    }
  };

  return (
    <div
      className="canvas-controls-floating glass-panel"
      style={{
        display: "flex",
        gap: "6px",
        padding: "6px",
        borderRadius: "8px",
        border: "1px solid var(--border-color)",
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        alignItems: "center",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <button
        onClick={() => zoomIn()}
        className="control-btn"
        title="Zoom In"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          border: "none",
          background: "transparent",
          color: "var(--text-color)",
          cursor: "pointer",
          borderRadius: "4px",
          transition: "background 0.2s",
        }}
      >
        <ZoomIn size={15} />
      </button>

      <button
        onClick={() => zoomOut()}
        className="control-btn"
        title="Zoom Out"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          border: "none",
          background: "transparent",
          color: "var(--text-color)",
          cursor: "pointer",
          borderRadius: "4px",
          transition: "background 0.2s",
        }}
      >
        <ZoomOut size={15} />
      </button>

      <button
        onClick={() => fitView({ duration: 400 })}
        className="control-btn"
        title="Fit Canvas View"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          border: "none",
          background: "transparent",
          color: "var(--text-color)",
          cursor: "pointer",
          borderRadius: "4px",
          transition: "background 0.2s",
        }}
      >
        <Maximize size={15} />
      </button>

      <span
        style={{
          width: "1px",
          height: "16px",
          background: "var(--border-color)",
          margin: "0 2px",
        }}
      />

      <button
        onClick={handleDeleteSelected}
        disabled={!selectedNodeId}
        className={`control-btn ${selectedNodeId ? "active" : ""}`}
        title="Delete Selected Resource"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          border: "none",
          background: "transparent",
          color: selectedNodeId ? "var(--text-color)" : "var(--text-muted)",
          cursor: selectedNodeId ? "pointer" : "not-allowed",
          borderRadius: "4px",
          opacity: selectedNodeId ? 1 : 0.4,
          transition: "background 0.2s, color 0.2s",
        }}
      >
        <Trash2 size={15} />
      </button>

      <button
        onClick={handleClear}
        className="control-btn"
        title="Reset Canvas Workspace"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          border: "none",
          background: "transparent",
          color: "var(--text-color)",
          cursor: "pointer",
          borderRadius: "4px",
          transition: "background 0.2s",
        }}
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );
}
