import { toTerraformName } from '@canvascloud/shared';
import type {
  CanvasNode,
  TerraformReference,
  IGWConfig,
} from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class IGWGenerator extends BaseGenerator {
  readonly resourceType = 'igw';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as IGWConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve vpc_id from references
    const vpcRef = this.findReference(node.id, 'vpc_id', references);
    const vpcIdVal = vpcRef
      ? vpcRef.terraformExpression
      : config.vpc_id
        ? `"${config.vpc_id}"`
        : null;

    const parts: string[] = [];
    parts.push(`resource "aws_internet_gateway" "${name}" {`);

    if (vpcIdVal) {
      parts.push(`  vpc_id = ${vpcIdVal}`);
    }

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
