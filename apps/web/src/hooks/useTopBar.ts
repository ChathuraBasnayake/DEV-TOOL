"use client";

import { useState } from "react";
import { useCanvasStore } from "../store/canvasStore";
import { projectsApi, compilerApi, guardrailsApi } from "../services/api";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import type { CompileResponse, ScanResponse } from "@canvascloud/shared";

export function useTopBar() {
  const projectId = useCanvasStore((state) => state.projectId);
  const projectName = useCanvasStore((state) => state.projectName);
  const nodes = useCanvasStore((state) => state.nodes);
  const edges = useCanvasStore((state) => state.edges);
  const viewport = useCanvasStore((state) => state.viewport);
  const setProject = useCanvasStore((state) => state.setProject);
  const setProjectName = useCanvasStore((state) => state.setProjectName);
  const isSaving = useCanvasStore((state) => state.isSaving);
  const setSaving = useCanvasStore((state) => state.setSaving);

  // Dialog & preview modal visibility states
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [isTerraformPreviewOpen, setIsTerraformPreviewOpen] = useState(false);
  const [isGuardrailsOpen, setIsGuardrailsOpen] = useState(false);

  // Dynamic async loading states
  const [isCompiling, setIsCompiling] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Dynamic API payload states
  const [terraformFiles, setTerraformFiles] = useState<CompileResponse | null>(null);
  const [scanResult, setScanResult] = useState<ScanResponse | null>(null);

  // Rename action handler
  const handleRename = (name: string) => {
    setProjectName(name || "Untitled Project");
  };

  // Persists current project canvas state to the backend database
  const handleSave = async () => {
    setSaving(true);
    const canvas = { nodes, edges, viewport };

    try {
      if (projectId) {
        // Existing project updates
        await projectsApi.update(projectId, { name: projectName, canvas });
        toast.success("Project saved successfully");
      } else {
        // New project creation
        const project = await projectsApi.create({ name: projectName, canvas });
        setProject(project.id, project.name, project.canvas);
        toast.success("Project created and saved");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to save project";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Compiles canvas to Terraform HCL and displays the preview modal
  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const response = await compilerApi.compile({ nodes, edges, projectName });
      setTerraformFiles(response);
      setIsTerraformPreviewOpen(true);
      toast.success("Compilation succeeded");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to compile architecture";
      toast.error(msg);
    } finally {
      setIsCompiling(false);
    }
  };

  // Scans canvas for security guardrails violations and displays the audit modal
  const handleScan = async () => {
    setIsScanning(true);
    try {
      const response = await guardrailsApi.scan({ nodes, edges });
      setScanResult(response);
      setIsGuardrailsOpen(true);
      const criticalCount = response.summary.critical;
      const warningCount = response.summary.warning;
      if (criticalCount === 0 && warningCount === 0) {
        toast.success("Security scan clean! (0 vulnerabilities found)");
      } else if (criticalCount > 0) {
        toast.error(`Security scan flagged ${criticalCount} critical vulnerabilities`);
      } else {
        toast.success(`Security scan completed. ${warningCount} warnings found`);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to run guardrails scan";
      toast.error(msg);
    } finally {
      setIsScanning(false);
    }
  };

  // Compiles and downloads the Terraform bundle zip file
  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      const blob = await compilerApi.downloadZip({ nodes, edges, projectName });
      const filename = `${projectName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_terraform.zip`;
      saveAs(blob, filename);
      toast.success("Terraform bundle downloaded");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to download ZIP bundle";
      toast.error(msg);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    projectName,
    isSaving,
    isCompiling,
    isScanning,
    isDownloading,
    isProjectManagerOpen,
    isTerraformPreviewOpen,
    isGuardrailsOpen,
    terraformFiles,
    scanResult,
    setIsProjectManagerOpen,
    setIsTerraformPreviewOpen,
    setIsGuardrailsOpen,
    handleRename,
    handleSave,
    handleCompile,
    handleScan,
    handleDownloadZip,
  };
}
