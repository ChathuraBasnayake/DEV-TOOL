"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FolderKanban, Plus, Trash2, Clock, Layers, ArrowRight, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../services/api";
import { useCanvasStore } from "../store/canvasStore";
import Button from "./ui/Button";
import toast from "react-hot-toast";

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectManager({ isOpen, onClose }: ProjectManagerProps) {
  const queryClient = useQueryClient();
  const setProject = useCanvasStore((state) => state.setProject);

  // Fetch the list of saved project metadata
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.findAll,
    enabled: isOpen,
  });

  // Loads a project state and updates the Zustand store
  const loadMutation = useMutation({
    mutationFn: projectsApi.findOne,
    onSuccess: (project) => {
      setProject(project.id, project.name, project.canvas);
      onClose();
      toast.success(`Loaded project: ${project.name}`);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to load project";
      toast.error(msg);
    },
  });

  // Deletes a project from the database
  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to delete project";
      toast.error(msg);
    },
  });

  const handleNewProject = () => {
    setProject(null, "Untitled Project", {
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    });
    onClose();
    toast.success("Created new canvas session");
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop Overlay */}
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            animation: "shimmerEffect 0.3s forwards",
          }}
        />

        {/* Modal Content */}
        <Dialog.Content
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90vw",
            maxWidth: "600px",
            height: "75vh",
            maxHeight: "520px",
            backgroundColor: "var(--bg-panel-solid)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 101,
            outline: "none",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FolderKanban size={20} style={{ color: "var(--accent-color)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <Dialog.Title
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  Project Manager
                </Dialog.Title>
                <Dialog.Description
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  Manage, select, and delete cloud-saved architecture projects.
                </Dialog.Description>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Button
                variant="primary"
                size="sm"
                onClick={handleNewProject}
                icon={<Plus size={13} />}
              >
                New Canvas
              </Button>
              <Dialog.Close asChild>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "var(--radius-sm)",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-active)")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Project List View */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {isLoading ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                Querying saved projects database catalog...
              </div>
            ) : error ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  color: "var(--color-error)",
                }}
              >
                Failed to list projects: {error instanceof Error ? error.message : "API connection failed"}
              </div>
            ) : projects.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "48px 0",
                }}
              >
                <FolderKanban size={32} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 700, margin: "0 0 2px 0" }}>
                    No Saved Projects Found
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: 0 }}>
                    Click &quot;New Canvas&quot; or drag elements to build a layout and save.
                  </p>
                </div>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-panel)",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "border-color 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                >
                  {/* Left: Info */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h3
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      {project.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        <Layers size={11} />
                        <span>
                          {project.nodeCount} node{project.nodeCount !== 1 && "s"},{" "}
                          {project.edgeCount} edge{project.edgeCount !== 1 && "s"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        <Clock size={11} />
                        <span>{formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => deleteMutation.mutate(project.id)}
                      disabled={deleteMutation.isPending || loadMutation.isPending}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-error)",
                        cursor: "pointer",
                        padding: "6px",
                        borderRadius: "var(--radius-sm)",
                        transition: "background-color 0.2s, opacity 0.2s",
                        opacity: deleteMutation.isPending ? 0.5 : 0.8,
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      title="Delete project permanent"
                    >
                      <Trash2 size={14} />
                    </button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadMutation.mutate(project.id)}
                      loading={loadMutation.isPending && loadMutation.variables === project.id}
                      disabled={deleteMutation.isPending}
                      icon={<ArrowRight size={13} />}
                    >
                      Load
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
