"use client";

import React, { useMemo } from "react";
import type { AWSResourceType } from "@canvascloud/shared";
import { useCanvasNodes } from "../../store/canvasStore";

interface ReferenceFieldProps {
  value: string;
  onChange: (val: string) => void;
  referenceType?: AWSResourceType;
  placeholder?: string;
}

export default function ReferenceField({
  value,
  onChange,
  referenceType,
  placeholder,
}: ReferenceFieldProps) {
  const nodes = useCanvasNodes();

  // Filter canvas nodes matching the expected resource type
  const matchingNodes = useMemo(() => {
    if (!referenceType) return [];
    return nodes.filter((node) => node.data.resourceType === referenceType);
  }, [nodes, referenceType]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          backgroundColor: "var(--bg-active)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "8px 30px 8px 12px",
          fontSize: "0.8rem",
          color: "var(--text-primary)",
          outline: "none",
          cursor: "pointer",
          appearance: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
      >
        <option value="">{placeholder || `Select ${referenceType || "resource"}...`}</option>
        {matchingNodes.map((node) => (
          <option
            key={node.id}
            value={node.data.label}
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            {node.data.label}
          </option>
        ))}
      </select>
      <div
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "var(--text-muted)",
          fontSize: "0.6rem",
        }}
      >
        ▼
      </div>
    </div>
  );
}
