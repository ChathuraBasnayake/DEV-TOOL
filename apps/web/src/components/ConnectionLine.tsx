"use client";

import React from "react";
import { ConnectionLineComponentProps, getBezierPath } from "@xyflow/react";

/**
 * Custom Connection Line rendering a marching-ants style dashed curve
 * during node-to-node link interaction.
 */
export default function ConnectionLine({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
}: ConnectionLineComponentProps) {
  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="var(--primary-accent)"
        strokeWidth={1.5}
        className="connection-path-drawing"
        style={{
          strokeDasharray: "5, 5",
        }}
        d={edgePath}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="var(--bg-card)"
        r={3}
        stroke="var(--primary-accent)"
        strokeWidth={1.5}
      />
    </g>
  );
}
