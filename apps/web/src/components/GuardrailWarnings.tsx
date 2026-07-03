"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ShieldCheck, ShieldAlert, X, Lightbulb } from "lucide-react";
import { useCanvasStore } from "../store/canvasStore";
import type { ScanResponse, SecurityWarning } from "@canvascloud/shared";
import Badge from "./ui/Badge";

interface GuardrailWarningsProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanResponse | null;
}

export default function GuardrailWarnings({
  isOpen,
  onClose,
  scanResult,
}: GuardrailWarningsProps) {
  const nodes = useCanvasStore((state) => state.nodes);

  const warnings = scanResult?.warnings || [];
  const summary = scanResult?.summary || { critical: 0, warning: 0, info: 0 };
  const totalIssues = summary.critical + summary.warning + summary.info;

  // Resolves the visual canvas label of a node from its ID
  const getNodeLabel = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return nodeId;
    return node.data.label || node.id;
  };

  const getSeverityBadgeVariant = (severity: SecurityWarning["severity"]) => {
    switch (severity) {
      case "critical":
        return "error";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "neutral";
    }
  };

  const getSeverityColor = (severity: SecurityWarning["severity"]) => {
    switch (severity) {
      case "critical":
        return "var(--color-error)";
      case "warning":
        return "var(--color-warn)";
      case "info":
        return "var(--accent-color)";
      default:
        return "var(--text-muted)";
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
            maxWidth: "680px",
            height: "80vh",
            maxHeight: "580px",
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
              {totalIssues > 0 ? (
                <ShieldAlert size={20} style={{ color: summary.critical > 0 ? "var(--color-error)" : "var(--color-warn)" }} />
              ) : (
                <ShieldCheck size={20} style={{ color: "var(--color-success)" }} />
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <Dialog.Title
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  Security & Guardrails Scan Results
                </Dialog.Title>
                <Dialog.Description
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  Compliance audit report against AWS design constraints.
                </Dialog.Description>
              </div>
            </div>

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

          {/* Severity Counters Bar */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              padding: "16px",
              backgroundColor: "var(--bg-panel)",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            {/* Critical counter */}
            <div
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                backgroundColor: summary.critical > 0 ? "var(--bg-app)" : "transparent",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Critical
              </span>
              <span style={{ fontSize: "1.25rem", fontWeight: 900, color: summary.critical > 0 ? "var(--color-error)" : "var(--text-primary)" }}>
                {summary.critical}
              </span>
            </div>

            {/* Warning counter */}
            <div
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                backgroundColor: summary.warning > 0 ? "var(--bg-app)" : "transparent",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Warning
              </span>
              <span style={{ fontSize: "1.25rem", fontWeight: 900, color: summary.warning > 0 ? "var(--color-warn)" : "var(--text-primary)" }}>
                {summary.warning}
              </span>
            </div>

            {/* Info counter */}
            <div
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                backgroundColor: summary.info > 0 ? "var(--bg-app)" : "transparent",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Info
              </span>
              <span style={{ fontSize: "1.25rem", fontWeight: 900, color: summary.info > 0 ? "var(--accent-color)" : "var(--text-primary)" }}>
                {summary.info}
              </span>
            </div>
          </div>

          {/* Warnings List Panel */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {warnings.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "48px 0",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShieldCheck size={24} style={{ color: "var(--color-success)" }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 4px 0" }}>
                    Architecture Compliant
                  </h3>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>
                    No security vulnerabilities or routing discrepancies found in this canvas layout.
                  </p>
                </div>
              </div>
            ) : (
              warnings.map((warning, index) => {
                const nodeLabel = getNodeLabel(warning.nodeId);
                return (
                  <div
                    key={`${warning.ruleId}-${index}`}
                    style={{
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-panel)",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "border-color 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                  >
                    {/* Warning Header */}
                    <div
                      style={{
                        padding: "12px",
                        borderBottom: "1px dashed var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "3px",
                            height: "16px",
                            backgroundColor: getSeverityColor(warning.severity),
                            borderRadius: "1.5px",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: "var(--text-primary)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {warning.ruleId}
                        </span>
                        <Badge variant={getSeverityBadgeVariant(warning.severity)}>
                          {warning.severity}
                        </Badge>
                      </div>

                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "var(--text-secondary)",
                          backgroundColor: "var(--bg-active)",
                          padding: "2px 6px",
                          borderRadius: "var(--radius-sm)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        Node: {nodeLabel}
                      </span>
                    </div>

                    {/* Warning Content */}
                    <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <p
                        style={{
                          fontSize: "0.76rem",
                          color: "var(--text-secondary)",
                          lineHeight: "1.4",
                          margin: 0,
                        }}
                      >
                        {warning.message}
                      </p>

                      {/* Remediations Suggestion Bar */}
                      {warning.suggestion && (
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            padding: "8px 10px",
                            backgroundColor: "var(--bg-active)",
                            borderRadius: "var(--radius-sm)",
                            borderLeft: `2px solid ${getSeverityColor(warning.severity)}`,
                          }}
                        >
                          <Lightbulb
                            size={14}
                            style={{
                              color: getSeverityColor(warning.severity),
                              flexShrink: 0,
                              marginTop: "1px",
                            }}
                          />
                          <p
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-primary)",
                              lineHeight: "1.35",
                              margin: 0,
                              fontWeight: 600,
                            }}
                          >
                            <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>Remediation: </span>
                            {warning.suggestion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
