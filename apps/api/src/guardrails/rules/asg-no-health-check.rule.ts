import { BaseGuardrailRule } from './base.rule';
import type { CanvasNode, CanvasEdge, SecurityWarning, ASGConfig } from '@canvascloud/shared';

export class ASGNoHealthCheckRule extends BaseGuardrailRule {
  readonly id = 'asg-missing-elb-healthcheck';
  readonly name = 'ASG Missing ELB Health Check';
  readonly severity = 'info' as const;
  readonly description = 'Auto Scaling Group connected to Target Group is not configured to use ELB health checks';

  evaluate(nodes: CanvasNode[], edges: CanvasEdge[]): SecurityWarning[] {
    const warnings: SecurityWarning[] = [];
    const asgNodes = nodes.filter(n => n.data.resourceType === 'asg');

    for (const asg of asgNodes) {
      // Check if ASG has an edge to a target group
      const hasTG = edges.some(e => {
        const targetNode = nodes.find(n => n.id === e.target);
        return targetNode && targetNode.data.resourceType === 'target-group' && e.source === asg.id;
      });

      if (!hasTG) continue;

      const config = asg.data.config as ASGConfig;
      if (!config || config.health_check_type !== 'ELB') {
        warnings.push({
          ruleId: this.id,
          nodeId: asg.id,
          severity: this.severity,
          message: `Auto Scaling Group "${asg.data.label || asg.id}" is connected to a Target Group but uses default EC2 health checks.`,
          suggestion: 'Set health_check_type to "ELB" to ensure scaling actions respect load balancer health checks.',
        });
      }
    }

    return warnings;
  }
}
