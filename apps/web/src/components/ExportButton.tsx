"use client";

import React from "react";
import { Download } from "lucide-react";
import Button from "./ui/Button";

interface ExportButtonProps {
  onExport: () => Promise<void>;
  isExporting: boolean;
}

export default function ExportButton({ onExport, isExporting }: ExportButtonProps) {
  return (
    <Button
      variant="primary"
      size="sm"
      onClick={onExport}
      loading={isExporting}
      icon={<Download size={14} />}
      title="Download complete Terraform HCL deployment package (ZIP)"
    >
      Export ZIP
    </Button>
  );
}
