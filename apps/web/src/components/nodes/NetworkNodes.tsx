"use client";

import React from "react";
import { Network, Grid, Globe, Cpu, Map, Hash } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { CanvasNodeData } from "@canvascloud/shared";
import BaseNode from "../BaseNode";

type CategoryNodeProps = Omit<NodeProps, "data"> & { data: CanvasNodeData };

export function VPCNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const cidr = (config.cidr_block as string) || "Not set";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Network size={14} />}
    >
      <div>CIDR: <strong style={{ color: "var(--text-color)", fontFamily: "monospace" }}>{cidr}</strong></div>
    </BaseNode>
  );
}

export function SubnetNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const cidr = (config.cidr_block as string) || "Not set";
  const publicSubnet = config.map_public_ip_on_launch ? "Public" : "Private";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Grid size={14} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div>CIDR: <strong style={{ color: "var(--text-color)", fontFamily: "monospace" }}>{cidr}</strong></div>
        <div>Scope: <span style={{ color: publicSubnet === "Public" ? "var(--color-success)" : "var(--text-muted)" }}>{publicSubnet}</span></div>
      </div>
    </BaseNode>
  );
}

export function IGWNode({ id, selected, data }: CategoryNodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Globe size={14} />}
    >
      <div style={{ fontStyle: "italic" }}>Attached to VPC</div>
    </BaseNode>
  );
}

export function NATGatewayNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const connectivityType = (config.connectivity_type as string) || "public";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Cpu size={14} />}
    >
      <div>Type: <strong style={{ color: "var(--text-color)", textTransform: "capitalize" }}>{connectivityType}</strong></div>
    </BaseNode>
  );
}

export function RouteTableNode({ id, selected, data }: CategoryNodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Map size={14} />}
    >
      <div style={{ fontStyle: "italic" }}>Gateway Router</div>
    </BaseNode>
  );
}

export function EIPNode({ id, selected, data }: CategoryNodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Hash size={14} />}
    >
      <div style={{ fontStyle: "italic" }}>Elastic IP Alloc</div>
    </BaseNode>
  );
}
