"use client";

import React from "react";
import { Zap, ExternalLink } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { CanvasNodeData } from "@canvascloud/shared";
import BaseNode from "../BaseNode";

type CategoryNodeProps = Omit<NodeProps, "data"> & { data: CanvasNodeData };

export function LambdaNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const runtime = (config.runtime as string) || "Not set";
  const functionName = (config.function_name as string) || "Not set";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Zap size={14} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={functionName}>
          Name: <strong style={{ color: "var(--text-color)" }}>{functionName}</strong>
        </div>
        <div>Runtime: <span style={{ fontFamily: "monospace" }}>{runtime}</span></div>
      </div>
    </BaseNode>
  );
}

export function APIGatewayNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const protocol = (config.protocol_type as string) || "HTTP";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<ExternalLink size={14} />}
    >
      <div>Protocol: <strong style={{ color: "var(--text-color)" }}>{protocol}</strong></div>
    </BaseNode>
  );
}
