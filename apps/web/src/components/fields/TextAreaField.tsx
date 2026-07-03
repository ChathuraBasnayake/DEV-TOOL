"use client";

import React from "react";

interface TextAreaFieldProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function TextAreaField({ value, onChange, placeholder }: TextAreaFieldProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      style={{
        width: "100%",
        backgroundColor: "var(--bg-active)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "8px 12px",
        fontSize: "0.8rem",
        color: "var(--text-primary)",
        outline: "none",
        resize: "vertical",
        transition: "border-color 0.2s",
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
    />
  );
}
