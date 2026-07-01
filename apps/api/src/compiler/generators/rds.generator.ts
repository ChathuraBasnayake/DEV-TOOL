import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, RDSConfig } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class RDSGenerator extends BaseGenerator {
  readonly resourceType = 'rds';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as RDSConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve vpc_security_group_ids from references
    const sgRefs = this.findReferences(node.id, 'vpc_security_group_ids', references);
    const sgIdsVal = sgRefs.length > 0
      ? `[${sgRefs.map(r => r.terraformExpression).join(', ')}]`
      : (config.vpc_security_group_ids && config.vpc_security_group_ids.length > 0
        ? `[${config.vpc_security_group_ids.map(id => `"${id}"`).join(', ')}]`
        : null);

    // Resolve db_subnet_group_name. If connected to subnets, reference the synthetic subnet group.
    const subnetRefs = this.findReferences(node.id, 'db_subnet_group', references);
    const dbSubnetGroupVal = subnetRefs.length > 0
      ? `aws_db_subnet_group.${name}_subnet_group.name`
      : (config.db_subnet_group_name ? `"${config.db_subnet_group_name}"` : null);

    const parts: string[] = [];
    parts.push(`resource "aws_db_instance" "${name}" {`);
    parts.push(`  identifier        = "${name}"`);
    parts.push(`  allocated_storage = ${config.allocated_storage || 20}`);
    parts.push(`  engine            = "${config.engine || 'postgres'}"`);
    if (config.engine_version) {
      parts.push(`  engine_version    = "${config.engine_version}"`);
    }
    parts.push(`  instance_class    = "${config.instance_class || 'db.t3.micro'}"`);

    if (config.db_name) {
      parts.push(`  db_name           = "${config.db_name}"`);
    }

    // Reference variables for username and password to keep HCL secure
    parts.push(`  username          = var.rds_master_username`);
    parts.push(`  password          = var.rds_master_password`);

    if (config.publicly_accessible !== undefined) {
      parts.push(`  publicly_accessible = ${config.publicly_accessible}`);
    }
    if (sgIdsVal) {
      parts.push(`  vpc_security_group_ids = ${sgIdsVal}`);
    }
    if (dbSubnetGroupVal) {
      parts.push(`  db_subnet_group_name   = ${dbSubnetGroupVal}`);
    }

    if (config.storage_type) {
      parts.push(`  storage_type      = "${config.storage_type}"`);
    }
    if (config.storage_encrypted !== undefined) {
      parts.push(`  storage_encrypted = ${config.storage_encrypted}`);
    }
    if (config.multi_az !== undefined) {
      parts.push(`  multi_az          = ${config.multi_az}`);
    }
    if (config.backup_retention_period !== undefined) {
      parts.push(`  backup_retention_period = ${config.backup_retention_period}`);
    }
    parts.push(`  skip_final_snapshot     = ${config.skip_final_snapshot !== undefined ? config.skip_final_snapshot : true}`);

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
