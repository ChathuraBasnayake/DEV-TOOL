import type { AWSResourceType } from '../types/canvas';

export const VALID_CONNECTIONS: Record<AWSResourceType, AWSResourceType[]> = {
  // Compute
  'ec2':              ['rds', 's3'],
  'asg':              ['subnet', 'target-group'],
  'launch-template':  ['asg'],

  // Networking
  'vpc':              ['subnet', 'security-group', 'igw', 'route-table'],
  'subnet':           ['ec2', 'rds', 'alb', 'nat-gw', 'elasticache', 'lambda'],
  'security-group':   ['ec2', 'rds', 'alb', 'elasticache', 'lambda'],
  'igw':              ['route-table'],
  'nat-gw':           ['route-table'],
  'route-table':      ['subnet'],
  'eip':              ['nat-gw'],

  // Load Balancing
  'alb':              ['target-group'],
  'target-group':     ['ec2', 'lambda'],

  // Database (terminal — no outbound)
  'rds':              [],
  'elasticache':      [],
  'dynamodb':         [],

  // Storage (terminal)
  's3':               [],

  // Security
  'iam-role':         ['ec2', 'lambda'],
  'iam-policy':       ['iam-role'],

  // Serverless
  'lambda':           ['dynamodb', 's3', 'rds'],
  'api-gateway':      ['lambda'],

  // DNS & CDN
  'route53':          ['alb', 'cloudfront'],
  'cloudfront':       ['s3', 'alb'],
};

export const EDGE_LABELS: Record<string, { label: string; terraformEffect: string }> = {
  'vpc->subnet':              { label: 'contains',      terraformEffect: 'vpc_id reference' },
  'vpc->security-group':      { label: 'scopes',        terraformEffect: 'vpc_id reference' },
  'vpc->igw':                 { label: 'attached',       terraformEffect: 'vpc_id reference' },
  'vpc->route-table':         { label: 'contains',      terraformEffect: 'vpc_id reference' },
  'subnet->ec2':              { label: 'hosts',          terraformEffect: 'subnet_id reference' },
  'subnet->rds':              { label: 'hosts',          terraformEffect: 'db_subnet_group' },
  'subnet->alb':              { label: 'hosts',          terraformEffect: 'subnets[] reference' },
  'subnet->nat-gw':           { label: 'hosts',          terraformEffect: 'subnet_id reference' },
  'subnet->elasticache':      { label: 'hosts',          terraformEffect: 'subnet_group' },
  'subnet->lambda':           { label: 'vpc config',     terraformEffect: 'vpc_config.subnet_ids[]' },
  'route-table->subnet':      { label: 'associated',     terraformEffect: 'aws_route_table_association' },
  'security-group->ec2':      { label: 'applies to',     terraformEffect: 'vpc_security_group_ids[]' },
  'security-group->rds':      { label: 'applies to',     terraformEffect: 'vpc_security_group_ids[]' },
  'security-group->alb':      { label: 'applies to',     terraformEffect: 'security_groups[]' },
  'security-group->elasticache': { label: 'applies to',  terraformEffect: 'security_group_ids[]' },
  'security-group->lambda':   { label: 'applies to',     terraformEffect: 'vpc_config.security_group_ids[]' },
  'eip->nat-gw':              { label: 'assigned',       terraformEffect: 'allocation_id reference' },
  'nat-gw->route-table':      { label: 'default route',  terraformEffect: 'Route 0.0.0.0/0 → NAT GW' },
  'igw->route-table':         { label: 'default route',  terraformEffect: 'Route 0.0.0.0/0 → IGW' },
  'alb->target-group':        { label: 'routes to',      terraformEffect: 'default_action.target_group_arn' },
  'target-group->ec2':        { label: 'registers',      terraformEffect: 'aws_lb_target_group_attachment' },
  'target-group->lambda':     { label: 'registers',      terraformEffect: 'aws_lb_target_group_attachment' },
  'launch-template->asg':     { label: 'defines',        terraformEffect: 'launch_template block' },
  'asg->subnet':              { label: 'spans',          terraformEffect: 'vpc_zone_identifier[]' },
  'asg->target-group':        { label: 'registers',      terraformEffect: 'target_group_arns[]' },
  'iam-role->ec2':            { label: 'assumes',        terraformEffect: 'iam_instance_profile' },
  'iam-role->lambda':         { label: 'assumes',        terraformEffect: 'role ARN reference' },
  'iam-policy->iam-role':     { label: 'attaches',       terraformEffect: 'aws_iam_role_policy_attachment' },
  'api-gateway->lambda':      { label: 'invokes',        terraformEffect: 'Lambda integration' },
  'route53->alb':             { label: 'routes to',      terraformEffect: 'Alias record → ALB DNS' },
  'route53->cloudfront':      { label: 'routes to',      terraformEffect: 'Alias record → CF domain' },
  'cloudfront->s3':           { label: 'origin',         terraformEffect: 'S3 origin config' },
  'cloudfront->alb':          { label: 'origin',         terraformEffect: 'Custom origin config' },
  'ec2->rds':                 { label: 'connects to',    terraformEffect: 'Informational' },
  'ec2->s3':                  { label: 'reads/writes',   terraformEffect: 'Informational (needs IAM)' },
  'lambda->dynamodb':         { label: 'reads/writes',   terraformEffect: 'Informational (needs IAM)' },
  'lambda->s3':               { label: 'reads/writes',   terraformEffect: 'Informational (needs IAM)' },
  'lambda->rds':              { label: 'queries',        terraformEffect: 'Informational' },
};

export function isValidAWSConnection(
  sourceType: AWSResourceType,
  targetType: AWSResourceType
): boolean {
  return VALID_CONNECTIONS[sourceType]?.includes(targetType) ?? false;
}

export function getEdgeLabel(
  sourceType: AWSResourceType,
  targetType: AWSResourceType
): { label: string; terraformEffect: string } | null {
  const key = `${sourceType}->${targetType}`;
  return EDGE_LABELS[key] || null;
}
