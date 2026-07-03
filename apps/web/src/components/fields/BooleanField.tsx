"use client";

import React from "react";
import * as Switch from "@radix-ui/react-switch";

interface BooleanFieldProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

export default function BooleanField({ value, onChange }: BooleanFieldProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "4px 0" }}>
      <Switch.Root
        checked={value}
        onCheckedChange={onChange}
        style={{
          width: "40px",
          height: "22px",
          backgroundColor: value ? "var(--accent-color)" : "var(--border-color)",
          borderRadius: "9999px",
          position: "relative",
          cursor: "pointer",
          outline: "none",
          border: "none",
          transition: "background-color 0.2s",
        }}
        className="ui-switch-root"
      >
        <Switch.Thumb
          style={{
            display: "block",
            width: "16px",
            height: "16px",
            backgroundColor: "#ffffff",
            borderRadius: "9999px",
            transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: value ? "translateX(20px)" : "translateX(4px)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
          }}
          className="ui-switch-thumb"
        />
      </Switch.Root>
    </div>
  );
}
