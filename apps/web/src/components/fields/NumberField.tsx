"use client";

import React from "react";

interface NumberFieldProps {
  value: number | undefined;
  onChange: (val: number | undefined) => void;
  placeholder?: string;
}

export default function NumberField({ value, onChange, placeholder }: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      onChange(undefined);
    } else {
      onChange(Number(val));
    }
  };

  return (
    <input
      type="number"
      value={value === undefined ? "" : value}
      onChange={handleChange}
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
