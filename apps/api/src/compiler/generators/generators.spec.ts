import { GENERATORS } from './index';
import type { CanvasNode, TerraformReference } from '@canvascloud/shared';

describe('AWS Resource Generators', () => {
  describe('VPC Generator', () => {
    it('should generate basic VPC HCL', () => {
      const node: CanvasNode = {
        id: 'vpc-1',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: 'Production VPC',
          status: 'configured',
          config: {
            cidr_block: '10.0.0.0/16',
            enable_dns_support: true,
            enable_dns_hostnames: true,
            tags: { Environment: 'production' },
          },
        },
      };

      const hcl = GENERATORS.vpc.generate(node, []);
      expect(hcl).toContain('resource "aws_vpc" "production_vpc" {');
      expect(hcl).toContain('cidr_block = "10.0.0.0/16"');
      expect(hcl).toContain('enable_dns_support = true');
      expect(hcl).toContain('enable_dns_hostnames = true');
      expect(hcl).toContain('Environment = "production"');
      expect(hcl).toContain('Name = "Production VPC"');
    });
  });

  describe('Subnet Generator', () => {
    it('should generate Subnet HCL resolving vpc_id from reference', () => {
      const node: CanvasNode = {
        id: 'subnet-1',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'subnet',
          label: 'Public Subnet A',
          status: 'configured',
          config: {
            cidr_block: '10.0.1.0/24',
            availability_zone: 'us-east-1a',
            map_public_ip_on_launch: true,
          },
        },
      };

      const refs: TerraformReference[] = [
        {
          sourceNodeId: 'vpc-1',
          targetNodeId: 'subnet-1',
          terraformField: 'vpc_id',
          terraformExpression: 'aws_vpc.production_vpc.id',
          isSynthetic: false,
        },
      ];

      const hcl = GENERATORS.subnet.generate(node, refs);
      expect(hcl).toContain('resource "aws_subnet" "public_subnet_a" {');
      expect(hcl).toContain('vpc_id            = aws_vpc.production_vpc.id');
      expect(hcl).toContain('cidr_block        = "10.0.1.0/24"');
      expect(hcl).toContain('availability_zone = "us-east-1a"');
      expect(hcl).toContain('map_public_ip_on_launch = true');
    });
  });

  describe('Security Group Generator', () => {
    it('should generate Security Group HCL with ingress and default egress', () => {
      const node: CanvasNode = {
        id: 'sg-1',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'security-group',
          label: 'Web SG',
          status: 'configured',
          config: {
            name: 'web-sg',
            description: 'Allow HTTP',
            ingressRules: [
              {
                from_port: 80,
                to_port: 80,
                protocol: 'tcp',
                cidr_blocks: ['0.0.0.0/0'],
                description: 'HTTP ingress',
              },
            ],
          },
        },
      };

      const hcl = GENERATORS['security-group'].generate(node, []);
      expect(hcl).toContain('resource "aws_security_group" "web_sg" {');
      expect(hcl).toContain('name        = "web-sg"');
      expect(hcl).toContain('description = "Allow HTTP"');
      expect(hcl).toContain('ingress {');
      expect(hcl).toContain('from_port   = 80');
      expect(hcl).toContain('protocol    = "tcp"');
      expect(hcl).toContain('cidr_blocks = ["0.0.0.0/0"]');
      expect(hcl).toContain('egress {');
      expect(hcl).toContain('protocol    = "-1"');
    });
  });

  describe('EC2 Generator', () => {
    it('should generate EC2 HCL resolving subnet and security group references', () => {
      const node: CanvasNode = {
        id: 'ec2-1',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'ec2',
          label: 'WebServer',
          status: 'configured',
          config: {
            ami: 'ami-12345678',
            instance_type: 't3.micro',
            root_block_device: {
              volume_size: 30,
              volume_type: 'gp3',
              encrypted: true,
            },
          },
        },
      };

      const refs: TerraformReference[] = [
        {
          sourceNodeId: 'subnet-1',
          targetNodeId: 'ec2-1',
          terraformField: 'subnet_id',
          terraformExpression: 'aws_subnet.public_subnet_a.id',
          isSynthetic: false,
        },
        {
          sourceNodeId: 'sg-1',
          targetNodeId: 'ec2-1',
          terraformField: 'vpc_security_group_ids',
          terraformExpression: 'aws_security_group.web_sg.id',
          isSynthetic: false,
        },
      ];

      const hcl = GENERATORS.ec2.generate(node, refs);
      expect(hcl).toContain('resource "aws_instance" "webserver" {');
      expect(hcl).toContain('ami           = "ami-12345678"');
      expect(hcl).toContain('instance_type = "t3.micro"');
      expect(hcl).toContain('subnet_id     = aws_subnet.public_subnet_a.id');
      expect(hcl).toContain(
        'vpc_security_group_ids = [aws_security_group.web_sg.id]',
      );
      expect(hcl).toContain('root_block_device {');
      expect(hcl).toContain('volume_size = 30');
      expect(hcl).toContain('volume_type = "gp3"');
      expect(hcl).toContain('encrypted   = true');
    });
  });

  describe('S3 Generator', () => {
    it('should generate S3 Bucket and versioning resources', () => {
      const node: CanvasNode = {
        id: 's3-1',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 's3',
          label: 'Static Assets',
          status: 'configured',
          config: {
            bucket: 'my-unique-static-assets-bucket',
            versioning_enabled: true,
            force_destroy: true,
          },
        },
      };

      const hcl = GENERATORS.s3.generate(node, []);
      expect(hcl).toContain('resource "aws_s3_bucket" "static_assets" {');
      expect(hcl).toContain('bucket        = "my-unique-static-assets-bucket"');
      expect(hcl).toContain('force_destroy = true');
      expect(hcl).toContain(
        'resource "aws_s3_bucket_versioning" "static_assets_versioning" {',
      );
      expect(hcl).toContain('status = "Enabled"');
    });
  });

  describe('Lambda Generator', () => {
    it('should generate Lambda Function HCL with environmental variables', () => {
      const node: CanvasNode = {
        id: 'lambda-1',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'lambda',
          label: 'My Lambda',
          status: 'configured',
          config: {
            function_name: 'my-function',
            runtime: 'python3.9',
            handler: 'lambda_function.lambda_handler',
            timeout: 30,
            environment_variables: {
              ENV: 'production',
              DB_HOST: 'rds.endpoint',
            },
          },
        },
      };

      const refs: TerraformReference[] = [
        {
          sourceNodeId: 'role-1',
          targetNodeId: 'lambda-1',
          terraformField: 'role',
          terraformExpression: 'aws_iam_role.my_role.arn',
          isSynthetic: false,
        },
      ];

      const hcl = GENERATORS.lambda.generate(node, refs);
      expect(hcl).toContain('resource "aws_lambda_function" "my_lambda" {');
      expect(hcl).toContain('function_name = "my-function"');
      expect(hcl).toContain('runtime       = "python3.9"');
      expect(hcl).toContain('role          = aws_iam_role.my_role.arn');
      expect(hcl).toContain('timeout       = 30');
      expect(hcl).toContain('environment {');
      expect(hcl).toContain('ENV = "production"');
      expect(hcl).toContain('DB_HOST = "rds.endpoint"');
    });
  });

  describe('CloudFront Generator', () => {
    it('should generate CloudFront HCL resolving origin domain name from S3', () => {
      const node: CanvasNode = {
        id: 'cf-1',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'cloudfront',
          label: 'My CDN',
          status: 'configured',
          config: {
            enabled: true,
            viewer_protocol_policy: 'redirect-to-https',
          },
        },
      };

      const refs: TerraformReference[] = [
        {
          sourceNodeId: 'cf-1',
          targetNodeId: 's3-1',
          terraformField: 'origin.domain_name',
          terraformExpression:
            'aws_s3_bucket.static_assets.bucket_regional_domain_name',
          isSynthetic: false,
        },
      ];

      const hcl = GENERATORS.cloudfront.generate(node, refs);
      expect(hcl).toContain(
        'resource "aws_cloudfront_distribution" "my_cdn" {',
      );
      expect(hcl).toContain(
        'domain_name = aws_s3_bucket.static_assets.bucket_regional_domain_name',
      );
      expect(hcl).toContain('target_origin_id = "S3-Origin"');
      expect(hcl).toContain('viewer_protocol_policy = "redirect-to-https"');
    });
  });
});
