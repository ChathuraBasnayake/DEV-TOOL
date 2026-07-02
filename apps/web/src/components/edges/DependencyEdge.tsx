"use client";

import React from "react";
import { BaseEdge, EdgeProps, getBezierPath, EdgeLabelRenderer } from "@xyflow/react";

/**
 * Custom Dependency Edge Component with animated marching ants and HTML-portaled labels.
 */
export default function DependencyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const relationship = data?.relationship as string;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        className={`edge-animated ${selected ? "selected" : ""}`}
        style={{
          stroke: selected ? "var(--accent-color)" : "var(--border-color)",
          strokeWidth: selected ? 2.5 : 1.5,
          transition: "stroke 0.2s, stroke-width 0.2s",
        }}
      />
      {relationship && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "9px",
              fontWeight: 600,
              color: "var(--text-muted)",
              pointerEvents: "all",
              boxShadow: "var(--shadow-sm)",
              userSelect: "none",
            }}
          >
            {relationship}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
