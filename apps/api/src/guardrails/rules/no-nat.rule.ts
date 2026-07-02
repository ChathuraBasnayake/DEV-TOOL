import { BaseGuardrailRule } from './base.rule';
import type {
  CanvasNode,
  CanvasEdge,
  SecurityWarning,
  SubnetConfig,
} from '@canvascloud/shared';

export class NoNATRule extends BaseGuardrailRule {
  readonly id = 'missing-nat-gateway';
  readonly name = 'Missing NAT Gateway';
  readonly severity = 'warning' as const;
  readonly description =
    'Private subnets lack outbound internet routing via a NAT Gateway';

  evaluate(nodes: CanvasNode[], edges: CanvasEdge[]): SecurityWarning[] {
    const warnings: SecurityWarning[] = [];

    // Private subnets are subnets that are NOT public (map_public_ip_on_launch !== true)
    const privateSubnets = nodes.filter((n) => {
      if (n.data.resourceType !== 'subnet') return false;
      const config = n.data.config as SubnetConfig;
      return !config || config.map_public_ip_on_launch !== true;
    });

    if (privateSubnets.length === 0) return [];

    const hasNAT = nodes.some((n) => n.data.resourceType === 'nat-gw');
    const natEdges = edges.filter((e) => {
      const src = nodes.find((n) => n.id === e.source);
      return src && src.data.resourceType === 'nat-gw';
    });

    for (const subnet of privateSubnets) {
      // Find associated route table
      const rtEdge = edges.find((e) => {
        const src = nodes.find((n) => n.id === e.source);
        return (
          src &&
          src.data.resourceType === 'route-table' &&
          e.target === subnet.id
        );
      });

      let rtHasNATRoute = false;
      if (rtEdge) {
        rtHasNATRoute = natEdges.some((e) => e.target === rtEdge.source);
      }

      if (!hasNAT || !rtHasNATRoute) {
        warnings.push({
          ruleId: this.id,
          nodeId: subnet.id,
          severity: this.severity,
          message: `Private subnet "${subnet.data.label || subnet.id}" is not routed to a NAT Gateway. Outbound internet connectivity for private resources will be unavailable.`,
          suggestion:
            'Create a NAT Gateway in a public subnet and route traffic from this private Route Table to the NAT Gateway.',
        });
      }
    }

    return warnings;
  }
}
