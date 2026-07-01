import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, TargetGroupConfig } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class TargetGroupGenerator extends BaseGenerator {
  readonly resourceType = 'target-group';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as TargetGroupConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Dynamic VPC resolution: search references for any valid aws_vpc expression
    const vpcRef = references.find(r => r.terraformField === 'vpc_id');
    const vpcIdVal = vpcRef ? vpcRef.terraformExpression : (config.vpc_id ? `"${config.vpc_id}"` : null);

    const parts: string[] = [];
    parts.push(`resource "aws_lb_target_group" "${name}" {`);
    parts.push(`  name        = "${config.name || name}"`);
    parts.push(`  port        = ${config.port || 80}`);
    parts.push(`  protocol    = "${config.protocol || 'HTTP'}"`);
    parts.push(`  target_type = "${config.target_type || 'instance'}"`);

    if (vpcIdVal) {
      parts.push(`  vpc_id      = ${vpcIdVal}`);
    }

    if (config.health_check) {
      parts.push(`  health_check {`);
      if (config.health_check.path) {
        parts.push(`    path                = "${config.health_check.path}"`);
      }
      if (config.health_check.port) {
        parts.push(`    port                = "${config.health_check.port}"`);
      }
      if (config.health_check.protocol) {
        parts.push(`    protocol            = "${config.health_check.protocol}"`);
      }
      if (config.health_check.healthy_threshold !== undefined) {
        parts.push(`    healthy_threshold   = ${config.health_check.healthy_threshold}`);
      }
      if (config.health_check.unhealthy_threshold !== undefined) {
        parts.push(`    unhealthy_threshold = ${config.health_check.unhealthy_threshold}`);
      }
      if (config.health_check.interval !== undefined) {
        parts.push(`    interval            = ${config.health_check.interval}`);
      }
      parts.push(`  }`);
    }

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
