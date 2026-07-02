import { EC2Node, ASGNode, LaunchTemplateNode } from "./ComputeNodes";
import {
  VPCNode,
  SubnetNode,
  IGWNode,
  NATGatewayNode,
  RouteTableNode,
  EIPNode,
} from "./NetworkNodes";
import { SecurityGroupNode } from "./SecurityGroupNodes";
import { ALBNode, TargetGroupNode } from "./LoadBalancerNodes";
import { RDSNode, ElastiCacheNode, DynamoDBNode } from "./DatabaseNodes";
import { S3Node } from "./StorageNodes";
import { IAMRoleNode, IAMPolicyNode } from "./SecurityNodes";
import { LambdaNode, APIGatewayNode } from "./ServerlessNodes";
import { Route53Node, CloudFrontNode } from "./DnsCdnNodes";

/**
 * Registry mapping AWS resource type strings to custom node components
 * for native React Flow visual execution.
 */
export const nodeTypes = {
  ec2: EC2Node,
  asg: ASGNode,
  "launch-template": LaunchTemplateNode,
  vpc: VPCNode,
  subnet: SubnetNode,
  "security-group": SecurityGroupNode,
  igw: IGWNode,
  "nat-gw": NATGatewayNode,
  "route-table": RouteTableNode,
  eip: EIPNode,
  alb: ALBNode,
  "target-group": TargetGroupNode,
  rds: RDSNode,
  elasticache: ElastiCacheNode,
  dynamodb: DynamoDBNode,
  s3: S3Node,
  "iam-role": IAMRoleNode,
  "iam-policy": IAMPolicyNode,
  lambda: LambdaNode,
  "api-gateway": APIGatewayNode,
  route53: Route53Node,
  cloudfront: CloudFrontNode,
};
