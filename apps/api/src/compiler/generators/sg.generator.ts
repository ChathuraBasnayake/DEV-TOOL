import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, SecurityGroupConfig, SGRule } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class SecurityGroupGenerator extends BaseGenerator {
  readonly resourceType = 'security-group';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as SecurityGroupConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve vpc_id from references
    const vpcRef = this.findReference(node.id, 'vpc_id', references);
    const vpcIdVal = vpcRef ? vpcRef.terraformExpression : (config.vpc_id ? `"${config.vpc_id}"` : null);

    const parts: string[] = [];
    parts.push(`resource "aws_security_group" "${name}" {`);
    parts.push(`  name        = "${config.name || name}"`);
    parts.push(`  description = "${config.description || 'Managed by CanvasCloud'}"`);

    if (vpcIdVal) {
      parts.push(`  vpc_id      = ${vpcIdVal}`);
    }

    // Ingress rules
    const ingress = config.ingressRules || [];
    ingress.forEach(rule => {
      parts.push(`  ingress {`);
      parts.push(`    from_port   = ${rule.from_port}`);
      parts.push(`    to_port     = ${rule.to_port}`);
      parts.push(`    protocol    = "${rule.protocol}"`);
      const cidrBlocks = rule.cidr_blocks && rule.cidr_blocks.length > 0
        ? `[${rule.cidr_blocks.map(c => `"${c}"`).join(', ')}]`
        : '["0.0.0.0/0"]';
      parts.push(`    cidr_blocks = ${cidrBlocks}`);
      if (rule.description) {
        parts.push(`    description = "${rule.description}"`);
      }
      parts.push(`  }`);
    });

    // Egress rules
    const egress = config.egressRules || [];
    if (egress.length === 0) {
      // Default allow-all egress
      parts.push(`  egress {`);
      parts.push(`    from_port   = 0`);
      parts.push(`    to_port     = 0`);
      parts.push(`    protocol    = "-1"`);
      parts.push(`    cidr_blocks = ["0.0.0.0/0"]`);
      parts.push(`  }`);
    } else {
      egress.forEach(rule => {
        parts.push(`  egress {`);
        parts.push(`    from_port   = ${rule.from_port}`);
        parts.push(`    to_port     = ${rule.to_port}`);
        parts.push(`    protocol    = "${rule.protocol}"`);
        const cidrBlocks = rule.cidr_blocks && rule.cidr_blocks.length > 0
          ? `[${rule.cidr_blocks.map(c => `"${c}"`).join(', ')}]`
          : '["0.0.0.0/0"]';
        parts.push(`    cidr_blocks = ${cidrBlocks}`);
        if (rule.description) {
          parts.push(`    description = "${rule.description}"`);
        }
        parts.push(`  }`);
      });
    }

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
