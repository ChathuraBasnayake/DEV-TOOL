import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode } from '@canvascloud/shared';

export class OutputsGenerator {
  generateOutputs(nodes: CanvasNode[]): string {
    const parts: string[] = [];

    for (const node of nodes) {
      const name = toTerraformName(node.data.label || node.id);

      switch (node.data.resourceType) {
        case 'ec2': {
          parts.push(
            `output "ec2_${name}_public_ip" {`,
            `  description = "Public IP address of the EC2 instance"`,
            `  value       = aws_instance.${name}.public_ip`,
            `}`,
            ``,
          );
          break;
        }

        case 'rds': {
          parts.push(
            `output "rds_${name}_endpoint" {`,
            `  description = "Connection endpoint for the RDS instance"`,
            `  value       = aws_db_instance.${name}.endpoint`,
            `}`,
            ``,
          );
          break;
        }

        case 'alb': {
          parts.push(
            `output "alb_${name}_dns_name" {`,
            `  description = "DNS name of the Application Load Balancer"`,
            `  value       = aws_lb.${name}.dns_name`,
            `}`,
            ``,
          );
          break;
        }

        case 's3': {
          parts.push(
            `output "s3_${name}_arn" {`,
            `  description = "ARN of the S3 bucket"`,
            `  value       = aws_s3_bucket.${name}.arn`,
            `}`,
            ``,
          );
          break;
        }

        case 'cloudfront': {
          parts.push(
            `output "cloudfront_${name}_domain_name" {`,
            `  description = "Domain name of the CloudFront distribution"`,
            `  value       = aws_cloudfront_distribution.${name}.domain_name`,
            `}`,
            ``,
          );
          break;
        }

        case 'api-gateway': {
          parts.push(
            `output "api_gateway_${name}_url" {`,
            `  description = "URL of the API Gateway stage"`,
            `  value       = aws_apigatewayv2_stage.${name}_stage.invoke_url`,
            `}`,
            ``,
          );
          break;
        }
      }
    }

    // Trim trailing newline if any
    const hcl = parts.join('\n');
    return hcl.endsWith('\n') ? hcl.slice(0, -1) : hcl;
  }
}

export const OUTPUTS_GENERATOR = new OutputsGenerator();
export default OUTPUTS_GENERATOR;
