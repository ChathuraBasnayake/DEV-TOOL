import type { AWSConfig } from './aws';

export type AWSResourceType =
  | 'ec2'
  | 'asg'
  | 'launch-template'
  | 'vpc'
  | 'subnet'
  | 'security-group'
  | 'igw'
  | 'nat-gw'
  | 'route-table'
  | 'eip'
  | 'alb'
  | 'target-group'
  | 'rds'
  | 'elasticache'
  | 'dynamodb'
  | 's3'
  | 'iam-role'
  | 'iam-policy'
  | 'lambda'
  | 'api-gateway'
  | 'route53'
  | 'cloudfront';

export type NodeStatus = 'unconfigured' | 'configured' | 'warning' | 'error';

export interface CanvasNodeData {
  label: string;
  resourceType: AWSResourceType;
  config: AWSConfig;
  status: NodeStatus;
  terraformName?: string;
}

export interface CanvasNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: CanvasNodeData;
}

export interface CanvasEdgeData {
  relationship: string;
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  data?: CanvasEdgeData;
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: CanvasViewport;
}
