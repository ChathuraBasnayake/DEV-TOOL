import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, CanvasEdge, TerraformReference, AWSResourceType } from '@canvascloud/shared';

export const REF_MAP: Record<string, { field: string; ref: string }> = {
  // Networking
  'vpc->subnet':           { field: 'vpc_id',                    ref: 'aws_vpc.{source}.id' },
  'vpc->security-group':   { field: 'vpc_id',                    ref: 'aws_vpc.{source}.id' },
  'vpc->igw':              { field: 'vpc_id',                    ref: 'aws_vpc.{source}.id' },
  'vpc->route-table':      { field: 'vpc_id',                    ref: 'aws_vpc.{source}.id' },

  // Subnet placements
  'subnet->ec2':           { field: 'subnet_id',                 ref: 'aws_subnet.{source}.id' },
  'subnet->rds':           { field: 'db_subnet_group',           ref: 'aws_subnet.{source}.id' },
  'subnet->alb':           { field: 'subnets',                   ref: 'aws_subnet.{source}.id' },
  'subnet->nat-gw':        { field: 'subnet_id',                 ref: 'aws_subnet.{source}.id' },
  'subnet->elasticache':   { field: 'subnet_group',              ref: 'aws_subnet.{source}.id' },
  'subnet->lambda':        { field: 'vpc_config.subnet_ids',     ref: 'aws_subnet.{source}.id' },

  // Security groups
  'security-group->ec2':         { field: 'vpc_security_group_ids',          ref: 'aws_security_group.{source}.id' },
  'security-group->rds':         { field: 'vpc_security_group_ids',          ref: 'aws_security_group.{source}.id' },
  'security-group->alb':         { field: 'security_groups',                 ref: 'aws_security_group.{source}.id' },
  'security-group->elasticache': { field: 'security_group_ids',              ref: 'aws_security_group.{source}.id' },
  'security-group->lambda':      { field: 'vpc_config.security_group_ids',   ref: 'aws_security_group.{source}.id' },

  // Routing
  'eip->nat-gw':           { field: 'allocation_id',             ref: 'aws_eip.{source}.id' },
  'route-table->subnet':   { field: '__synthetic__',             ref: 'aws_route_table_association' },
  'igw->route-table':      { field: '__synthetic__',             ref: 'aws_route (igw)' },
  'nat-gw->route-table':   { field: '__synthetic__',             ref: 'aws_route (nat)' },

  // Load balancing
  'alb->target-group':     { field: '__synthetic__',             ref: 'aws_lb_listener' },
  'target-group->ec2':     { field: '__synthetic__',             ref: 'aws_lb_target_group_attachment' },
  'target-group->lambda':  { field: '__synthetic__',             ref: 'aws_lb_target_group_attachment' },

  // Scaling
  'launch-template->asg':  { field: 'launch_template',           ref: 'aws_launch_template.{source}.id' },
  'asg->subnet':           { field: 'vpc_zone_identifier',       ref: 'aws_subnet.{target}.id' },
  'asg->target-group':     { field: 'target_group_arns',         ref: 'aws_lb_target_group.{target}.arn' },

  // IAM
  'iam-role->ec2':         { field: '__synthetic__',             ref: 'aws_iam_instance_profile' },
  'iam-role->lambda':      { field: 'role',                      ref: 'aws_iam_role.{source}.arn' },
  'iam-policy->iam-role':  { field: '__synthetic__',             ref: 'aws_iam_role_policy_attachment' },

  // Serverless
  'api-gateway->lambda':   { field: '__synthetic__',             ref: 'aws_apigatewayv2_integration' },

  // DNS & CDN
  'route53->alb':          { field: '__synthetic__',             ref: 'aws_route53_record (alias)' },
  'route53->cloudfront':   { field: '__synthetic__',             ref: 'aws_route53_record (alias)' },
  'cloudfront->s3':        { field: 'origin.domain_name',        ref: 'aws_s3_bucket.{target}.bucket_regional_domain_name' },
  'cloudfront->alb':       { field: 'origin.domain_name',        ref: 'aws_lb.{target}.dns_name' },

  // Informational
  'ec2->rds':              { field: '__informational__',         ref: 'informational' },
  'ec2->s3':               { field: '__informational__',         ref: 'informational' },
  'lambda->dynamodb':      { field: '__informational__',         ref: 'informational' },
  'lambda->s3':            { field: '__informational__',         ref: 'informational' },
  'lambda->rds':           { field: '__informational__',         ref: 'informational' },
};

export function resolveReferences(
  nodes: CanvasNode[],
  edges: CanvasEdge[],
): TerraformReference[] {
  const nodeMap = new Map<string, CanvasNode>(nodes.map((n) => [n.id, n]));
  const references: TerraformReference[] = [];

  for (const edge of edges) {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    if (!sourceNode || !targetNode) continue;

    const key = `${sourceNode.data.resourceType}->${targetNode.data.resourceType}`;
    const refConfig = REF_MAP[key];
    if (!refConfig) continue;

    const sourceName = toTerraformName(sourceNode.data.label || sourceNode.id);
    const targetName = toTerraformName(targetNode.data.label || targetNode.id);

    // Resolve template expressions like {source} and {target}
    const terraformExpression = refConfig.ref
      .replace('{source}', sourceName)
      .replace('{target}', targetName);

    const isSynthetic = refConfig.field === '__synthetic__';

    references.push({
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
      terraformField: refConfig.field,
      terraformExpression,
      isSynthetic,
    });
  }

  return references;
}
