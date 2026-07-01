import { BaseGenerator } from './base.generator';
import { EC2Generator } from './ec2.generator';
import { ASGGenerator } from './asg.generator';
import { LaunchTemplateGenerator } from './launch-template.generator';
import { VPCGenerator } from './vpc.generator';
import { SubnetGenerator } from './subnet.generator';
import { SecurityGroupGenerator } from './sg.generator';
import { IGWGenerator } from './igw.generator';
import { NATGWGenerator } from './nat-gw.generator';
import { RouteTableGenerator } from './route-table.generator';
import { EIPGenerator } from './eip.generator';
import { ALBGenerator } from './alb.generator';
import { TargetGroupGenerator } from './target-group.generator';
import { RDSGenerator } from './rds.generator';
import { ElastiCacheGenerator } from './elasticache.generator';
import { DynamoDBGenerator } from './dynamodb.generator';
import { S3Generator } from './s3.generator';
import { IAMRoleGenerator } from './iam-role.generator';
import { IAMPolicyGenerator } from './iam-policy.generator';
import { LambdaGenerator } from './lambda.generator';
import { APIGatewayGenerator } from './api-gateway.generator';
import { Route53Generator } from './route53.generator';
import { CloudFrontGenerator } from './cloudfront.generator';

export * from './base.generator';
export * from './synthetic.generator';

export const GENERATORS: Record<string, BaseGenerator> = {
  'ec2': new EC2Generator(),
  'asg': new ASGGenerator(),
  'launch-template': new LaunchTemplateGenerator(),
  'vpc': new VPCGenerator(),
  'subnet': new SubnetGenerator(),
  'security-group': new SecurityGroupGenerator(),
  'igw': new IGWGenerator(),
  'nat-gw': new NATGWGenerator(),
  'route-table': new RouteTableGenerator(),
  'eip': new EIPGenerator(),
  'alb': new ALBGenerator(),
  'target-group': new TargetGroupGenerator(),
  'rds': new RDSGenerator(),
  'elasticache': new ElastiCacheGenerator(),
  'dynamodb': new DynamoDBGenerator(),
  's3': new S3Generator(),
  'iam-role': new IAMRoleGenerator(),
  'iam-policy': new IAMPolicyGenerator(),
  'lambda': new LambdaGenerator(),
  'api-gateway': new APIGatewayGenerator(),
  'route53': new Route53Generator(),
  'cloudfront': new CloudFrontGenerator(),
};
