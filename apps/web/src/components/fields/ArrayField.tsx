"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import Button from "../ui/Button";

interface ArrayFieldProps {
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}

export default function ArrayField({ value, onChange, placeholder }: ArrayFieldProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      {/* List items tag grid */}
      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {value.map((item) => (
            <div
              key={item}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: "var(--bg-active)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "2px 6px 2px 8px",
                fontSize: "0.72rem",
                color: "var(--text-primary)",
              }}
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "2px",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--color-error)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input controls */}
      <div style={{ display: "flex", gap: "6px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Add item..."}
          style={{
            flex: 1,
            backgroundColor: "var(--bg-active)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "6px 10px",
            fontSize: "0.76rem",
            color: "var(--text-primary)",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
        />
        <Button
          type="button"
          onClick={handleAdd}
          size="sm"
          variant="secondary"
          icon={<Plus size={12} />}
          style={{ padding: "0 10px" }}
        />
      </div>
    </div>
  );
}
