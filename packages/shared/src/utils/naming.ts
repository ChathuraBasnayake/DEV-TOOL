export function toTerraformName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

export function toNodeId(type: string, suffix: string): string {
  return `${type}-${suffix}`;
}

export function getDefaultLabel(type: string): string {
  const labels: Record<string, string> = {
    'ec2': 'EC2 Instance',
    'asg': 'Auto Scaling Group',
    'launch-template': 'Launch Template',
    'vpc': 'VPC',
    'subnet': 'Subnet',
    'security-group': 'Security Group',
    'igw': 'Internet Gateway',
    'nat-gw': 'NAT Gateway',
    'route-table': 'Route Table',
    'eip': 'Elastic IP',
    'alb': 'Application LB',
    'target-group': 'Target Group',
    'rds': 'RDS Database',
    'elasticache': 'ElastiCache',
    'dynamodb': 'DynamoDB Table',
    's3': 'S3 Bucket',
    'iam-role': 'IAM Role',
    'iam-policy': 'IAM Policy',
    'lambda': 'Lambda Function',
    'api-gateway': 'API Gateway',
    'route53': 'Route 53',
    'cloudfront': 'CloudFront',
  };
  return labels[type] || type;
}
