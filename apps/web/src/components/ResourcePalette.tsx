"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Server,
  Layers,
  FileCode,
  Network,
  Grid,
  Map,
  Globe,
  Cpu,
  Hash,
  Shield,
  RefreshCw,
  Target,
  Database,
  Zap,
  Table,
  Archive,
  UserCheck,
  FileText,
  ExternalLink,
  Compass,
  Radio,
} from "lucide-react";
import type { AWSResourceType } from "@canvascloud/shared";

interface PaletteItem {
  type: AWSResourceType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface PaletteCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  colorClass: string;
  items: PaletteItem[];
}

export default function ResourcePalette() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    compute: true,
    networking: true,
    securityGroups: true,
    loadBalancing: true,
    databases: true,
    storage: true,
    accessControl: false,
    serverless: false,
    dnsCdn: false,
  });

  // Registry of all 22 AWS resources grouped into 9 categories
  const categories: PaletteCategory[] = useMemo(
    () => [
      {
        id: "compute",
        name: "Compute",
        icon: <Server size={16} />,
        colorClass: "category-ec2",
        items: [
          {
            type: "ec2",
            name: "EC2 Instance",
            description: "Elastic Compute Cloud virtual server",
            icon: <Server size={14} />,
          },
          {
            type: "asg",
            name: "Auto Scaling Group",
            description: "Automatically scales EC2 capacity",
            icon: <Layers size={14} />,
          },
          {
            type: "launch-template",
            name: "Launch Template",
            description: "Configuration template for EC2 instances",
            icon: <FileCode size={14} />,
          },
        ],
      },
      {
        id: "networking",
        name: "Networking Core",
        icon: <Network size={16} />,
        colorClass: "category-vpc",
        items: [
          {
            type: "vpc",
            name: "VPC",
            description: "Virtual Private Cloud network boundary",
            icon: <Network size={14} />,
          },
          {
            type: "subnet",
            name: "Subnet",
            description: "Isolated IP range within a VPC",
            icon: <Grid size={14} />,
          },
          {
            type: "route-table",
            name: "Route Table",
            description: "Routing rules for subnet network traffic",
            icon: <Map size={14} />,
          },
          {
            type: "igw",
            name: "Internet Gateway",
            description: "VPC connection to the public internet",
            icon: <Globe size={14} />,
          },
          {
            type: "nat-gw",
            name: "NAT Gateway",
            description: "Outbound internet access for private subnets",
            icon: <Cpu size={14} />,
          },
          {
            type: "eip",
            name: "Elastic IP",
            description: "Static public IPv4 address reservation",
            icon: <Hash size={14} />,
          },
        ],
      },
      {
        id: "securityGroups",
        name: "Security Groups",
        icon: <Shield size={16} />,
        colorClass: "category-security-group",
        items: [
          {
            type: "security-group",
            name: "Security Group",
            description: "Stateful firewall rules for AWS resources",
            icon: <Shield size={14} />,
          },
        ],
      },
      {
        id: "loadBalancing",
        name: "Load Balancers",
        icon: <RefreshCw size={16} />,
        colorClass: "category-alb",
        items: [
          {
            type: "alb",
            name: "ALB",
            description: "Application Load Balancer traffic router",
            icon: <RefreshCw size={14} />,
          },
          {
            type: "target-group",
            name: "Target Group",
            description: "Destination routing targets for load balancers",
            icon: <Target size={14} />,
          },
        ],
      },
      {
        id: "databases",
        name: "Databases",
        icon: <Database size={16} />,
        colorClass: "category-rds",
        items: [
          {
            type: "rds",
            name: "RDS Database",
            description: "Relational Database Service (MySQL/PostgreSQL)",
            icon: <Database size={14} />,
          },
          {
            type: "elasticache",
            name: "ElastiCache Cluster",
            description: "In-memory caching cluster (Redis/Memcached)",
            icon: <Zap size={14} />,
          },
          {
            type: "dynamodb",
            name: "DynamoDB Table",
            description: "NoSQL key-value database",
            icon: <Table size={14} />,
          },
        ],
      },
      {
        id: "storage",
        name: "Storage",
        icon: <Archive size={16} />,
        colorClass: "category-s3",
        items: [
          {
            type: "s3",
            name: "S3 Bucket",
            description: "Simple Storage Service object repository",
            icon: <Archive size={14} />,
          },
        ],
      },
      {
        id: "accessControl",
        name: "Access Control",
        icon: <UserCheck size={16} />,
        colorClass: "category-iam-role",
        items: [
          {
            type: "iam-role",
            name: "IAM Role",
            description: "Identity and Access Management credentials container",
            icon: <UserCheck size={14} />,
          },
          {
            type: "iam-policy",
            name: "IAM Policy",
            description: "JSON definitions of granular permissions",
            icon: <FileText size={14} />,
          },
        ],
      },
      {
        id: "serverless",
        name: "Serverless",
        icon: <Zap size={16} />,
        colorClass: "category-lambda",
        items: [
          {
            type: "lambda",
            name: "Lambda Function",
            description: "Event-driven serverless code execution",
            icon: <Zap size={14} />,
          },
          {
            type: "api-gateway",
            name: "API Gateway",
            description: "Expose Lambda functions via REST endpoints",
            icon: <ExternalLink size={14} />,
          },
        ],
      },
      {
        id: "dnsCdn",
        name: "DNS & CDN",
        icon: <Compass size={16} />,
        colorClass: "category-route53",
        items: [
          {
            type: "route53",
            name: "Route 53",
            description: "Domain Name System routing configurations",
            icon: <Compass size={14} />,
          },
          {
            type: "cloudfront",
            name: "CloudFront CDN",
            description: "Global content delivery network distribution",
            icon: <Radio size={14} />,
          },
        ],
      },
    ],
    []
  );

  // Toggle category collapse
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Drag start callback to write visual metadata transfer payload
  const handleDragStart = (event: React.DragEvent, type: AWSResourceType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  // Compute filtered categories based on search input query
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;

    return categories
      .map((cat) => {
        const matchingItems = cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
        return { ...cat, items: matchingItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: "var(--bg-panel-solid)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      {/* Palette Title Section */}
      <div
        style={{
          padding: "18px 16px",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <h2
          style={{
            fontSize: "0.95rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "0.03em",
          }}
        >
          AWS Resources
        </h2>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          Drag components to the workspace canvas
        </p>
      </div>

      {/* Palette Search Filtering Input */}
      <div style={{ padding: "12px 16px", position: "relative" }}>
        <div style={{ position: "relative", width: "100%" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "var(--bg-active)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "8px 12px 8px 34px",
              fontSize: "0.8rem",
              color: "var(--text-primary)",
              transition: "border-color 0.2s",
            }}
            className="palette-search-input"
          />
        </div>
      </div>

      {/* Accordions Category Lists */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 8px 24px",
        }}
      >
        {filteredCategories.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 16px",
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              fontStyle: "italic",
            }}
          >
            No matching resources found
          </div>
        ) : (
          filteredCategories.map((category) => {
            const isExpanded = expandedCategories[category.id] !== false;

            return (
              <div
                key={category.id}
                style={{
                  marginBottom: "8px",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-card)",
                }}
              >
                {/* Accordion Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px 12px",
                    cursor: "pointer",
                    backgroundColor: "var(--bg-panel)",
                    borderBottom: isExpanded ? "1px solid var(--border-color)" : "none",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--bg-active)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--bg-panel)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--text-primary)",
                    }}
                  >
                    <span style={{ color: "var(--accent-color)" }}>{category.icon}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                      {category.name}
                    </span>
                  </div>
                  <div style={{ color: "var(--text-muted)" }}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </button>

                {/* Collapsible Items Container */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {category.items.map((item) => (
                      <div
                        key={item.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.type)}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "8px 10px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-color)",
                          backgroundColor: "var(--bg-card)",
                          cursor: "grab",
                          userSelect: "none",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = "var(--border-hover)";
                          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = "var(--border-color)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        className={`palette-item-card ${category.colorClass}`}
                      >
                        {/* Bullet styling from category class colors */}
                        <div
                          style={{
                            marginTop: "3px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--accent-color)",
                          }}
                        >
                          {item.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              color: "var(--text-primary)",
                            }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.68rem",
                              color: "var(--text-muted)",
                              marginTop: "1px",
                              lineHeight: "1.2",
                              whiteSpace: "normal",
                            }}
                          >
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
