import { BaseGuardrailRule } from './base.rule';
import type {
  CanvasNode,
  CanvasEdge,
  SecurityWarning,
  SecurityGroupConfig,
} from '@canvascloud/shared';

export class WideOpenEgressRule extends BaseGuardrailRule {
  readonly id = 'wide-open-egress-rule';
  readonly name = 'Wide Open Egress';
  readonly severity = 'info' as const;
  readonly description =
    'Security Group configuration allows unrestricted outbound traffic to the public internet';

  evaluate(nodes: CanvasNode[], _edges: CanvasEdge[]): SecurityWarning[] {
    void _edges;
    const warnings: SecurityWarning[] = [];
    const sgNodes = nodes.filter(
      (n) => n.data.resourceType === 'security-group',
    );

    for (const node of sgNodes) {
      const config = node.data.config as SecurityGroupConfig;
      if (!config || !config.egressRules) continue;

      for (const rule of config.egressRules) {
        const isWideOpen = rule.cidr_blocks?.some(
          (cidr) => cidr === '0.0.0.0/0' || cidr === '::/0',
        );
        if (!isWideOpen) continue;

        // Protocol "-1" means all traffic, or ports covering full range
        const isAllPorts =
          rule.protocol === '-1' ||
          (rule.from_port === 0 && rule.to_port === 0) ||
          (rule.from_port === 0 && rule.to_port === 65535);

        if (isAllPorts) {
          warnings.push({
            ruleId: this.id,
            nodeId: node.id,
            severity: this.severity,
            message: `Security Group "${config.name || node.data.label || node.id}" has a wide-open egress rule to the public internet (0.0.0.0/0 or ::/0).`,
            suggestion:
              'Restrict egress traffic to the specific ports and CIDR blocks required by your application.',
          });
          break;
        }
      }
    }

    return warnings;
  }
}
