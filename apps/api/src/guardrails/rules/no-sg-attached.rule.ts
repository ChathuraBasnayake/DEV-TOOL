import { BaseGuardrailRule } from './base.rule';
import type { CanvasNode, CanvasEdge, SecurityWarning } from '@canvascloud/shared';

export class NoSGAttachedRule extends BaseGuardrailRule {
  readonly id = 'no-security-group-attached';
  readonly name = 'No Security Group Attached';
  readonly severity = 'warning' as const;
  readonly description = 'Resources deploy without any security group attachments, leaving firewall settings open to defaults';

  evaluate(nodes: CanvasNode[], edges: CanvasEdge[]): SecurityWarning[] {
    const warnings: SecurityWarning[] = [];
    const targets = ['ec2', 'rds', 'alb'];
    const sgConnectedNodeIds = new Set<string>();

    for (const edge of edges) {
      const source = nodes.find(n => n.id === edge.source);
      if (source && source.data.resourceType === 'security-group') {
        sgConnectedNodeIds.add(edge.target);
      }
    }

    const unshieldedNodes = nodes.filter(n => targets.includes(n.data.resourceType) && !sgConnectedNodeIds.has(n.id));

    for (const node of unshieldedNodes) {
      warnings.push({
        ruleId: this.id,
        nodeId: node.id,
        severity: this.severity,
        message: `Resource "${node.data.label || node.id}" (${node.data.resourceType}) has no Security Group attached.`,
        suggestion: 'Create a Security Group node and draw a connection to this resource to control incoming traffic.',
      });
    }

    return warnings;
  }
}
