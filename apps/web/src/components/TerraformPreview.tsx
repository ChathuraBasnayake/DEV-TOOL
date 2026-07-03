"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Clipboard, Check, Download, X } from "lucide-react";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import type { CompileResponse } from "@canvascloud/shared";
import Button from "./ui/Button";

interface TerraformPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  output: CompileResponse | null;
}

export default function TerraformPreview({
  isOpen,
  onClose,
  output,
}: TerraformPreviewProps) {
  const [copied, setCopied] = useState(false);
  const files = output?.files || [];

  // Get active tab value (default to first filename)
  const defaultTab = files.length > 0 ? files[0].filename : "";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [prevFilesLength, setPrevFilesLength] = useState(files.length);

  // Sync state if files array changes or active tab becomes invalid during render phase
  if (files.length !== prevFilesLength || (files.length > 0 && !files.find((f) => f.filename === activeTab))) {
    setPrevFilesLength(files.length);
    setActiveTab(files.length > 0 ? files[0].filename : "");
  }

  const activeFile = files.find((f) => f.filename === activeTab);

  const handleCopy = async () => {
    if (!activeFile) return;
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      toast.success(`${activeFile.filename} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleDownloadFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, activeFile.filename);
    toast.success(`${activeFile.filename} downloaded`);
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
            maxWidth: "900px",
            height: "80vh",
            maxHeight: "650px",
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
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <Dialog.Title
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                Terraform Configuration Code Preview
              </Dialog.Title>
              <Dialog.Description
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                View generated HCL files before exporting.
              </Dialog.Description>
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

          {files.length === 0 ? (
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
              No generated Terraform code files available.
            </div>
          ) : (
            <Tabs.Root
              value={activeTab}
              onValueChange={setActiveTab}
              style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
            >
              {/* Tab Selector Header Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 16px",
                  borderBottom: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-panel)",
                }}
              >
                <Tabs.List style={{ display: "flex", gap: "8px", height: "44px" }}>
                  {files.map((file) => (
                    <Tabs.Trigger
                      key={file.filename}
                      value={file.filename}
                      style={{
                        padding: "0 12px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: activeTab === file.filename ? "var(--accent-color)" : "var(--text-secondary)",
                        borderBottom: activeTab === file.filename ? "2px solid var(--accent-color)" : "2px solid transparent",
                        background: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        borderTop: "none",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {file.filename}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>

                {/* Quick Actions Gutter */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    icon={copied ? <Check size={13} style={{ color: "var(--color-success)" }} /> : <Clipboard size={13} />}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownloadFile}
                    icon={<Download size={13} />}
                  >
                    Download
                  </Button>
                </div>
              </div>

              {/* Code Contents Area */}
              <div style={{ flex: 1, overflow: "hidden", display: "flex", backgroundColor: "var(--bg-app)" }}>
                {files.map((file) => (
                  <Tabs.Content
                    key={file.filename}
                    value={file.filename}
                    style={{
                      flex: 1,
                      outline: "none",
                      display: "flex",
                      overflowY: "auto",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                      lineHeight: "1.5",
                      color: "var(--text-primary)",
                      padding: "16px 8px",
                    }}
                  >
                    {/* Line Numbers Gutter */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        userSelect: "none",
                        opacity: 0.35,
                        width: "36px",
                        paddingRight: "12px",
                        borderRight: "1px solid var(--border-color)",
                        marginRight: "12px",
                      }}
                    >
                      {file.content.split("\n").map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>

                    {/* Pre-formatted Code Block */}
                    <pre
                      style={{
                        margin: 0,
                        flex: 1,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        overflowX: "auto",
                      }}
                    >
                      <code>{file.content}</code>
                    </pre>
                  </Tabs.Content>
                ))}
              </div>
            </Tabs.Root>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
