"use client";

import React, { useState } from "react";
import { Edit2 } from "lucide-react";

interface ProjectNameProps {
  value: string;
  onChange: (val: string) => void;
}

export default function ProjectName({ value, onChange }: ProjectNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Sync internal state when project name is loaded/changed externally during render phase
  if (value !== prevValue) {
    setPrevValue(value);
    setInput(value);
  }

  const handleCommit = () => {
    setIsEditing(false);
    const trimmed = input.trim();
    if (trimmed) {
      onChange(trimmed);
    } else {
      setInput(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setInput(value);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        autoFocus
        style={{
          backgroundColor: "var(--bg-active)",
          border: "1px solid var(--accent-color)",
          borderRadius: "var(--radius-sm)",
          padding: "4px 8px",
          fontSize: "0.88rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          outline: "none",
          width: "180px",
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: "var(--radius-sm)",
        transition: "background-color 0.2s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-active)")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      title="Click to rename project"
    >
      <h1
        style={{
          fontSize: "0.88rem",
          fontWeight: 800,
          color: "var(--text-primary)",
          letterSpacing: "0.01em",
        }}
      >
        {value}
      </h1>
      <Edit2 size={12} style={{ color: "var(--text-muted)", opacity: 0.6 }} />
    </div>
  );
}
