"use client";

import React from "react";
import type { SelectOption } from "../../types/schema";

interface SelectFieldProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export default function SelectField({ value, onChange, options, placeholder }: SelectFieldProps) {
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
        {placeholder && (
          <option value="" disabled={value !== ""}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: "var(--bg-card)" }}>
            {opt.label}
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
