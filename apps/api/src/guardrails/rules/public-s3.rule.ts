import { BaseGuardrailRule } from './base.rule';
import type {
  CanvasNode,
  CanvasEdge,
  SecurityWarning,
  S3Config,
} from '@canvascloud/shared';

export class PublicS3Rule extends BaseGuardrailRule {
  readonly id = 'public-s3-bucket';
  readonly name = 'Public S3 Bucket';
  readonly severity = 'critical' as const;
  readonly description = 'S3 bucket configured to allow public access';

  evaluate(nodes: CanvasNode[], _edges: CanvasEdge[]): SecurityWarning[] {
    void _edges;
    const warnings: SecurityWarning[] = [];
    const s3Nodes = nodes.filter((n) => n.data.resourceType === 's3');

    for (const node of s3Nodes) {
      const config = node.data.config as S3Config;
      if (!config) continue;

      const isPublicACL = config.acl === 'public-read';
      const isPublicBlockDisabled = config.block_public_access === false;

      if (isPublicACL || isPublicBlockDisabled) {
        warnings.push({
          ruleId: this.id,
          nodeId: node.id,
          severity: this.severity,
          message: `S3 bucket "${config.bucket || node.data.label || node.id}" has public read permissions or has public access block disabled.`,
          suggestion:
            'Set bucket ACL to private and enable Block Public Access unless this bucket is hosting a public static website.',
        });
      }
    }

    return warnings;
  }
}
