"use client";

import React from "react";
import { UserCheck, FileText } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { CanvasNodeData } from "@canvascloud/shared";
import BaseNode from "../BaseNode";

type CategoryNodeProps = Omit<NodeProps, "data"> & { data: CanvasNodeData };

export function IAMRoleNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const roleName = (config.name as string) || "Not set";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<UserCheck size={14} />}
    >
      <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={roleName}>
        Role: <strong style={{ color: "var(--text-color)" }}>{roleName}</strong>
      </div>
    </BaseNode>
  );
}

export function IAMPolicyNode({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const policyName = (config.name as string) || "Not set";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<FileText size={14} />}
    >
      <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={policyName}>
        Policy: <strong style={{ color: "var(--text-color)" }}>{policyName}</strong>
      </div>
    </BaseNode>
  );
}
