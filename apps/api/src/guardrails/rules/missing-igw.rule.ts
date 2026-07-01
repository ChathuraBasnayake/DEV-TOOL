import { BaseGuardrailRule } from './base.rule';
import type { CanvasNode, CanvasEdge, SecurityWarning, SubnetConfig } from '@canvascloud/shared';

export class MissingIGWRule extends BaseGuardrailRule {
  readonly id = 'missing-internet-gateway';
  readonly name = 'Missing Internet Gateway';
  readonly severity = 'info' as const;
  readonly description = 'Public subnets lack routing to an Internet Gateway';

  evaluate(nodes: CanvasNode[], edges: CanvasEdge[]): SecurityWarning[] {
    const warnings: SecurityWarning[] = [];

    // Find all subnets marked as public (map_public_ip_on_launch = true)
    const publicSubnets = nodes.filter(n => {
      if (n.data.resourceType !== 'subnet') return false;
      const config = n.data.config as SubnetConfig;
      return config && config.map_public_ip_on_launch === true;
    });

    if (publicSubnets.length === 0) return [];

    // Check if there is an IGW connected to a route table in the canvas
    const hasIGW = nodes.some(n => n.data.resourceType === 'igw');
    const igwEdges = edges.filter(e => {
      const src = nodes.find(n => n.id === e.source);
      return src && src.data.resourceType === 'igw';
    });

    for (const subnet of publicSubnets) {
      // Find the route table associated with this subnet
      const rtEdge = edges.find(e => {
        const src = nodes.find(n => n.id === e.source);
        return src && src.data.resourceType === 'route-table' && e.target === subnet.id;
      });

      let rtHasIGWRoute = false;
      if (rtEdge) {
        // Is there an IGW routing to this route table?
        rtHasIGWRoute = igwEdges.some(e => e.target === rtEdge.source);
      }

      if (!hasIGW || !rtHasIGWRoute) {
        warnings.push({
          ruleId: this.id,
          nodeId: subnet.id,
          severity: this.severity,
          message: `Public subnet "${subnet.data.label || subnet.id}" is not routed to an Internet Gateway.`,
          suggestion: 'Attach an Internet Gateway to the VPC and draw a route to the associated Route Table.',
        });
      }
    }

    return warnings;
  }
}
