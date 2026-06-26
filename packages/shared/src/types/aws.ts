export interface EC2Config {
  ami: string;                          // Required
  instance_type: string;                // Required — e.g., "t3.micro"
  key_name?: string;
  subnet_id?: string;                   // Auto-filled from edge
  vpc_security_group_ids?: string[];    // Auto-filled from edges
  associate_public_ip_address?: boolean;
  root_block_device?: {
    volume_size?: number;
    volume_type?: string;               // "gp2" | "gp3" | "io1" | "io2"
    encrypted?: boolean;
    delete_on_termination?: boolean;
  };
  user_data?: string;
  tags?: Record<string, string>;
}

export interface ASGConfig {
  name: string;                         // Required
  min_size: number;                     // Required
  max_size: number;                     // Required
  desired_capacity?: number;
  launch_template_id?: string;          // Auto-filled from edge
  launch_template_version?: string;
  vpc_zone_identifier?: string[];       // Auto-filled from edges
  health_check_type?: string;           // "EC2" | "ELB"
  health_check_grace_period?: number;
  target_group_arns?: string[];         // Auto-filled from edges
  default_cooldown?: number;
  tags?: Record<string, string>;
}

export interface LaunchTemplateConfig {
  name: string;                         // Required
  image_id?: string;
  instance_type?: string;
  key_name?: string;
  vpc_security_group_ids?: string[];
  block_device_mappings?: {
    device_name?: string;
    ebs?: { volume_size?: number; volume_type?: string; encrypted?: boolean };
  };
  user_data?: string;
  iam_instance_profile_name?: string;
  tags?: Record<string, string>;
}

export interface VPCConfig {
  cidr_block: string;                   // Required — e.g., "10.0.0.0/16"
  enable_dns_support?: boolean;
  enable_dns_hostnames?: boolean;
  tags?: Record<string, string>;
}

export interface SubnetConfig {
  vpc_id?: string;                      // Auto-filled
  cidr_block: string;                   // Required
  availability_zone?: string;
  map_public_ip_on_launch?: boolean;
  tags?: Record<string, string>;
}

export interface SGRule {
  from_port: number;
  to_port: number;
  protocol: string;                     // "tcp" | "udp" | "icmp" | "-1"
  cidr_blocks?: string[];
  description?: string;
}

export interface SecurityGroupConfig {
  name: string;                         // Required
  description?: string;
  vpc_id?: string;                      // Auto-filled
  ingressRules?: SGRule[];
  egressRules?: SGRule[];
  tags?: Record<string, string>;
}

export interface IGWConfig {
  vpc_id?: string;                      // Auto-filled
  tags?: Record<string, string>;
}

export interface NATGWConfig {
  allocation_id?: string;               // Auto-filled from EIP edge
  subnet_id?: string;                   // Auto-filled from Subnet edge
  connectivity_type?: string;           // "public" | "private"
  tags?: Record<string, string>;
}

export interface RouteEntry {
  cidr_block: string;
  gateway_id?: string;
  nat_gateway_id?: string;
}

export interface RouteTableConfig {
  vpc_id?: string;                      // Auto-filled
  routes?: RouteEntry[];
  tags?: Record<string, string>;
}

export interface EIPConfig {
  domain?: string;                      // "vpc"
  tags?: Record<string, string>;
}

export interface ALBConfig {
  name: string;                         // Required
  internal?: boolean;
  load_balancer_type?: string;          // "application"
  subnets?: string[];                   // Auto-filled
  security_groups?: string[];           // Auto-filled
  listener_port?: number;
  listener_protocol?: string;           // "HTTP" | "HTTPS"
  certificate_arn?: string;
  tags?: Record<string, string>;
}

export interface TargetGroupConfig {
  name: string;                         // Required
  port: number;                         // Required
  protocol: string;                     // Required — "HTTP" | "HTTPS"
  vpc_id?: string;
  target_type?: string;                 // "instance" | "ip" | "lambda"
  health_check?: {
    path?: string;
    port?: string;
    protocol?: string;
    healthy_threshold?: number;
    unhealthy_threshold?: number;
    interval?: number;
  };
  tags?: Record<string, string>;
}

export interface RDSConfig {
  allocated_storage: number;            // Required
  engine: string;                       // Required — "mysql" | "postgres" | "mariadb"
  engine_version?: string;
  instance_class: string;               // Required
  db_name?: string;
  username?: string;                    // → variable
  password?: string;                    // → variable
  publicly_accessible?: boolean;
  vpc_security_group_ids?: string[];
  db_subnet_group_name?: string;
  storage_type?: string;
  storage_encrypted?: boolean;
  multi_az?: boolean;
  backup_retention_period?: number;
  skip_final_snapshot?: boolean;
  tags?: Record<string, string>;
}

export interface ElastiCacheConfig {
  cluster_id: string;                   // Required
  engine: string;                       // Required — "redis" | "memcached"
  engine_version?: string;
  node_type: string;                    // Required
  num_cache_nodes?: number;
  subnet_group_name?: string;
  security_group_ids?: string[];
  port?: number;
  snapshot_retention_limit?: number;
  at_rest_encryption_enabled?: boolean;
  transit_encryption_enabled?: boolean;
  tags?: Record<string, string>;
}

export interface DynamoDBConfig {
  name: string;                         // Required
  billing_mode: string;                 // "PROVISIONED" | "PAY_PER_REQUEST"
  hash_key: string;                     // Required
  range_key?: string;
  attributes: { name: string; type: string }[];  // "S" | "N" | "B"
  read_capacity?: number;
  write_capacity?: number;
  server_side_encryption?: boolean;
  stream_enabled?: boolean;
  stream_view_type?: string;
  point_in_time_recovery?: boolean;
  tags?: Record<string, string>;
}

export interface S3Config {
  bucket: string;                       // Required
  versioning_enabled?: boolean;
  sse_algorithm?: string;
  acl?: string;                         // "private" | "public-read"
  block_public_access?: boolean;
  force_destroy?: boolean;
  website_index_document?: string;
  website_error_document?: string;
  cors_enabled?: boolean;
  cors_allowed_origins?: string[];
  tags?: Record<string, string>;
}

export interface IAMRoleConfig {
  name: string;                         // Required
  assume_role_policy: string;           // Required — JSON
  description?: string;
  path?: string;
  max_session_duration?: number;
  tags?: Record<string, string>;
}

export interface IAMPolicyConfig {
  name: string;                         // Required
  policy_document: string;              // Required — JSON
  description?: string;
  path?: string;
  tags?: Record<string, string>;
}

export interface LambdaConfig {
  function_name: string;                // Required
  runtime: string;                      // Required
  handler: string;                      // Required
  role?: string;                        // Auto-filled from IAM Role edge
  filename?: string;
  s3_bucket?: string;
  s3_key?: string;
  memory_size?: number;
  timeout?: number;
  environment_variables?: Record<string, string>;
  vpc_config?: {
    subnet_ids?: string[];
    security_group_ids?: string[];
  };
  layers?: string[];
  tags?: Record<string, string>;
}

export interface APIGatewayConfig {
  name: string;                         // Required
  protocol_type: string;                // Required — "HTTP" | "WEBSOCKET"
  description?: string;
  cors_enabled?: boolean;
  cors_allow_origins?: string[];
  cors_allow_methods?: string[];
  cors_allow_headers?: string[];
  stage_name?: string;
  auto_deploy?: boolean;
  tags?: Record<string, string>;
}

export interface Route53Config {
  name: string;                         // Required — domain name
  comment?: string;
  is_private?: boolean;
  vpc_id?: string;
  tags?: Record<string, string>;
}

export interface CloudFrontConfig {
  origin_domain_name?: string;          // Auto-filled from edges
  origin_type?: string;                 // "s3" | "custom"
  enabled?: boolean;
  is_ipv6_enabled?: boolean;
  viewer_protocol_policy?: string;
  allowed_methods?: string[];
  cached_methods?: string[];
  aliases?: string[];
  acm_certificate_arn?: string;
  minimum_protocol_version?: string;
  default_root_object?: string;
  price_class?: string;
  web_acl_id?: string;
  tags?: Record<string, string>;
}

export type AWSConfig =
  | EC2Config
  | ASGConfig
  | LaunchTemplateConfig
  | VPCConfig
  | SubnetConfig
  | SecurityGroupConfig
  | IGWConfig
  | NATGWConfig
  | RouteTableConfig
  | EIPConfig
  | ALBConfig
  | TargetGroupConfig
  | RDSConfig
  | ElastiCacheConfig
  | DynamoDBConfig
  | S3Config
  | IAMRoleConfig
  | IAMPolicyConfig
  | LambdaConfig
  | APIGatewayConfig
  | Route53Config
  | CloudFrontConfig;
