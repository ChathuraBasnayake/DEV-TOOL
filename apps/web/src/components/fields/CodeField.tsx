"use client";

import React from "react";

interface CodeFieldProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function CodeField({ value, onChange, placeholder }: CodeFieldProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={6}
      style={{
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "10px",
        fontSize: "0.76rem",
        color: "var(--text-primary)",
        fontFamily: "var(--font-geist-mono), monospace",
        outline: "none",
        resize: "vertical",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
    />
  );
}
