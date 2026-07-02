"use client";

import React from "react";
import { Server, Layers, FileCode } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { CanvasNodeData } from "@canvascloud/shared";
import BaseNode from "../BaseNode";

type CategoryNodeProps = Omit<NodeProps, "data"> & { data: CanvasNodeData };

export function EC2Node({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const instanceType = (config.instance_type as string) || "Not set";
  const ami = (config.ami as string) || "Not set";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Server size={14} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div>Type: <strong style={{ color: "var(--text-color)" }}>{instanceType}</strong></div>
        <div>AMI: <span style={{ fontFamily: "monospace" }}>{ami}</span></div>
      </div>
    </BaseNode>
  );
}

export function ASGNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const minSize = config.min_size !== undefined ? String(config.min_size) : "?";
  const maxSize = config.max_size !== undefined ? String(config.max_size) : "?";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Layers size={14} />}
    >
      <div>Min / Max Size: <strong style={{ color: "var(--text-color)" }}>{minSize} / {maxSize}</strong></div>
    </BaseNode>
  );
}

export function LaunchTemplateNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const templateName = (config.name as string) || "Not set";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<FileCode size={14} />}
    >
      <div>Template: <strong style={{ color: "var(--text-color)" }}>{templateName}</strong></div>
    </BaseNode>
  );
}
