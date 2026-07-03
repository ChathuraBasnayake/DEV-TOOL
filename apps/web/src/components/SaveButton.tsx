"use client";

import React from "react";
import { Save } from "lucide-react";
import Button from "./ui/Button";

interface SaveButtonProps {
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export default function SaveButton({ onSave, isSaving }: SaveButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onSave}
      loading={isSaving}
      icon={<Save size={14} />}
      title="Save current architecture state to database"
    >
      Save
    </Button>
  );
}
