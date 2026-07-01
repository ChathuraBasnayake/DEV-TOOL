import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, VPCConfig } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class VPCGenerator extends BaseGenerator {
  readonly resourceType = 'vpc';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as VPCConfig;
    const name = toTerraformName(node.data.label || node.id);

    const parts: string[] = [];
    parts.push(`resource "aws_vpc" "${name}" {`);
    parts.push(`  cidr_block = "${config.cidr_block || '10.0.0.0/16'}"`);

    if (config.enable_dns_support !== undefined) {
      parts.push(`  enable_dns_support = ${config.enable_dns_support}`);
    }
    if (config.enable_dns_hostnames !== undefined) {
      parts.push(`  enable_dns_hostnames = ${config.enable_dns_hostnames}`);
    }

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
