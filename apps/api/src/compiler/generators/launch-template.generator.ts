import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, LaunchTemplateConfig } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class LaunchTemplateGenerator extends BaseGenerator {
  readonly resourceType = 'launch-template';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as LaunchTemplateConfig;
    const name = toTerraformName(node.data.label || node.id);

    const parts: string[] = [];
    parts.push(`resource "aws_launch_template" "${name}" {`);
    parts.push(`  name = "${config.name || name}"`);

    if (config.image_id) {
      parts.push(`  image_id = "${config.image_id}"`);
    }
    if (config.instance_type) {
      parts.push(`  instance_type = "${config.instance_type}"`);
    }
    if (config.key_name) {
      parts.push(`  key_name = "${config.key_name}"`);
    }
    
    if (config.vpc_security_group_ids && config.vpc_security_group_ids.length > 0) {
      const sgIdsVal = `[${config.vpc_security_group_ids.map(id => `"${id}"`).join(', ')}]`;
      parts.push(`  vpc_security_group_ids = ${sgIdsVal}`);
    }

    if (config.user_data) {
      // Base64 encoded is typical for LT user_data in Terraform, but text is fine too
      parts.push(`  user_data = base64encode(<<-EOF\n${config.user_data}\n  EOF)`);
    }

    if (config.iam_instance_profile_name) {
      parts.push(`  iam_instance_profile {`);
      parts.push(`    name = "${config.iam_instance_profile_name}"`);
      parts.push(`  }`);
    }

    if (config.block_device_mappings) {
      parts.push(`  block_device_mappings {`);
      if (config.block_device_mappings.device_name) {
        parts.push(`    device_name = "${config.block_device_mappings.device_name}"`);
      }
      if (config.block_device_mappings.ebs) {
        parts.push(`    ebs {`);
        if (config.block_device_mappings.ebs.volume_size !== undefined) {
          parts.push(`      volume_size = ${config.block_device_mappings.ebs.volume_size}`);
        }
        if (config.block_device_mappings.ebs.volume_type) {
          parts.push(`      volume_type = "${config.block_device_mappings.ebs.volume_type}"`);
        }
        if (config.block_device_mappings.ebs.encrypted !== undefined) {
          parts.push(`      encrypted   = ${config.block_device_mappings.ebs.encrypted}`);
        }
        parts.push(`    }`);
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
