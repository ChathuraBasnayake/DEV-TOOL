"use client";

import React, { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import Button from "../ui/Button";

interface KeyValueFieldProps {
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
}

export default function KeyValueField({ value, onChange }: KeyValueFieldProps) {
  const entries = useMemo(() => Object.entries(value), [value]);

  const handleUpdateKey = (oldKey: string, newKey: string) => {
    if (newKey === oldKey) return;
    const copy = { ...value };
    const val = copy[oldKey];
    delete copy[oldKey];
    if (newKey) {
      copy[newKey] = val || "";
    }
    onChange(copy);
  };

  const handleUpdateValue = (key: string, val: string) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const handleDeleteRow = (key: string) => {
    const copy = { ...value };
    delete copy[key];
    onChange(copy);
  };

  const handleAddRow = () => {
    // Generate a unique placeholder key name
    let index = 1;
    let newKey = `key_${index}`;
    while (newKey in value) {
      index++;
      newKey = `key_${index}`;
    }
    onChange({
      ...value,
      [newKey]: "",
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      {entries.map(([key, val]) => (
        <div key={key} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <input
            type="text"
            value={key}
            placeholder="Key"
            onChange={(e) => handleUpdateKey(key, e.target.value)}
            style={{
              flex: 1,
              backgroundColor: "var(--bg-active)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "6px 10px",
              fontSize: "0.76rem",
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
          <input
            type="text"
            value={val}
            placeholder="Value"
            onChange={(e) => handleUpdateValue(key, e.target.value)}
            style={{
              flex: 1,
              backgroundColor: "var(--bg-active)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "6px 10px",
              fontSize: "0.76rem",
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => handleDeleteRow(key)}
            style={{
              background: "none",
              border: "none",
              padding: "6px",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "var(--color-error)")}
            onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}

      <Button
        type="button"
        onClick={handleAddRow}
        size="sm"
        variant="secondary"
        icon={<Plus size={12} />}
        style={{ width: "fit-content", padding: "6px 12px" }}
      >
        Add Tag / Pair
      </Button>
    </div>
  );
}
