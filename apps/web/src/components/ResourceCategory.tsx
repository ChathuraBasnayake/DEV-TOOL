"use client";

import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ResourceCategoryProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function ResourceCategory({
  name,
  icon,
  isExpanded,
  onToggle,
  children,
}: ResourceCategoryProps) {
  return (
    <div
      style={{
        marginBottom: "8px",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-card)",
      }}
    >
      {/* Category Accordion Header */}
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px 12px",
          cursor: "pointer",
          backgroundColor: "var(--bg-panel)",
          borderBottom: isExpanded ? "1px solid var(--border-color)" : "none",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-active)")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-panel)")}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-primary)",
          }}
        >
          <span style={{ color: "var(--accent-color)" }}>{icon}</span>
          <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{name}</span>
        </div>
        <div style={{ color: "var(--text-muted)" }}>
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </button>

      {/* Accordion Expandable Children Section */}
      {isExpanded && (
        <div
          style={{
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
