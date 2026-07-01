import { PROVIDER_GENERATOR } from './provider.generator';
import { VARIABLES_GENERATOR } from './variables.generator';
import { OUTPUTS_GENERATOR } from './outputs.generator';
import type { CanvasNode } from '@canvascloud/shared';

describe('Provider, Variables and Outputs Generators', () => {
  describe('Provider Generator', () => {
    it('should generate aws provider block', () => {
      const hcl = PROVIDER_GENERATOR.generateProvider();
      expect(hcl).toContain('provider "aws" {');
      expect(hcl).toContain('region = var.aws_region');
    });

    it('should generate required providers block', () => {
      const hcl = PROVIDER_GENERATOR.generateRequiredProviders();
      expect(hcl).toContain('required_providers {');
      expect(hcl).toContain('source  = "hashicorp/aws"');
      expect(hcl).toContain('version = "~> 5.0"');
    });
  });

  describe('Variables Generator', () => {
    it('should generate standard variables (region only) when RDS is absent', () => {
      const nodes: CanvasNode[] = [
        {
          id: 's3-1',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 's3',
            label: 'Bucket',
            config: {},
            status: 'configured',
          },
        },
      ];

      const hcl = VARIABLES_GENERATOR.generateVariables(nodes);
      expect(hcl).toContain('variable "aws_region"');
      expect(hcl).not.toContain('variable "rds_master_username"');
      expect(hcl).not.toContain('variable "rds_master_password"');
    });

    it('should generate RDS credential variables when RDS is present on canvas', () => {
      const nodes: CanvasNode[] = [
        {
          id: 'rds-1',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 'rds',
            label: 'Database',
            config: {},
            status: 'configured',
          },
        },
      ];

      const hcl = VARIABLES_GENERATOR.generateVariables(nodes);
      expect(hcl).toContain('variable "aws_region"');
      expect(hcl).toContain('variable "rds_master_username"');
      expect(hcl).toContain('variable "rds_master_password"');
      expect(hcl).toContain('sensitive   = true');
    });
  });

  describe('Outputs Generator', () => {
    it('should generate outputs dynamically based on node types', () => {
      const nodes: CanvasNode[] = [
        {
          id: 'ec2-1',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 'ec2',
            label: 'Web Server',
            config: {},
            status: 'configured',
          },
        },
        {
          id: 's3-1',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 's3',
            label: 'Assets Bucket',
            config: {},
            status: 'configured',
          },
        },
      ];

      const hcl = OUTPUTS_GENERATOR.generateOutputs(nodes);

      expect(hcl).toContain('output "ec2_web_server_public_ip"');
      expect(hcl).toContain('value       = aws_instance.web_server.public_ip');

      expect(hcl).toContain('output "s3_assets_bucket_arn"');
      expect(hcl).toContain('value       = aws_s3_bucket.assets_bucket.arn');
    });

    it('should return empty string if no output-supporting nodes exist', () => {
      const nodes: CanvasNode[] = [
        {
          id: 'subnet-1',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 'subnet',
            label: 'Subnet',
            config: {},
            status: 'configured',
          },
        },
      ];

      const hcl = OUTPUTS_GENERATOR.generateOutputs(nodes);
      expect(hcl).toBe('');
    });
  });
});
