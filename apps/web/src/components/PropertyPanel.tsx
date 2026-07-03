"use client";

import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Trash2, Info, Settings, FileText } from "lucide-react";
import { usePropertyPanel } from "../hooks/usePropertyPanel";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

// Helper map to convert resource type keys to clean titles
const RESOURCE_TITLES: Record<string, string> = {
  ec2: "EC2 Instance",
  asg: "Auto Scaling Group",
  "launch-template": "Launch Template",
  vpc: "Virtual Private Cloud (VPC)",
  subnet: "Subnet",
  "route-table": "Route Table",
  igw: "Internet Gateway",
  "nat-gw": "NAT Gateway",
  eip: "Elastic IP",
  "security-group": "Security Group",
  alb: "Application Load Balancer",
  "target-group": "Target Group",
  rds: "RDS Database",
  elasticache: "ElastiCache Cluster",
  dynamodb: "DynamoDB Table",
  s3: "S3 Bucket",
  "iam-role": "IAM Role",
  "iam-policy": "IAM Policy",
  lambda: "Lambda Function",
  "api-gateway": "API Gateway",
  route53: "Route 53",
  cloudfront: "CloudFront CDN",
};

// Comprehensive premium documentation guides for the 22 AWS resources
const RESOURCE_DOCS: Record<string, string> = {
  ec2: "Elastic Compute Cloud (EC2) provides secure, resizable compute capacity in the cloud. Configure AMIs, instances types, and networking tags to launch virtual servers.",
  asg: "Auto Scaling Group (ASG) monitors your applications and automatically adjusts capacity to maintain steady, predictable performance at the lowest possible cost.",
  "launch-template": "Launch Templates specify instance configuration information (AMIs, instance types, key pairs, security groups), simplifying Auto Scaling deployments.",
  vpc: "Virtual Private Cloud (VPC) defines a logically isolated virtual network where you launch AWS resources. Configures custom IP Address CIDR ranges.",
  subnet: "Subnets partition a VPC into smaller subnetworks. Use public subnets for internet-facing gateways and private subnets for backend resources.",
  "route-table": "Route Tables contain routing rules determining where network traffic from your subnet or gateway is directed.",
  igw: "An Internet Gateway (IGW) is a highly available VPC component allowing communication between instances in your VPC and the public internet.",
  "nat-gw": "A NAT Gateway enables private subnet instances to send outbound requests to the internet while blocking incoming unsolicited connections.",
  eip: "An Elastic IP (EIP) address is a static, public IPv4 address reserved for your AWS account, typically bound to NAT Gateways or active EC2 instances.",
  "security-group": "A Security Group acts as a stateful firewall for your resources, controlling inbound and outbound traffic protocols and port permissions.",
  alb: "Application Load Balancer (ALB) operates at the application layer (Layer 7), automatically routing incoming traffic to configured target groups.",
  "target-group": "Target Groups route requests to registered targets (e.g. EC2 instances) based on protocol health checks and ports configurations.",
  rds: "Amazon Relational Database Service (RDS) makes it easy to set up, operate, and scale relational databases (MySQL, PostgreSQL) in the cloud.",
  elasticache: "Amazon ElastiCache is a managed in-memory data store and cache service, speeding up databases with high-concurrency Redis or Memcached clusters.",
  dynamodb: "Amazon DynamoDB is a fully managed, serverless, NoSQL key-value database designed for high performance at any scale.",
  s3: "Simple Storage Service (S3) is a highly scalable, secure object storage repository. Used for hosting assets, backups, or raw data buckets.",
  "iam-role": "An IAM Role is an identity with specific permission policies, granting AWS resources secure temporary access to API functions.",
  "iam-policy": "An IAM Policy defines permissions. You can attach policies to roles to restrict or allow specific API actions using JSON specifications.",
  lambda: "AWS Lambda is a serverless compute service executing code in response to events (API calls, storage drops) without provisioning servers.",
  "api-gateway": "Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, and secure REST or HTTP APIs.",
  route53: "Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service, routing traffic to active resources.",
  cloudfront: "Amazon CloudFront is a global Content Delivery Network (CDN) service caching static and dynamic data closer to users.",
};

export default function PropertyPanel() {
  const {
    selectedNode,
    activeTab,
    setActiveTab,
    nameInput,
    nameError,
    handleNameChange,
    handleDelete,
  } = usePropertyPanel();

  // If no resource is currently selected, display standard workspace placeholder
  if (!selectedNode) {
    return (
      <div
        className="property-drawer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          color: "var(--text-muted)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <Info size={32} style={{ color: "var(--text-muted)", opacity: 0.6 }} />
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>
            No Resource Selected
          </h3>
          <p style={{ fontSize: "0.75rem", lineHeight: "1.4", maxWidth: "220px" }}>
            Select any component on the workspace canvas to configure its properties.
          </p>
        </div>
      </div>
    );
  }

  const { resourceType, status } = selectedNode.data;
  const resourceTitle = RESOURCE_TITLES[resourceType] || "AWS Resource";
  const resourceDocs = RESOURCE_DOCS[resourceType] || "No documentation available.";

  return (
    <div className="property-drawer" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Panel Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Resource Config
            </span>
            <h2
              style={{
                fontSize: "0.9rem",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              {resourceTitle}
            </h2>
          </div>
          <Badge variant={status === "configured" ? "success" : "warning"}>
            {status}
          </Badge>
        </div>

        {/* Rename Input with validation highlights */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="resource-name-input"
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
            }}
          >
            Resource Name (ID)
          </label>
          <input
            id="resource-name-input"
            type="text"
            value={nameInput}
            onChange={(e) => handleNameChange(e.target.value)}
            style={{
              backgroundColor: "var(--bg-active)",
              border: `1px solid ${nameError ? "var(--state-error-border)" : "var(--border-color)"}`,
              borderRadius: "var(--radius-md)",
              padding: "8px 12px",
              fontSize: "0.8rem",
              color: "var(--text-primary)",
              outline: "none",
              transition: "border-color 0.2s",
            }}
          />
          {nameError && (
            <span
              style={{
                fontSize: "0.65rem",
                color: "var(--color-error)",
                lineHeight: "1.2",
              }}
            >
              {nameError}
            </span>
          )}
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Tabs.List
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-panel)",
          }}
        >
          <Tabs.Trigger
            value="config"
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "0.78rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              color: activeTab === "config" ? "var(--accent-color)" : "var(--text-muted)",
              borderBottom: activeTab === "config" ? "2px solid var(--accent-color)" : "2px solid transparent",
              background: "none",
              borderLeft: "none",
              borderRight: "none",
              borderTop: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <Settings size={14} />
            Properties
          </Tabs.Trigger>
          <Tabs.Trigger
            value="docs"
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "0.78rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              color: activeTab === "docs" ? "var(--accent-color)" : "var(--text-muted)",
              borderBottom: activeTab === "docs" ? "2px solid var(--accent-color)" : "2px solid transparent",
              background: "none",
              borderLeft: "none",
              borderRight: "none",
              borderTop: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <FileText size={14} />
            Documentation
          </Tabs.Trigger>
        </Tabs.List>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {/* Properties Config Tab */}
          <Tabs.Content value="config" style={{ outline: "none" }}>
            <div id="property-panel-fields-container">
              {/* Dynamic properties fields will render here in Task 4.5/4.6 */}
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textAlign: "center",
                  padding: "24px 8px",
                  border: "1px dashed var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-panel)",
                }}
              >
                Configure parameters to generate valid HCL definitions.
              </div>
            </div>
          </Tabs.Content>

          {/* Documentation Tab */}
          <Tabs.Content value="docs" style={{ outline: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-secondary)",
                  lineHeight: "1.4",
                }}
              >
                {resourceDocs}
              </p>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-panel)",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  lineHeight: "1.4",
                }}
              >
                <strong>Developer Note:</strong> Connect this resource to other components on the canvas to describe dependencies. Valid connections will be automatically evaluated under NestJS security scanner guardrails.
              </div>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>

      {/* Delete Component Action Bar */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-panel)",
        }}
      >
        <Button
          variant="danger"
          size="md"
          icon={<Trash2 size={14} />}
          onClick={handleDelete}
          style={{ width: "100%" }}
        >
          Delete Resource
        </Button>
      </div>
    </div>
  );
}
