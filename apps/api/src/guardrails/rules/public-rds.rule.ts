import { BaseGuardrailRule } from './base.rule';
import type {
  CanvasNode,
  CanvasEdge,
  SecurityWarning,
  RDSConfig,
} from '@canvascloud/shared';

export class PublicRDSRule extends BaseGuardrailRule {
  readonly id = 'public-rds-instance';
  readonly name = 'Public RDS Instance';
  readonly severity = 'critical' as const;
  readonly description =
    'RDS database instances configured to be publicly accessible';

  evaluate(nodes: CanvasNode[], _edges: CanvasEdge[]): SecurityWarning[] {
    void _edges;
    const warnings: SecurityWarning[] = [];
    const rdsNodes = nodes.filter((n) => n.data.resourceType === 'rds');

    for (const node of rdsNodes) {
      const config = node.data.config as RDSConfig;
      if (config && config.publicly_accessible === true) {
        warnings.push({
          ruleId: this.id,
          nodeId: node.id,
          severity: this.severity,
          message: `RDS database "${node.data.label || node.id}" has publicly_accessible enabled.`,
          suggestion:
            'Set publicly_accessible to false and associate the database with private subnets.',
        });
      }
    }

    return warnings;
  }
}
