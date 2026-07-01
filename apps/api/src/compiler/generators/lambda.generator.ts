import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, LambdaConfig } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class LambdaGenerator extends BaseGenerator {
  readonly resourceType = 'lambda';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as LambdaConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve IAM Role from references
    const roleRef = this.findReference(node.id, 'role', references);
    const roleArnVal = roleRef ? roleRef.terraformExpression : (config.role ? `"${config.role}"` : '""');

    // Resolve VPC subnets from references
    const subnetRefs = this.findReferences(node.id, 'vpc_config.subnet_ids', references);
    const subnetsVal = subnetRefs.length > 0
      ? `[${subnetRefs.map(r => r.terraformExpression).join(', ')}]`
      : (config.vpc_config?.subnet_ids && config.vpc_config.subnet_ids.length > 0
        ? `[${config.vpc_config.subnet_ids.map(id => `"${id}"`).join(', ')}]`
        : null);

    // Resolve VPC security groups from references
    const sgRefs = this.findReferences(node.id, 'vpc_config.security_group_ids', references);
    const sgsVal = sgRefs.length > 0
      ? `[${sgRefs.map(r => r.terraformExpression).join(', ')}]`
      : (config.vpc_config?.security_group_ids && config.vpc_config.security_group_ids.length > 0
        ? `[${config.vpc_config.security_group_ids.map(id => `"${id}"`).join(', ')}]`
        : null);

    const parts: string[] = [];
    parts.push(`resource "aws_lambda_function" "${name}" {`);
    parts.push(`  function_name = "${config.function_name || name}"`);
    parts.push(`  runtime       = "${config.runtime || 'nodejs18.x'}"`);
    parts.push(`  handler       = "${config.handler || 'index.handler'}"`);
    parts.push(`  role          = ${roleArnVal}`);

    if (config.filename) {
      parts.push(`  filename      = "${config.filename}"`);
    } else if (config.s3_bucket && config.s3_key) {
      parts.push(`  s3_bucket     = "${config.s3_bucket}"`);
      parts.push(`  s3_key        = "${config.s3_key}"`);
    } else {
      // Default placeholder filename so Terraform compilation passes syntactically
      parts.push(`  filename      = "lambda_function_payload.zip"`);
    }

    if (config.memory_size !== undefined) {
      parts.push(`  memory_size   = ${config.memory_size}`);
    }
    if (config.timeout !== undefined) {
      parts.push(`  timeout       = ${config.timeout}`);
    }

    if (config.environment_variables && Object.keys(config.environment_variables).length > 0) {
      parts.push(`  environment {`);
      parts.push(`    variables = {`);
      Object.entries(config.environment_variables).forEach(([k, v]) => {
        parts.push(`      ${k} = "${v}"`);
      });
      parts.push(`    }`);
      parts.push(`  }`);
    }

    if (subnetsVal || sgsVal) {
      parts.push(`  vpc_config {`);
      if (subnetsVal) {
        parts.push(`    subnet_ids         = ${subnetsVal}`);
      }
      if (sgsVal) {
        parts.push(`    security_group_ids = ${sgsVal}`);
      }
      parts.push(`  }`);
    }

    if (config.layers && config.layers.length > 0) {
      parts.push(`  layers        = [${config.layers.map(l => `"${l}"`).join(', ')}]`);
    }

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
