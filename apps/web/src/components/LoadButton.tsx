"use client";

import React from "react";
import { FolderOpen } from "lucide-react";
import Button from "./ui/Button";

interface LoadButtonProps {
  onLoadClick: () => void;
}

export default function LoadButton({ onLoadClick }: LoadButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onLoadClick}
      icon={<FolderOpen size={14} />}
      title="Open project manager to load a saved architecture"
    >
      Load
    </Button>
  );
}
