import { toTerraformName } from '@canvascloud/shared';
import type {
  CanvasNode,
  TerraformReference,
  ASGConfig,
} from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class ASGGenerator extends BaseGenerator {
  readonly resourceType = 'asg';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as ASGConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve launch_template from references
    const ltRef = this.findReference(node.id, 'launch_template', references);

    // Resolve vpc_zone_identifier (subnets) from references
    const subnetRefs = this.findReferences(
      node.id,
      'vpc_zone_identifier',
      references,
    );
    const subnetsVal =
      subnetRefs.length > 0
        ? `[${subnetRefs.map((r) => r.terraformExpression).join(', ')}]`
        : config.vpc_zone_identifier && config.vpc_zone_identifier.length > 0
          ? `[${config.vpc_zone_identifier.map((id) => `"${id}"`).join(', ')}]`
          : null;

    // Resolve target_group_arns from references
    const tgRefs = this.findReferences(
      node.id,
      'target_group_arns',
      references,
    );
    const tgArnsVal =
      tgRefs.length > 0
        ? `[${tgRefs.map((r) => r.terraformExpression).join(', ')}]`
        : config.target_group_arns && config.target_group_arns.length > 0
          ? `[${config.target_group_arns.map((arn) => `"${arn}"`).join(', ')}]`
          : null;

    const parts: string[] = [];
    parts.push(`resource "aws_autoscaling_group" "${name}" {`);
    parts.push(`  name     = "${config.name || name}"`);
    parts.push(`  min_size = ${config.min_size}`);
    parts.push(`  max_size = ${config.max_size}`);

    if (config.desired_capacity !== undefined) {
      parts.push(`  desired_capacity = ${config.desired_capacity}`);
    }

    if (ltRef) {
      parts.push(`  launch_template {`);
      parts.push(`    id      = ${ltRef.terraformExpression}`);
      parts.push(
        `    version = "${config.launch_template_version || '$Latest'}"`,
      );
      parts.push(`  }`);
    } else if (config.launch_template_id) {
      parts.push(`  launch_template {`);
      parts.push(`    id      = "${config.launch_template_id}"`);
      parts.push(
        `    version = "${config.launch_template_version || '$Latest'}"`,
      );
      parts.push(`  }`);
    }

    if (subnetsVal) {
      parts.push(`  vpc_zone_identifier = ${subnetsVal}`);
    }
    if (tgArnsVal) {
      parts.push(`  target_group_arns   = ${tgArnsVal}`);
    }

    if (config.health_check_type) {
      parts.push(`  health_check_type = "${config.health_check_type}"`);
    }
    if (config.health_check_grace_period !== undefined) {
      parts.push(
        `  health_check_grace_period = ${config.health_check_grace_period}`,
      );
    }
    if (config.default_cooldown !== undefined) {
      parts.push(`  default_cooldown = ${config.default_cooldown}`);
    }

    // Handle tag mapping in ASG (requires tags to propagate to instances: tag block format)
    const tags = config.tags || {};
    const hasNameTag = Object.keys(tags).some(
      (k) => k.toLowerCase() === 'name',
    );
    const finalTags = { ...tags };
    if (!hasNameTag) {
      finalTags.Name = node.data.label || node.id;
    }

    Object.entries(finalTags).forEach(([key, value]) => {
      parts.push(`  tag {`);
      parts.push(`    key                 = "${key}"`);
      parts.push(`    value               = "${value}"`);
      parts.push(`    propagate_at_launch = true`);
      parts.push(`  }`);
    });

    parts.push('}');
    return parts.join('\n');
  }
}
