"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { CheckCircle2, HelpCircle, AlertTriangle, XCircle } from "lucide-react";

export interface HandleConfig {
  id?: string;
  position: Position;
  style?: React.CSSProperties;
}

export interface BaseNodeProps {
  id: string;
  selected?: boolean;
  resourceType: string;
  status: string;
  label: string;
  icon: React.ReactNode;
  inputHandles?: HandleConfig[];
  outputHandles?: HandleConfig[];
  children?: React.ReactNode;
}

/**
 * Standard status badge selector mapping Lucide icons and colors.
 */
function NodeStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "configured":
      return (
        <span className="status-badge status-configured" title="Configured" style={{ color: "var(--color-success)" }}>
          <CheckCircle2 size={13} />
        </span>
      );
    case "warning":
      return (
        <span className="status-badge status-warning" title="Warning" style={{ color: "var(--color-warning)" }}>
          <AlertTriangle size={13} />
        </span>
      );
    case "error":
      return (
        <span className="status-badge status-error" title="Error" style={{ color: "var(--color-error)" }}>
          <XCircle size={13} />
        </span>
      );
    case "unconfigured":
    default:
      return (
        <span className="status-badge status-unconfigured" title="Unconfigured" style={{ color: "var(--text-muted)" }}>
          <HelpCircle size={13} />
        </span>
      );
  }
}

/**
 * Reusable BaseNode component wraps default card visuals, handles layout swaps,
 * imports theme classes, and exposes dynamic children slots.
 */
export default function BaseNode({
  selected,
  resourceType,
  status,
  label,
  icon,
  inputHandles,
  outputHandles,
  children,
}: BaseNodeProps) {
  // Default to a single Left input handle if not overridden
  const finalInputHandles = inputHandles || [
    { id: "in", position: Position.Left },
  ];

  // Default to a single Right output handle if not overridden
  const finalOutputHandles = outputHandles || [
    { id: "out", position: Position.Right },
  ];

  return (
    <div
      className={`aws-node category-${resourceType} status-${status} ${
        selected ? "selected" : ""
      }`}
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: "180px",
        borderRadius: "8px",
        border: "1.5px solid var(--border-color)",
        background: "var(--bg-card)",
        color: "var(--text-color)",
        boxShadow: selected ? "0 0 0 2px var(--primary-accent)" : "var(--shadow-sm)",
        transition: "box-shadow 0.2s, border-color 0.2s, background-color 0.2s",
        padding: "10px 12px",
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Target/Input Handles */}
      {finalInputHandles.map((h, i) => (
        <Handle
          key={`in-${h.id || i}`}
          type="target"
          position={h.position}
          id={h.id || `in-${i}`}
          style={{
            background: "var(--primary-accent)",
            width: "7px",
            height: "7px",
            border: "1.5px solid var(--bg-card)",
            ...h.style,
          }}
        />
      ))}

      {/* Node Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary-accent)",
            }}
          >
            {icon}
          </span>
          <span
            style={{
              fontSize: "9px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-muted)",
            }}
          >
            {resourceType}
          </span>
        </div>
        <NodeStatusBadge status={status} />
      </div>

      {/* Node Label (Title) */}
      <div
        style={{
          fontWeight: "600",
          fontSize: "12px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: "var(--text-color)",
        }}
      >
        {label}
      </div>

      {/* Custom Body Details (e.g. subnet CIDR preview, instance type) */}
      {children && (
        <div
          style={{
            marginTop: "6px",
            fontSize: "10px",
            color: "var(--text-muted)",
            borderTop: "1px dashed var(--border-color)",
            paddingTop: "6px",
          }}
        >
          {children}
        </div>
      )}

      {/* Source/Output Handles */}
      {finalOutputHandles.map((h, i) => (
        <Handle
          key={`out-${h.id || i}`}
          type="source"
          position={h.position}
          id={h.id || `out-${i}`}
          style={{
            background: "var(--primary-accent)",
            width: "7px",
            height: "7px",
            border: "1.5px solid var(--bg-card)",
            ...h.style,
          }}
        />
      ))}
    </div>
  );
}
