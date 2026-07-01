import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, SubnetConfig } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class SubnetGenerator extends BaseGenerator {
  readonly resourceType = 'subnet';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as SubnetConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve vpc_id from references
    const vpcRef = this.findReference(node.id, 'vpc_id', references);
    const vpcIdVal = vpcRef ? vpcRef.terraformExpression : (config.vpc_id ? `"${config.vpc_id}"` : '""');

    const parts: string[] = [];
    parts.push(`resource "aws_subnet" "${name}" {`);
    parts.push(`  vpc_id            = ${vpcIdVal}`);
    parts.push(`  cidr_block        = "${config.cidr_block || '10.0.1.0/24'}"`);

    if (config.availability_zone) {
      parts.push(`  availability_zone = "${config.availability_zone}"`);
    }
    if (config.map_public_ip_on_launch !== undefined) {
      parts.push(`  map_public_ip_on_launch = ${config.map_public_ip_on_launch}`);
    }

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
