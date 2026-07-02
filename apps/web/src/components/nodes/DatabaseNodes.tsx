"use client";

import React from "react";
import { Database, Zap, Table } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { CanvasNodeData } from "@canvascloud/shared";
import BaseNode from "../BaseNode";

type CategoryNodeProps = Omit<NodeProps, "data"> & { data: CanvasNodeData };

export function RDSNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const engine = (config.engine as string) || "Not set";
  const size = config.allocated_storage ? `${String(config.allocated_storage)} GB` : "Not set";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Database size={14} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div>Engine: <strong style={{ color: "var(--text-color)", textTransform: "capitalize" }}>{engine}</strong></div>
        <div>Size: <span style={{ fontFamily: "monospace" }}>{size}</span></div>
      </div>
    </BaseNode>
  );
}

export function ElastiCacheNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const engine = (config.engine as string) || "redis";
  const nodeType = (config.node_type as string) || "Not set";

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
        <div>Engine: <strong style={{ color: "var(--text-color)", textTransform: "capitalize" }}>{engine}</strong></div>
        <div>Class: <span style={{ fontFamily: "monospace" }}>{nodeType}</span></div>
      </div>
    </BaseNode>
  );
}

export function DynamoDBNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const hashKey = (config.hash_key as string) || "Not set";
  const billingMode = (config.billing_mode as string) || "PAY_PER_REQUEST";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Table size={14} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div>HashKey: <strong style={{ color: "var(--text-color)" }}>{hashKey}</strong></div>
        <div>Billing: <span style={{ fontSize: "10px" }}>{billingMode}</span></div>
      </div>
    </BaseNode>
  );
}
