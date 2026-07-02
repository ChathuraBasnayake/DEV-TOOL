import { toTerraformName } from '@canvascloud/shared';
import type {
  CanvasNode,
  TerraformReference,
  Route53Config,
} from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class Route53Generator extends BaseGenerator {
  readonly resourceType = 'route53';

  generate(node: CanvasNode, _references: TerraformReference[]): string {
    void _references;
    const config = node.data.config as Route53Config;
    const name = toTerraformName(node.data.label || node.id);

    const parts: string[] = [];
    parts.push(`resource "aws_route53_zone" "${name}" {`);
    parts.push(`  name = "${config.name || 'example.com'}"`);

    if (config.comment) {
      parts.push(`  comment = "${config.comment}"`);
    }

    if (config.is_private && config.vpc_id) {
      parts.push(`  vpc {`);
      parts.push(`    vpc_id = "${config.vpc_id}"`);
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
