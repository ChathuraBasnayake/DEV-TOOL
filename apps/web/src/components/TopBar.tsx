"use client";

import React from "react";
import { ShieldCheck, Eye, CloudLightning } from "lucide-react";
import { useTopBar } from "../hooks/useTopBar";
import ProjectName from "./ProjectName";
import SaveButton from "./SaveButton";
import LoadButton from "./LoadButton";
import ExportButton from "./ExportButton";
import Button from "./ui/Button";
import TerraformPreview from "./TerraformPreview";
import GuardrailWarnings from "./GuardrailWarnings";

export default function TopBar() {
  const {
    projectName,
    isSaving,
    isCompiling,
    isScanning,
    isDownloading,
    handleRename,
    handleSave,
    handleCompile,
    handleScan,
    handleDownloadZip,
    setIsProjectManagerOpen,
    isTerraformPreviewOpen,
    setIsTerraformPreviewOpen,
    terraformFiles,
    isGuardrailsOpen,
    setIsGuardrailsOpen,
    scanResult,
  } = useTopBar();

  // Expose triggers for modal launches
  const handleOpenLoad = () => {
    setIsProjectManagerOpen(true);
  };

  return (
    <div
      className="top-navbar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        height: "56px",
        backgroundColor: "var(--bg-panel-solid)",
        borderBottom: "1px solid var(--border-color)",
        zIndex: 10,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Left Segment: Branding and Editable Project Name */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CloudLightning size={20} style={{ color: "var(--accent-color)" }} />
          <span
            style={{
              fontSize: "0.95rem",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "0.05em",
            }}
          >
            CANVASCLOUD
          </span>
        </div>

        {/* Separator */}
        <div
          style={{
            height: "20px",
            width: "1px",
            backgroundColor: "var(--border-color)",
          }}
        />

        <ProjectName value={projectName} onChange={handleRename} />
      </div>

      {/* Middle Segment: Auto-save status indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: isSaving ? "var(--color-warn)" : "var(--color-success)",
            animation: isSaving ? "shimmerEffect 1s infinite alternate" : "none",
            transition: "background-color 0.3s",
          }}
        />
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            fontWeight: 600,
          }}
        >
          {isSaving ? "Saving changes..." : "Saved to Cloud"}
        </span>
      </div>

      {/* Right Segment: Action Buttons Group */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <LoadButton onLoadClick={handleOpenLoad} />
        <SaveButton onSave={handleSave} isSaving={isSaving} />

        {/* Separator */}
        <div
          style={{
            height: "16px",
            width: "1px",
            backgroundColor: "var(--border-color)",
            margin: "0 4px",
          }}
        />

        <Button
          variant="secondary"
          size="sm"
          onClick={handleScan}
          loading={isScanning}
          icon={<ShieldCheck size={14} />}
          title="Run security rules scan against infrastructure architecture"
        >
          Scan
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleCompile}
          loading={isCompiling}
          icon={<Eye size={14} />}
          title="Compile resources and preview Terraform HCL code files"
        >
          Preview HCL
        </Button>

        <ExportButton onExport={handleDownloadZip} isExporting={isDownloading} />
      </div>

      {/* Modals & Dialogs */}
      <TerraformPreview
        isOpen={isTerraformPreviewOpen}
        onClose={() => setIsTerraformPreviewOpen(false)}
        output={terraformFiles}
      />
      <GuardrailWarnings
        isOpen={isGuardrailsOpen}
        onClose={() => setIsGuardrailsOpen(false)}
        scanResult={scanResult}
      />
    </div>
  );
}
