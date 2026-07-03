"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchFilter({ value, onChange }: SearchFilterProps) {
  return (
    <div style={{ padding: "12px 16px", position: "relative" }}>
      <div style={{ position: "relative", width: "100%" }}>
        <Search
          size={14}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Search resource..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            backgroundColor: "var(--bg-active)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "8px 12px 8px 34px",
            fontSize: "0.8rem",
            color: "var(--text-primary)",
            transition: "border-color 0.2s",
          }}
          className="palette-search-input"
        />
      </div>
    </div>
  );
}
