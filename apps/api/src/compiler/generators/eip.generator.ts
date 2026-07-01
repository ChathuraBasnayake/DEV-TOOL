import { toTerraformName } from '@canvascloud/shared';
import type {
  CanvasNode,
  TerraformReference,
  EIPConfig,
} from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class EIPGenerator extends BaseGenerator {
  readonly resourceType = 'eip';

  generate(node: CanvasNode, _references: TerraformReference[]): string {
    void _references;
    const config = node.data.config as EIPConfig;
    const name = toTerraformName(node.data.label || node.id);

    const parts: string[] = [];
    parts.push(`resource "aws_eip" "${name}" {`);
    parts.push(`  domain = "${config.domain || 'vpc'}"`);

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
