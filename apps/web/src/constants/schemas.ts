import type { AWSResourceType } from "@canvascloud/shared";
import type { ResourceSchema } from "../types/schema";

export const RESOURCE_SCHEMAS: Record<AWSResourceType, ResourceSchema> = {
  ec2: {
    ami: {
      type: "text",
      label: "AMI ID",
      description: "Amazon Machine Image ID (e.g. ami-0c55b159cbfafe1f0)",
      required: true,
      placeholder: "ami-0c55b159cbfafe1f0",
      defaultValue: "ami-0c55b159cbfafe1f0",
    },
    instance_type: {
      type: "select",
      label: "Instance Type",
      description: "The size and capacity of the EC2 virtual server",
      required: true,
      defaultValue: "t3.micro",
      options: [
        { label: "t3.nano", value: "t3.nano" },
        { label: "t3.micro", value: "t3.micro" },
        { label: "t3.small", value: "t3.small" },
        { label: "t3.medium", value: "t3.medium" },
        { label: "t3.large", value: "t3.large" },
        { label: "m5.large", value: "m5.large" },
      ],
    },
    key_name: {
      type: "text",
      label: "Key Pair Name",
      description: "The name of the SSH key pair to associate with this instance",
      placeholder: "my-ssh-key",
    },
    associate_public_ip_address: {
      type: "boolean",
      label: "Associate Public IP",
      description: "Automatically assign a public IPv4 address to this instance",
      defaultValue: true,
    },
    user_data: {
      type: "textarea",
      label: "User Data Script",
      description: "Shell script script to run during initialization",
      placeholder: "#!/bin/bash\napt-get update\napt-get install -y nginx",
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      description: "Custom metadata tags to assign to the EC2 resource",
      defaultValue: { Name: "EC2Instance" },
    },
  },

  asg: {
    name: {
      type: "text",
      label: "ASG Name",
      description: "The name identifier for the Auto Scaling Group",
      required: true,
      placeholder: "my-asg",
    },
    min_size: {
      type: "number",
      label: "Minimum Size",
      description: "The minimum number of EC2 instances running in this group",
      required: true,
      defaultValue: 1,
    },
    max_size: {
      type: "number",
      label: "Maximum Size",
      description: "The maximum number of EC2 instances running in this group",
      required: true,
      defaultValue: 3,
    },
    desired_capacity: {
      type: "number",
      label: "Desired Capacity",
      description: "The desired number of running instances in this group",
      defaultValue: 2,
    },
    health_check_type: {
      type: "select",
      label: "Health Check Type",
      description: "The service that provides the health status checks",
      defaultValue: "EC2",
      options: [
        { label: "EC2 (Instance Status Checked)", value: "EC2" },
        { label: "ELB (Load Balancer Health Checked)", value: "ELB" },
      ],
    },
    health_check_grace_period: {
      type: "number",
      label: "Health Check Grace Period",
      description: "Time (seconds) before evaluating health after a boot",
      defaultValue: 300,
    },
    default_cooldown: {
      type: "number",
      label: "Cooldown Period",
      description: "Time (seconds) before starting another scaling action",
      defaultValue: 300,
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  "launch-template": {
    name: {
      type: "text",
      label: "Template Name",
      description: "The name identifier for this Launch Template",
      required: true,
      placeholder: "my-launch-template",
    },
    image_id: {
      type: "text",
      label: "Image ID (AMI)",
      description: "The AMI ID to launch instances with",
      placeholder: "ami-0c55b159cbfafe1f0",
    },
    instance_type: {
      type: "select",
      label: "Instance Type",
      defaultValue: "t3.micro",
      options: [
        { label: "t3.micro", value: "t3.micro" },
        { label: "t3.small", value: "t3.small" },
        { label: "t3.medium", value: "t3.medium" },
      ],
    },
    key_name: {
      type: "text",
      label: "Key Pair Name",
      placeholder: "my-ssh-key",
    },
    user_data: {
      type: "textarea",
      label: "User Data Script",
      placeholder: "#!/bin/bash\n...",
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  vpc: {
    cidr_block: {
      type: "ip",
      label: "IPv4 CIDR Block",
      description: "The IP range reservation for the VPC network (e.g. 10.0.0.0/16)",
      required: true,
      placeholder: "10.0.0.0/16",
      defaultValue: "10.0.0.0/16",
    },
    enable_dns_support: {
      type: "boolean",
      label: "Enable DNS Support",
      description: "Enables DNS resolution inside the VPC",
      defaultValue: true,
    },
    enable_dns_hostnames: {
      type: "boolean",
      label: "Enable DNS Hostnames",
      description: "Assign public DNS hostnames to public IP instances",
      defaultValue: true,
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: { Environment: "Dev" },
    },
  },

  subnet: {
    cidr_block: {
      type: "ip",
      label: "IPv4 Subnet CIDR",
      description: "The subset IP range allocation (e.g. 10.0.1.0/24)",
      required: true,
      placeholder: "10.0.1.0/24",
      defaultValue: "10.0.1.0/24",
    },
    availability_zone: {
      type: "text",
      label: "Availability Zone",
      description: "The target AWS availability zone (e.g. us-east-1a)",
      placeholder: "us-east-1a",
      defaultValue: "us-east-1a",
    },
    map_public_ip_on_launch: {
      type: "boolean",
      label: "Map Public IP on Launch",
      description: "Automatically assign public IP address to new instances",
      defaultValue: false,
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  "security-group": {
    name: {
      type: "text",
      label: "Security Group Name",
      description: "The name identifier for the stateful firewall group",
      required: true,
      placeholder: "web-sg",
    },
    description: {
      type: "text",
      label: "Description",
      description: "A short description of this firewall scope",
      placeholder: "Allow web traffic",
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  igw: {
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  "nat-gw": {
    connectivity_type: {
      type: "select",
      label: "Connectivity Type",
      description: "Whether this gateway connects to the public internet or private subnets",
      defaultValue: "public",
      options: [
        { label: "Public (Allows public outbound traffic)", value: "public" },
        { label: "Private (Restricted to internal VPC routes)", value: "private" },
      ],
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  "route-table": {
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  eip: {
    domain: {
      type: "select",
      label: "Allocation Domain",
      defaultValue: "vpc",
      options: [{ label: "VPC (Recommended)", value: "vpc" }],
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  alb: {
    name: {
      type: "text",
      label: "Load Balancer Name",
      description: "The name identifier for the Application Load Balancer",
      required: true,
      placeholder: "my-alb",
    },
    internal: {
      type: "boolean",
      label: "Internal Balancer",
      description: "Routes traffic internally without exposing public IPs",
      defaultValue: false,
    },
    listener_port: {
      type: "number",
      label: "Listener Port",
      description: "The port number on which the balancer checks for traffic",
      defaultValue: 80,
    },
    listener_protocol: {
      type: "select",
      label: "Listener Protocol",
      defaultValue: "HTTP",
      options: [
        { label: "HTTP", value: "HTTP" },
        { label: "HTTPS", value: "HTTPS" },
      ],
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  "target-group": {
    name: {
      type: "text",
      label: "Target Group Name",
      required: true,
      placeholder: "my-target-group",
    },
    port: {
      type: "number",
      label: "Target Port",
      description: "The backend target port to forward traffic to",
      required: true,
      defaultValue: 80,
    },
    protocol: {
      type: "select",
      label: "Protocol",
      required: true,
      defaultValue: "HTTP",
      options: [
        { label: "HTTP", value: "HTTP" },
        { label: "HTTPS", value: "HTTPS" },
      ],
    },
    target_type: {
      type: "select",
      label: "Target Type",
      defaultValue: "instance",
      options: [
        { label: "EC2 Instance", value: "instance" },
        { label: "IP Address", value: "ip" },
        { label: "Lambda Function", value: "lambda" },
      ],
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  rds: {
    allocated_storage: {
      type: "number",
      label: "Allocated Storage (GB)",
      description: "Relational database storage capacity in gigabytes",
      required: true,
      defaultValue: 20,
    },
    engine: {
      type: "select",
      label: "Database Engine",
      required: true,
      defaultValue: "postgres",
      options: [
        { label: "PostgreSQL", value: "postgres" },
        { label: "MySQL", value: "mysql" },
        { label: "MariaDB", value: "mariadb" },
      ],
    },
    instance_class: {
      type: "select",
      label: "DB Instance Class",
      required: true,
      defaultValue: "db.t3.micro",
      options: [
        { label: "db.t3.micro (Burstable micro)", value: "db.t3.micro" },
        { label: "db.t3.small (Burstable small)", value: "db.t3.small" },
        { label: "db.t3.medium (Burstable medium)", value: "db.t3.medium" },
      ],
    },
    db_name: {
      type: "text",
      label: "Database Name",
      placeholder: "mydb",
      defaultValue: "mydb",
    },
    username: {
      type: "text",
      label: "Master Username",
      placeholder: "dbadmin",
      defaultValue: "dbadmin",
    },
    publicly_accessible: {
      type: "boolean",
      label: "Publicly Accessible",
      description: "Exposes database endpoint to the public internet",
      defaultValue: false,
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  elasticache: {
    cluster_id: {
      type: "text",
      label: "Cluster ID",
      required: true,
      placeholder: "my-cache-cluster",
    },
    engine: {
      type: "select",
      label: "Engine",
      required: true,
      defaultValue: "redis",
      options: [
        { label: "Redis (In-memory structured storage)", value: "redis" },
        { label: "Memcached (In-memory key-value)", value: "memcached" },
      ],
    },
    node_type: {
      type: "select",
      label: "Cache Node Type",
      required: true,
      defaultValue: "cache.t3.micro",
      options: [
        { label: "cache.t3.micro (Burstable micro)", value: "cache.t3.micro" },
        { label: "cache.t3.small (Burstable small)", value: "cache.t3.small" },
      ],
    },
    num_cache_nodes: {
      type: "number",
      label: "Number of Cache Nodes",
      defaultValue: 1,
    },
    port: {
      type: "number",
      label: "Port Number",
      placeholder: "6379",
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  dynamodb: {
    name: {
      type: "text",
      label: "Table Name",
      required: true,
      placeholder: "my-table",
    },
    billing_mode: {
      type: "select",
      label: "Billing Mode",
      defaultValue: "PAY_PER_REQUEST",
      options: [
        { label: "On-Demand (Pay-per-request)", value: "PAY_PER_REQUEST" },
        { label: "Provisioned Capacity", value: "PROVISIONED" },
      ],
    },
    hash_key: {
      type: "text",
      label: "Partition Key (Hash Key)",
      required: true,
      placeholder: "id",
      defaultValue: "id",
    },
    range_key: {
      type: "text",
      label: "Sort Key (Range Key)",
      placeholder: "timestamp",
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  s3: {
    bucket: {
      type: "text",
      label: "S3 Bucket Name",
      description: "Globally unique bucket identifier naming",
      required: true,
      placeholder: "my-unique-bucket-name",
    },
    versioning_enabled: {
      type: "boolean",
      label: "Enable Versioning",
      description: "Allows recovery of overwritten or deleted object templates",
      defaultValue: false,
    },
    acl: {
      type: "select",
      label: "Access Control List (ACL)",
      defaultValue: "private",
      options: [
        { label: "Private (Default secure block)", value: "private" },
        { label: "Public Read (Asset hosting)", value: "public-read" },
      ],
    },
    block_public_access: {
      type: "boolean",
      label: "Block Public Access",
      description: "Enforces strict access locks on S3 objects",
      defaultValue: true,
    },
    force_destroy: {
      type: "boolean",
      label: "Force Destroy",
      description: "Allows S3 deletion even if bucket objects exist",
      defaultValue: false,
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  "iam-role": {
    name: {
      type: "text",
      label: "Role Name",
      required: true,
      placeholder: "my-iam-role",
    },
    assume_role_policy: {
      type: "code",
      label: "Assume Role JSON Policy",
      description: "JSON defining which identities can assume this role",
      required: true,
      placeholder: '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Action": "sts:AssumeRole",\n      "Principal": {\n        "Service": "ec2.amazonaws.com"\n      },\n      "Effect": "Allow"\n    }\n  ]\n}',
      defaultValue: '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Action": "sts:AssumeRole",\n      "Principal": {\n        "Service": "ec2.amazonaws.com"\n      },\n      "Effect": "Allow"\n    }\n  ]\n}',
    },
    description: {
      type: "text",
      label: "Description",
      placeholder: "Allows access to AWS APIs",
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  "iam-policy": {
    name: {
      type: "text",
      label: "Policy Name",
      required: true,
      placeholder: "my-iam-policy",
    },
    policy_document: {
      type: "code",
      label: "Policy JSON Document",
      description: "JSON specification of allowed API actions",
      required: true,
      placeholder: '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": "s3:ListAllMyBuckets",\n      "Resource": "*"\n    }\n  ]\n}',
      defaultValue: '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": [\n        "s3:GetObject"\n      ],\n      "Resource": "*"\n    }\n  ]\n}',
    },
    description: {
      type: "text",
      label: "Description",
      placeholder: "Grants read access to S3 objects",
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  lambda: {
    function_name: {
      type: "text",
      label: "Function Name",
      required: true,
      placeholder: "my-lambda-function",
    },
    runtime: {
      type: "select",
      label: "Lambda Runtime",
      required: true,
      defaultValue: "nodejs18.x",
      options: [
        { label: "Node.js 20.x", value: "nodejs20.x" },
        { label: "Node.js 18.x", value: "nodejs18.x" },
        { label: "Python 3.10", value: "python3.10" },
        { label: "Python 3.9", value: "python3.9" },
      ],
    },
    handler: {
      type: "text",
      label: "Handler Name",
      required: true,
      defaultValue: "index.handler",
      placeholder: "index.handler",
    },
    memory_size: {
      type: "number",
      label: "Memory Limit (MB)",
      defaultValue: 128,
    },
    timeout: {
      type: "number",
      label: "Timeout (seconds)",
      defaultValue: 3,
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  "api-gateway": {
    name: {
      type: "text",
      label: "API Gateway Name",
      required: true,
      placeholder: "my-http-api",
    },
    protocol_type: {
      type: "select",
      label: "Protocol Type",
      required: true,
      defaultValue: "HTTP",
      options: [
        { label: "HTTP (Serverless APIs)", value: "HTTP" },
        { label: "WEBSOCKET (Stateful connections)", value: "WEBSOCKET" },
      ],
    },
    stage_name: {
      type: "text",
      label: "Stage Name",
      defaultValue: "$default",
      placeholder: "$default",
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  route53: {
    name: {
      type: "text",
      label: "Domain Name",
      description: "Target hosted zone domain name (e.g. example.com)",
      required: true,
      placeholder: "example.com",
    },
    is_private: {
      type: "boolean",
      label: "Private Hosted Zone",
      description: "Restricts routing triggers inside VPC boundaries",
      defaultValue: false,
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },

  cloudfront: {
    enabled: {
      type: "boolean",
      label: "Distribution Active",
      defaultValue: true,
    },
    is_ipv6_enabled: {
      type: "boolean",
      label: "IPv6 Enabled",
      defaultValue: false,
    },
    viewer_protocol_policy: {
      type: "select",
      label: "Viewer Protocol Policy",
      defaultValue: "redirect-to-https",
      options: [
        { label: "Allow All", value: "allow-all" },
        { label: "Redirect HTTP to HTTPS", value: "redirect-to-https" },
        { label: "HTTPS Only", value: "https-only" },
      ],
    },
    tags: {
      type: "key-value",
      label: "Resource Tags",
      defaultValue: {},
    },
  },
};
