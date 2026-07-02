import type { CanvasNode } from '@canvascloud/shared';

export class VariablesGenerator {
  generateVariables(nodes: CanvasNode[]): string {
    const parts: string[] = [];

    // Always output the aws_region variable
    parts.push(
      `variable "aws_region" {`,
      `  description = "AWS region for all resources"`,
      `  type        = string`,
      `  default     = "us-east-1"`,
      `}`,
    );

    // If there is an RDS database on the canvas, output rds credentials variables
    const hasRDS = nodes.some((node) => node.data.resourceType === 'rds');
    if (hasRDS) {
      parts.push(
        ``,
        `variable "rds_master_username" {`,
        `  description = "Master username for RDS instance"`,
        `  type        = string`,
        `  sensitive   = true`,
        `  default     = "dbadmin"`,
        `}`,
        ``,
        `variable "rds_master_password" {`,
        `  description = "Master password for RDS instance"`,
        `  type        = string`,
        `  sensitive   = true`,
        `}`,
      );
    }

    return parts.join('\n');
  }
}

export const VARIABLES_GENERATOR = new VariablesGenerator();
export default VARIABLES_GENERATOR;
