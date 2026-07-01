import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, EC2Config } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class EC2Generator extends BaseGenerator {
  readonly resourceType = 'ec2';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as EC2Config;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve subnet_id from references
    const subnetRef = this.findReference(node.id, 'subnet_id', references);
    const subnetIdVal = subnetRef ? subnetRef.terraformExpression : (config.subnet_id ? `"${config.subnet_id}"` : null);

    // Resolve vpc_security_group_ids from references
    const sgRefs = this.findReferences(node.id, 'vpc_security_group_ids', references);
    const sgIdsVal = sgRefs.length > 0
      ? `[${sgRefs.map(r => r.terraformExpression).join(', ')}]`
      : (config.vpc_security_group_ids && config.vpc_security_group_ids.length > 0
        ? `[${config.vpc_security_group_ids.map(id => `"${id}"`).join(', ')}]`
        : null);

    const parts: string[] = [];
    parts.push(`resource "aws_instance" "${name}" {`);
    parts.push(`  ami           = "${config.ami || 'ami-0c55b159cbfafe1f0'}"`);
    parts.push(`  instance_type = "${config.instance_type || 't3.micro'}"`);

    if (config.key_name) {
      parts.push(`  key_name      = "${config.key_name}"`);
    }
    if (subnetIdVal) {
      parts.push(`  subnet_id     = ${subnetIdVal}`);
    }
    if (sgIdsVal) {
      parts.push(`  vpc_security_group_ids = ${sgIdsVal}`);
    }
    if (config.associate_public_ip_address !== undefined) {
      parts.push(`  associate_public_ip_address = ${config.associate_public_ip_address}`);
    }
    if (config.user_data) {
      parts.push(`  user_data     = <<-EOF\n${config.user_data}\n  EOF`);
    }

    if (config.root_block_device) {
      parts.push(`  root_block_device {`);
      if (config.root_block_device.volume_size !== undefined) {
        parts.push(`    volume_size = ${config.root_block_device.volume_size}`);
      }
      if (config.root_block_device.volume_type) {
        parts.push(`    volume_type = "${config.root_block_device.volume_type}"`);
      }
      if (config.root_block_device.encrypted !== undefined) {
        parts.push(`    encrypted   = ${config.root_block_device.encrypted}`);
      }
      if (config.root_block_device.delete_on_termination !== undefined) {
        parts.push(`    delete_on_termination = ${config.root_block_device.delete_on_termination}`);
      }
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
