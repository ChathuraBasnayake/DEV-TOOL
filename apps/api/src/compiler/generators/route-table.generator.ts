import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, RouteTableConfig } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class RouteTableGenerator extends BaseGenerator {
  readonly resourceType = 'route-table';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as RouteTableConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve vpc_id from references
    const vpcRef = this.findReference(node.id, 'vpc_id', references);
    const vpcIdVal = vpcRef ? vpcRef.terraformExpression : (config.vpc_id ? `"${config.vpc_id}"` : null);

    const parts: string[] = [];
    parts.push(`resource "aws_route_table" "${name}" {`);

    if (vpcIdVal) {
      parts.push(`  vpc_id = ${vpcIdVal}`);
    }

    const routes = config.routes || [];
    routes.forEach(route => {
      parts.push(`  route {`);
      parts.push(`    cidr_block = "${route.cidr_block}"`);
      if (route.gateway_id) {
        parts.push(`    gateway_id = "${route.gateway_id}"`);
      }
      if (route.nat_gateway_id) {
        parts.push(`    nat_gateway_id = "${route.nat_gateway_id}"`);
      }
      parts.push(`  }`);
    });

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
