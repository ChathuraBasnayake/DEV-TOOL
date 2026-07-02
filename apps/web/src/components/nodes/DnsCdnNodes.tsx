"use client";

import React from "react";
import { Compass, Radio } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { CanvasNodeData } from "@canvascloud/shared";
import BaseNode from "../BaseNode";

type CategoryNodeProps = Omit<NodeProps, "data"> & { data: CanvasNodeData };

export function Route53Node({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const domainName = (config.name as string) || "Not set";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Compass size={14} />}
    >
      <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={domainName}>
        Domain: <strong style={{ color: "var(--text-color)" }}>{domainName}</strong>
      </div>
    </BaseNode>
  );
}

export function CloudFrontNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const enabledStatus = config.enabled !== false ? "Enabled" : "Disabled";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Radio size={14} />}
    >
      <div>Status: <strong style={{ color: "var(--text-color)" }}>{enabledStatus}</strong></div>
    </BaseNode>
  );
}
