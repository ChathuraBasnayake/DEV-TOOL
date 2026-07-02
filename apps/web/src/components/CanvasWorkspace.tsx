"use client";

import React, { useRef, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  NodeProps,
  EdgeProps,
  Handle,
  Position,
  BaseEdge,
  getBezierPath,
  Node,
  Edge,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCanvasStore } from "../store/canvasStore";
import type { AWSResourceType } from "@canvascloud/shared";
import CanvasBackground from "./CanvasBackground";
import ConnectionLine from "./ConnectionLine";
import CanvasControls from "./CanvasControls";

/**
 * Temporary Placeholder Node styled inline with theme rules 
 * for visual feedback during the workspace core assembly.
 */
function PlaceholderAWSNode({ data, selected }: NodeProps) {
  const resourceType = data.resourceType as AWSResourceType;
  const status = data.status as string;
  const label = data.label as string;

  return (
    <div
      className={`aws-node category-${resourceType} status-${status} ${
        selected ? "selected" : ""
      }`}
      style={{
        padding: "10px 14px",
        borderRadius: "8px",
        border: "2px solid var(--border-color)",
        background: "var(--bg-card)",
        color: "var(--text-color)",
        minWidth: "160px",
        boxShadow: selected ? "0 0 0 2px var(--primary-accent)" : "none",
        position: "relative",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "var(--primary-accent)" }}
      />
      <div style={{ fontSize: "10px", textTransform: "uppercase", opacity: 0.6 }}>
        {resourceType}
      </div>
      <div style={{ fontWeight: "bold", fontSize: "12px", marginTop: "2px" }}>
        {label}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "var(--primary-accent)" }}
      />
    </div>
  );
}

/**
 * Custom Dependency Edge rendering inline animated marching ants along the connection.
 */
function PlaceholderDependencyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} className="canvas-edge animated" />
      {data?.relationship && (
        <g>
          <rect
            x={labelX - 35}
            y={labelY - 10}
            width={70}
            height={20}
            rx={4}
            fill="var(--bg-card)"
            stroke="var(--border-color)"
            strokeWidth={1}
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontSize: "9px",
              fontWeight: "600",
              fill: "var(--text-muted)",
              pointerEvents: "none",
            }}
          >
            {data.relationship as string}
          </text>
        </g>
      )}
    </>
  );
}

// Registry linking custom node/edge strings to components
const nodeTypes = {
  awsNode: PlaceholderAWSNode,
};

const edgeTypes = {
  dependency: PlaceholderDependencyEdge,
};

/**
 * Inner component utilizing useReactFlow context helpers.
 */
function CanvasFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  // Zustand Store bindings
  const nodes = useCanvasStore((state) => state.nodes);
  const edges = useCanvasStore((state) => state.edges);
  const onNodesChange = useCanvasStore((state) => state.onNodesChange);
  const onEdgesChange = useCanvasStore((state) => state.onEdgesChange);
  const onConnect = useCanvasStore((state) => state.onConnect);
  const addNode = useCanvasStore((state) => state.addNode);
  const setSelectedNodeId = useCanvasStore((state) => state.setSelectedNodeId);
  const setViewport = useCanvasStore((state) => state.setViewport);

  // Sync pan/zoom parameters with store
  const onMoveEnd = useCallback(
    (_event: unknown, viewport: { x: number; y: number; zoom: number }) => {
      setViewport(viewport);
    },
    [setViewport]
  );

  // Handle resource items dragged over pane
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle dropped resource nodes
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const typeStr = event.dataTransfer.getData("application/reactflow");
      if (!typeStr) return;

      const resourceType = typeStr as AWSResourceType;

      // Translate drop coordinates into graph canvas workspace coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(resourceType, position);
    },
    [screenToFlowPosition, addNode]
  );

  // Node focus select handler
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: { id: string }) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  // Click handler to clear property select overlays
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: "100%", height: "100%" }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes as unknown as Node[]}
        edges={edges as unknown as Edge[]}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onMoveEnd={onMoveEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={ConnectionLine}
        fitView
      >
        <CanvasBackground />
        <Panel position="bottom-left" style={{ margin: "16px" }}>
          <CanvasControls />
        </Panel>
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.selected) return "var(--primary-accent)";
            return "var(--border-color)";
          }}
          nodeColor={() => "var(--bg-card)"}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
        />
      </ReactFlow>
    </div>
  );
}

/**
 * Root workspace wrapper mapping ReactFlowProvider layouts.
 */
export default function CanvasWorkspace() {
  return (
    <div className="canvas-container" style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlowProvider>
        <CanvasFlow />
      </ReactFlowProvider>
    </div>
  );
}
