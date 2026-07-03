"use client";

import React from "react";
import type { AWSResourceType } from "@canvascloud/shared";

interface ResourceItemProps {
  type: AWSResourceType;
  name: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  onDragStart: (event: React.DragEvent, type: AWSResourceType) => void;
}

export default function ResourceItem({
  type,
  name,
  description,
  icon,
  colorClass,
  onDragStart,
}: ResourceItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "8px 10px",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-card)",
        cursor: "grab",
        userSelect: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onDragOver={(e) => e.preventDefault()}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "var(--border-hover)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "var(--border-color)";
        e.currentTarget.style.boxShadow = "none";
      }}
      className={`palette-item-card ${colorClass}`}
    >
      <div
        style={{
          marginTop: "3px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-color)",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            marginTop: "1px",
            lineHeight: "1.2",
            whiteSpace: "normal",
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}
