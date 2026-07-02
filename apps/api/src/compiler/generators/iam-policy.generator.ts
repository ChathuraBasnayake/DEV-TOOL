import { toTerraformName } from '@canvascloud/shared';
import type {
  CanvasNode,
  TerraformReference,
  IAMPolicyConfig,
} from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

const DEFAULT_POLICY_DOCUMENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: '*',
        Resource: '*',
      },
    ],
  },
  null,
  2,
);

export class IAMPolicyGenerator extends BaseGenerator {
  readonly resourceType = 'iam-policy';

  generate(node: CanvasNode, _references: TerraformReference[]): string {
    void _references;
    const config = node.data.config as IAMPolicyConfig;
    const name = toTerraformName(node.data.label || node.id);

    const parts: string[] = [];
    parts.push(`resource "aws_iam_policy" "${name}" {`);
    parts.push(`  name        = "${config.name || name}"`);

    if (config.description) {
      parts.push(`  description = "${config.description}"`);
    }
    if (config.path) {
      parts.push(`  path        = "${config.path}"`);
    }

    const rawPolicy = config.policy_document || DEFAULT_POLICY_DOCUMENT;
    let formattedPolicy = rawPolicy;
    try {
      formattedPolicy = JSON.stringify(JSON.parse(rawPolicy), null, 2);
    } catch {
      // Keep raw if invalid JSON
    }

    parts.push(`  policy = <<EOF\n${formattedPolicy}\nEOF`);

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
