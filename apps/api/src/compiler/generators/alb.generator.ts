import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, ALBConfig } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class ALBGenerator extends BaseGenerator {
  readonly resourceType = 'alb';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as ALBConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve subnets from references
    const subnetRefs = this.findReferences(node.id, 'subnets', references);
    const subnetsVal = subnetRefs.length > 0
      ? `[${subnetRefs.map(r => r.terraformExpression).join(', ')}]`
      : (config.subnets && config.subnets.length > 0
        ? `[${config.subnets.map(id => `"${id}"`).join(', ')}]`
        : null);

    // Resolve security groups from references
    const sgRefs = this.findReferences(node.id, 'security_groups', references);
    const sgsVal = sgRefs.length > 0
      ? `[${sgRefs.map(r => r.terraformExpression).join(', ')}]`
      : (config.security_groups && config.security_groups.length > 0
        ? `[${config.security_groups.map(id => `"${id}"`).join(', ')}]`
        : null);

    const parts: string[] = [];
    parts.push(`resource "aws_lb" "${name}" {`);
    parts.push(`  name               = "${config.name || name}"`);
    parts.push(`  internal           = ${config.internal !== undefined ? config.internal : false}`);
    parts.push(`  load_balancer_type = "${config.load_balancer_type || 'application'}"`);

    if (subnetsVal) {
      parts.push(`  subnets            = ${subnetsVal}`);
    }
    if (sgsVal) {
      parts.push(`  security_groups    = ${sgsVal}`);
    }

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
