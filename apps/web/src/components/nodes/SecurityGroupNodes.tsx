"use client";

import React from "react";
import { Shield } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { CanvasNodeData } from "@canvascloud/shared";
import BaseNode from "../BaseNode";

type CategoryNodeProps = Omit<NodeProps, "data"> & { data: CanvasNodeData };

export function SecurityGroupNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const description = (config.description as string) || "Firewall rule scope";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Shield size={14} />}
    >
      <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={description}>
        {description}
      </div>
    </BaseNode>
  );
}
