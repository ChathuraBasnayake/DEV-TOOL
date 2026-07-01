import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, APIGatewayConfig } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class APIGatewayGenerator extends BaseGenerator {
  readonly resourceType = 'api-gateway';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as APIGatewayConfig;
    const name = toTerraformName(node.data.label || node.id);

    const parts: string[] = [];
    
    // 1. API resource
    parts.push(`resource "aws_apigatewayv2_api" "${name}" {`);
    parts.push(`  name          = "${config.name || name}"`);
    parts.push(`  protocol_type = "${config.protocol_type || 'HTTP'}"`);

    if (config.description) {
      parts.push(`  description   = "${config.description}"`);
    }

    if (config.cors_enabled) {
      parts.push(`  cors_configuration {`);
      const origins = config.cors_allow_origins && config.cors_allow_origins.length > 0
        ? `[${config.cors_allow_origins.map(o => `"${o}"`).join(', ')}]`
        : '["*"]';
      const methods = config.cors_allow_methods && config.cors_allow_methods.length > 0
        ? `[${config.cors_allow_methods.map(m => `"${m}"`).join(', ')}]`
        : '["*"]';
      const headers = config.cors_allow_headers && config.cors_allow_headers.length > 0
        ? `[${config.cors_allow_headers.map(h => `"${h}"`).join(', ')}]`
        : '["*"]';
      parts.push(`    allow_origins = ${origins}`);
      parts.push(`    allow_methods = ${methods}`);
      parts.push(`    allow_headers = ${headers}`);
      parts.push(`  }`);
    }

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }
    parts.push('}');

    // 2. Stage resource (necessary to publish endpoints)
    parts.push('');
    parts.push(`resource "aws_apigatewayv2_stage" "${name}_stage" {`);
    parts.push(`  api_id      = aws_apigatewayv2_api.${name}.id`);
    parts.push(`  name        = "${config.stage_name || '$default'}"`);
    parts.push(`  auto_deploy = ${config.auto_deploy !== undefined ? config.auto_deploy : true}`);
    parts.push('}');

    return parts.join('\n');
  }
}
