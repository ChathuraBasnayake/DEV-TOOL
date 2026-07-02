"use client";

import React from "react";
import { Archive } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { CanvasNodeData } from "@canvascloud/shared";
import BaseNode from "../BaseNode";

type CategoryNodeProps = Omit<NodeProps, "data"> & { data: CanvasNodeData };

export function S3Node({ id, selected, data }: CategoryNodeProps) {
  const config = (data.config || {}) as Record<string, unknown>;
  const bucketName = (config.bucket as string) || "Not set";

  return (
    <BaseNode
      id={id}
      selected={selected}
      label={data.label}
      resourceType={data.resourceType}
      status={data.status}
      icon={<Archive size={14} />}
    >
      <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={bucketName}>
        Bucket: <strong style={{ color: "var(--text-color)" }}>{bucketName}</strong>
      </div>
    </BaseNode>
  );
}
