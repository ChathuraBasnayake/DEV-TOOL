"use client";

import React, { useMemo } from "react";
import {
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
import { useResourcePalette, PaletteCategory } from "../hooks/useResourcePalette";
import SearchFilter from "./SearchFilter";
import ResourceCategory from "./ResourceCategory";
import ResourceItem from "./ResourceItem";

export default function ResourcePalette() {
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

  const {
    searchQuery,
    setSearchQuery,
    expandedCategories,
    toggleCategory,
    handleDragStart,
    filteredCategories,
  } = useResourcePalette({ categories });

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
      <SearchFilter value={searchQuery} onChange={setSearchQuery} />

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
          filteredCategories.map((category) => (
            <ResourceCategory
              key={category.id}
              id={category.id}
              name={category.name}
              icon={category.icon}
              isExpanded={expandedCategories[category.id] !== false}
              onToggle={() => toggleCategory(category.id)}
            >
              {category.items.map((item) => (
                <ResourceItem
                  key={item.type}
                  type={item.type}
                  name={item.name}
                  description={item.description}
                  icon={item.icon}
                  colorClass={category.colorClass}
                  onDragStart={handleDragStart}
                />
              ))}
            </ResourceCategory>
          ))
        )}
      </div>
    </div>
  );
}
