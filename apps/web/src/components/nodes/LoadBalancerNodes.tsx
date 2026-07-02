"use client";

import React from "react";
import { RefreshCw, Target } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { CanvasNodeData } from "@canvascloud/shared";
import BaseNode from "../BaseNode";

type CategoryNodeProps = Omit<NodeProps, "data"> & { data: CanvasNodeData };

export function ALBNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const ipType = (config.ip_address_type as string) || "ipv4";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<RefreshCw size={14} />}
    >
      <div>IP Type: <strong style={{ color: "var(--text-color)", textTransform: "uppercase" }}>{ipType}</strong></div>
    </BaseNode>
  );
}

export function TargetGroupNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const port = config.port !== undefined ? String(config.port) : "Not set";
  const protocol = (config.protocol as string) || "Not set";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Target size={14} />}
    >
      <div>Route: <strong style={{ color: "var(--text-color)" }}>{protocol}:{port}</strong></div>
    </BaseNode>
  );
}
