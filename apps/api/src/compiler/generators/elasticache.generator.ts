import { toTerraformName } from '@canvascloud/shared';
import type {
  CanvasNode,
  TerraformReference,
  ElastiCacheConfig,
} from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class ElastiCacheGenerator extends BaseGenerator {
  readonly resourceType = 'elasticache';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as ElastiCacheConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve security_group_ids from references
    const sgRefs = this.findReferences(
      node.id,
      'security_group_ids',
      references,
    );
    const sgIdsVal =
      sgRefs.length > 0
        ? `[${sgRefs.map((r) => r.terraformExpression).join(', ')}]`
        : config.security_group_ids && config.security_group_ids.length > 0
          ? `[${config.security_group_ids.map((id) => `"${id}"`).join(', ')}]`
          : null;

    // Resolve subnet_group_name. If connected to subnets, reference the synthetic subnet group.
    const subnetRefs = this.findReferences(node.id, 'subnet_group', references);
    const subnetGroupVal =
      subnetRefs.length > 0
        ? `aws_elasticache_subnet_group.${name}_subnet_group.name`
        : config.subnet_group_name
          ? `"${config.subnet_group_name}"`
          : null;

    const parts: string[] = [];
    parts.push(`resource "aws_elasticache_cluster" "${name}" {`);
    parts.push(`  cluster_id           = "${config.cluster_id || name}"`);
    parts.push(`  engine               = "${config.engine || 'redis'}"`);
    if (config.engine_version) {
      parts.push(`  engine_version       = "${config.engine_version}"`);
    }
    parts.push(
      `  node_type            = "${config.node_type || 'cache.t3.micro'}"`,
    );
    parts.push(`  num_cache_nodes      = ${config.num_cache_nodes || 1}`);

    if (config.port) {
      parts.push(`  port                 = ${config.port}`);
    }
    if (sgIdsVal) {
      parts.push(`  security_group_ids   = ${sgIdsVal}`);
    }
    if (subnetGroupVal) {
      parts.push(`  subnet_group_name    = ${subnetGroupVal}`);
    }
    if (config.snapshot_retention_limit !== undefined) {
      parts.push(
        `  snapshot_retention_limit = ${config.snapshot_retention_limit}`,
      );
    }
    if (config.at_rest_encryption_enabled !== undefined) {
      parts.push(
        `  at_rest_encryption_enabled = ${config.at_rest_encryption_enabled}`,
      );
    }
    if (config.transit_encryption_enabled !== undefined) {
      parts.push(
        `  transit_encryption_enabled = ${config.transit_encryption_enabled}`,
      );
    }

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
