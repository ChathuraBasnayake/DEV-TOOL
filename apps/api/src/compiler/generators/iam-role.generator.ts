import { toTerraformName } from '@canvascloud/shared';
import type {
  CanvasNode,
  TerraformReference,
  IAMRoleConfig,
} from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

const DEFAULT_ASSUME_ROLE_POLICY = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Principal: {
          Service: 'ec2.amazonaws.com',
        },
        Effect: 'Allow',
        Sid: '',
      },
    ],
  },
  null,
  2,
);

export class IAMRoleGenerator extends BaseGenerator {
  readonly resourceType = 'iam-role';

  generate(node: CanvasNode, _references: TerraformReference[]): string {
    void _references;
    const config = node.data.config as IAMRoleConfig;
    const name = toTerraformName(node.data.label || node.id);

    const parts: string[] = [];
    parts.push(`resource "aws_iam_role" "${name}" {`);
    parts.push(`  name        = "${config.name || name}"`);

    if (config.description) {
      parts.push(`  description = "${config.description}"`);
    }
    if (config.path) {
      parts.push(`  path        = "${config.path}"`);
    }
    if (config.max_session_duration !== undefined) {
      parts.push(`  max_session_duration = ${config.max_session_duration}`);
    }

    const rawPolicy = config.assume_role_policy || DEFAULT_ASSUME_ROLE_POLICY;
    // Format JSON with 2-spaces indentation for nice looking HCL heredoc
    let formattedPolicy = rawPolicy;
    try {
      formattedPolicy = JSON.stringify(JSON.parse(rawPolicy), null, 2);
    } catch {
      // Keep raw if invalid JSON
    }

    parts.push(`  assume_role_policy = <<EOF\n${formattedPolicy}\nEOF`);

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
