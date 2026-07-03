"use client";

import React from "react";

interface TextFieldProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function TextField({ value, onChange, placeholder }: TextFieldProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        backgroundColor: "var(--bg-active)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "8px 12px",
        fontSize: "0.8rem",
        color: "var(--text-primary)",
        outline: "none",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
    />
  );
}
