"use client";

import React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export default function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
}: TooltipProps) {
  // If no content is defined, return children directly
  if (!content) return children;

  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={6}
          style={{
            zIndex: 1000,
            backgroundColor: "var(--bg-panel-solid)",
            border: "1px solid var(--border-color)",
            padding: "6px 10px",
            borderRadius: "var(--radius-md)",
            fontSize: "0.72rem",
            color: "var(--text-primary)",
            boxShadow: "var(--shadow-md)",
            maxWidth: "240px",
            wordBreak: "break-word",
            animation: "modalScaleUp 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="ui-tooltip-content"
        >
          {content}
          <RadixTooltip.Arrow style={{ fill: "var(--border-color)" }} />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
