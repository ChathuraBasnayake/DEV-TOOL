import { toTerraformName } from '@canvascloud/shared';
import type {
  CanvasNode,
  TerraformReference,
  NATGWConfig,
} from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class NATGWGenerator extends BaseGenerator {
  readonly resourceType = 'nat-gw';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as NATGWConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve subnet_id from references
    const subnetRef = this.findReference(node.id, 'subnet_id', references);
    const subnetIdVal = subnetRef
      ? subnetRef.terraformExpression
      : config.subnet_id
        ? `"${config.subnet_id}"`
        : null;

    // Resolve allocation_id from references
    const eipRef = this.findReference(node.id, 'allocation_id', references);
    const allocationIdVal = eipRef
      ? eipRef.terraformExpression
      : config.allocation_id
        ? `"${config.allocation_id}"`
        : null;

    const parts: string[] = [];
    parts.push(`resource "aws_nat_gateway" "${name}" {`);

    if (allocationIdVal) {
      parts.push(`  allocation_id = ${allocationIdVal}`);
    }
    if (subnetIdVal) {
      parts.push(`  subnet_id     = ${subnetIdVal}`);
    }

    if (config.connectivity_type) {
      parts.push(`  connectivity_type = "${config.connectivity_type}"`);
    }

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
