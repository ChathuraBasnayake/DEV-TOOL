"use client";

import { useState } from "react";
import { useSelectedNode, useCanvasStore, useCanvasNodes } from "../store/canvasStore";

export function usePropertyPanel() {
  const selectedNode = useSelectedNode();
  const nodes = useCanvasNodes();
  const updateNodeLabel = useCanvasStore((state) => state.updateNodeLabel);
  const deleteNode = useCanvasStore((state) => state.deleteNode);

  const [activeTab, setActiveTab] = useState("config");
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  const [prevNodeId, setPrevNodeId] = useState<string | null>(null);

  // Sync internal rename state whenever selectedNode switches during render phase
  if (selectedNode && selectedNode.id !== prevNodeId) {
    setPrevNodeId(selectedNode.id);
    setNameInput(selectedNode.data.label);
    setNameError(null);
  }

  // Rename action with validation checks
  const handleNameChange = (val: string) => {
    setNameInput(val);

    if (!val) {
      setNameError("Resource name is required");
      return;
    }

    // Must match standard variable identifier format (start with letter/underscore, alphanumeric/underscores only)
    const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    if (!regex.test(val)) {
      setNameError("Must start with a letter/underscore and contain alphanumeric characters");
      return;
    }

    // Must be unique across all other resources in the current project
    const isDuplicate = nodes.some(
      (node) =>
        node.id !== selectedNode?.id &&
        node.data.label.toLowerCase() === val.trim().toLowerCase()
    );

    if (isDuplicate) {
      setNameError("Resource name must be unique in project");
      return;
    }

    setNameError(null);
    if (selectedNode) {
      updateNodeLabel(selectedNode.id, val.trim());
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
    }
  };

  return {
    selectedNode,
    activeTab,
    setActiveTab,
    nameInput,
    nameError,
    handleNameChange,
    handleDelete,
  };
}
