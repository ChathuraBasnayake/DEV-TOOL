import { toTerraformName } from '@canvascloud/shared';
import type {
  CanvasNode,
  TerraformReference,
  DynamoDBConfig,
} from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class DynamoDBGenerator extends BaseGenerator {
  readonly resourceType = 'dynamodb';

  generate(node: CanvasNode, _references: TerraformReference[]): string {
    void _references;
    const config = node.data.config as DynamoDBConfig;
    const name = toTerraformName(node.data.label || node.id);

    const parts: string[] = [];
    parts.push(`resource "aws_dynamodb_table" "${name}" {`);
    parts.push(`  name         = "${config.name || name}"`);
    parts.push(
      `  billing_mode = "${config.billing_mode || 'PAY_PER_REQUEST'}"`,
    );
    parts.push(`  hash_key     = "${config.hash_key || 'id'}"`);

    if (config.range_key) {
      parts.push(`  range_key    = "${config.range_key}"`);
    }

    if (config.billing_mode === 'PROVISIONED') {
      parts.push(`  read_capacity  = ${config.read_capacity || 5}`);
      parts.push(`  write_capacity = ${config.write_capacity || 5}`);
    }

    const attrs = config.attributes || [{ name: 'id', type: 'S' }];
    attrs.forEach((attr) => {
      parts.push(`  attribute {`);
      parts.push(`    name = "${attr.name}"`);
      parts.push(`    type = "${attr.type}"`);
      parts.push(`  }`);
    });

    if (config.server_side_encryption !== undefined) {
      parts.push(`  server_side_encryption {`);
      parts.push(`    enabled = ${config.server_side_encryption}`);
      parts.push(`  }`);
    }

    if (config.stream_enabled !== undefined) {
      parts.push(`  stream_enabled   = ${config.stream_enabled}`);
      if (config.stream_view_type) {
        parts.push(`  stream_view_type = "${config.stream_view_type}"`);
      }
    }

    if (config.point_in_time_recovery !== undefined) {
      parts.push(`  point_in_time_recovery {`);
      parts.push(`    enabled = ${config.point_in_time_recovery}`);
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
