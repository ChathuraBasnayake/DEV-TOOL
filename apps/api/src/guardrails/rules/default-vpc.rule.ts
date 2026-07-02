import { BaseGuardrailRule } from './base.rule';
import type {
  CanvasNode,
  CanvasEdge,
  SecurityWarning,
} from '@canvascloud/shared';

export class DefaultVPCRule extends BaseGuardrailRule {
  readonly id = 'default-vpc-deployment';
  readonly name = 'Default VPC Deployment';
  readonly severity = 'warning' as const;
  readonly description =
    'Resources deploy into default VPC/network space without custom subnet segmentation';

  evaluate(nodes: CanvasNode[], edges: CanvasEdge[]): SecurityWarning[] {
    const warnings: SecurityWarning[] = [];
    const targetTypes = ['ec2', 'rds', 'lambda'];
    const subnetConnectedNodeIds = new Set<string>();

    // Collect all nodes that have incoming edges from a subnet
    for (const edge of edges) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (sourceNode && sourceNode.data.resourceType === 'subnet') {
        subnetConnectedNodeIds.add(edge.target);
      }
    }

    const isolatedNodes = nodes.filter(
      (n) =>
        targetTypes.includes(n.data.resourceType) &&
        !subnetConnectedNodeIds.has(n.id),
    );

    for (const node of isolatedNodes) {
      warnings.push({
        ruleId: this.id,
        nodeId: node.id,
        severity: this.severity,
        message: `Resource "${node.data.label || node.id}" (${node.data.resourceType}) is not connected to a Subnet.`,
        suggestion:
          'Draw a connection from a Subnet node to this resource to deploy it in a designated VPC network.',
      });
    }

    return warnings;
  }
}
