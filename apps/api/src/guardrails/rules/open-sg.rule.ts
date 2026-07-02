import { BaseGuardrailRule } from './base.rule';
import type {
  CanvasNode,
  CanvasEdge,
  SecurityWarning,
  SecurityGroupConfig,
} from '@canvascloud/shared';

export class OpenSGRule extends BaseGuardrailRule {
  readonly id = 'open-sg-ports';
  readonly name = 'Open Security Group Ports';
  readonly severity = 'critical' as const;
  readonly description =
    'Inbound security group rules allow access to sensitive ports from any IP address';

  evaluate(nodes: CanvasNode[], _edges: CanvasEdge[]): SecurityWarning[] {
    void _edges;
    const warnings: SecurityWarning[] = [];
    const sensitivePorts = [22, 3389, 3306, 5432, 6379, 27017];

    const sgNodes = nodes.filter(
      (n) => n.data.resourceType === 'security-group',
    );

    for (const node of sgNodes) {
      const config = node.data.config as SecurityGroupConfig;
      if (!config || !config.ingressRules) continue;

      for (const rule of config.ingressRules) {
        const isWideOpen = rule.cidr_blocks?.some(
          (cidr) => cidr === '0.0.0.0/0' || cidr === '::/0',
        );
        if (!isWideOpen) continue;

        // Check if any port in the rule range is sensitive
        const from = rule.from_port;
        const to = rule.to_port;

        const exposedSensitivePorts = sensitivePorts.filter((port) => {
          // Protocol "-1" means all ports
          if (rule.protocol === '-1') return true;
          return port >= from && port <= to;
        });

        if (exposedSensitivePorts.length > 0) {
          warnings.push({
            ruleId: this.id,
            nodeId: node.id,
            severity: this.severity,
            message: `Security Group "${config.name || node.data.label || node.id}" exposes sensitive port(s) [${exposedSensitivePorts.join(', ')}] to the open internet (0.0.0.0/0 or ::/0).`,
            suggestion:
              'Restrict ingress CIDRs to specific trusted IP ranges or reference specific Security Groups.',
          });
        }
      }
    }

    return warnings;
  }
}
