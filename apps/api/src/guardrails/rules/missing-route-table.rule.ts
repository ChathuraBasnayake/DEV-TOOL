import { BaseGuardrailRule } from './base.rule';
import type {
  CanvasNode,
  CanvasEdge,
  SecurityWarning,
} from '@canvascloud/shared';

export class MissingRouteTableRule extends BaseGuardrailRule {
  readonly id = 'missing-route-table-association';
  readonly name = 'Missing Route Table Association';
  readonly severity = 'warning' as const;
  readonly description =
    'Subnet does not have any Route Table associated with it';

  evaluate(nodes: CanvasNode[], edges: CanvasEdge[]): SecurityWarning[] {
    const warnings: SecurityWarning[] = [];
    const subnetNodes = nodes.filter((n) => n.data.resourceType === 'subnet');

    for (const subnet of subnetNodes) {
      // Check if there is an edge connecting any route table to this subnet
      const isAssociated = edges.some((e) => {
        const sourceNode = nodes.find((n) => n.id === e.source);
        return (
          sourceNode &&
          sourceNode.data.resourceType === 'route-table' &&
          e.target === subnet.id
        );
      });

      if (!isAssociated) {
        warnings.push({
          ruleId: this.id,
          nodeId: subnet.id,
          severity: this.severity,
          message: `Subnet "${subnet.data.label || subnet.id}" is not associated with any Route Table.`,
          suggestion:
            'Create a Route Table node and connect it to this Subnet to define traffic routes.',
        });
      }
    }

    return warnings;
  }
}
