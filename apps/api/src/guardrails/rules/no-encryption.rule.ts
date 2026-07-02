import { BaseGuardrailRule } from './base.rule';
import type {
  CanvasNode,
  CanvasEdge,
  SecurityWarning,
  S3Config,
  RDSConfig,
  DynamoDBConfig,
} from '@canvascloud/shared';

export class NoEncryptionRule extends BaseGuardrailRule {
  readonly id = 'encryption-at-rest-disabled';
  readonly name = 'Encryption At Rest Disabled';
  readonly severity = 'warning' as const;
  readonly description =
    'Resources holding persistent data lack server-side encryption';

  evaluate(nodes: CanvasNode[], _edges: CanvasEdge[]): SecurityWarning[] {
    void _edges;
    const warnings: SecurityWarning[] = [];

    for (const node of nodes) {
      switch (node.data.resourceType) {
        case 's3': {
          const config = node.data.config as S3Config;
          if (!config || !config.sse_algorithm) {
            warnings.push({
              ruleId: this.id,
              nodeId: node.id,
              severity: this.severity,
              message: `S3 bucket "${config?.bucket || node.data.label || node.id}" does not have default server-side encryption configured.`,
              suggestion:
                'Set sse_algorithm (e.g. "AES256") to enforce encryption on new objects.',
            });
          }
          break;
        }

        case 'rds': {
          const config = node.data.config as RDSConfig;
          if (!config || config.storage_encrypted !== true) {
            warnings.push({
              ruleId: this.id,
              nodeId: node.id,
              severity: this.severity,
              message: `RDS database "${node.data.label || node.id}" is not encrypted at rest.`,
              suggestion:
                'Set storage_encrypted to true to enable KMS-managed volume encryption.',
            });
          }
          break;
        }

        case 'dynamodb': {
          const config = node.data.config as DynamoDBConfig;
          if (!config || config.server_side_encryption !== true) {
            warnings.push({
              ruleId: this.id,
              nodeId: node.id,
              severity: this.severity,
              message: `DynamoDB table "${config?.name || node.data.label || node.id}" does not have server-side encryption enabled.`,
              suggestion:
                'Set server_side_encryption to true to protect table data at rest.',
            });
          }
          break;
        }
      }
    }

    return warnings;
  }
}
