"use client";

import React, { useRef, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
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
import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";

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
