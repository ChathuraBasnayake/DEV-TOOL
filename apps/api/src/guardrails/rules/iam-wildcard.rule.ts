import { BaseGuardrailRule } from './base.rule';
import type {
  CanvasNode,
  CanvasEdge,
  SecurityWarning,
  IAMPolicyConfig,
} from '@canvascloud/shared';

export class IAMWildcardRule extends BaseGuardrailRule {
  readonly id = 'iam-wildcard-permissions';
  readonly name = 'IAM Wildcard Permissions';
  readonly severity = 'critical' as const;
  readonly description = 'IAM policy document grants wildcard (*) permissions';

  evaluate(nodes: CanvasNode[], _edges: CanvasEdge[]): SecurityWarning[] {
    void _edges;
    const warnings: SecurityWarning[] = [];
    const policyNodes = nodes.filter(
      (n) => n.data.resourceType === 'iam-policy',
    );

    for (const policy of policyNodes) {
      const config = policy.data.config as IAMPolicyConfig;
      const doc = config?.policy_document;
      if (!doc) continue;

      try {
        const parsed = (
          typeof doc === 'string' ? JSON.parse(doc) : doc
        ) as Record<string, unknown>;
        const statements = Array.isArray(parsed['Statement'])
          ? (parsed['Statement'] as Record<string, unknown>[])
          : parsed['Statement']
            ? [parsed['Statement'] as Record<string, unknown>]
            : [];

        for (const stmt of statements) {
          const actionVal = stmt['Action'];
          const resourceVal = stmt['Resource'];

          const actions = Array.isArray(actionVal)
            ? (actionVal as unknown[])
            : actionVal
              ? [actionVal]
              : [];

          const resources = Array.isArray(resourceVal)
            ? (resourceVal as unknown[])
            : resourceVal
              ? [resourceVal]
              : [];

          const hasWildcardAction = actions.some(
            (act) => typeof act === 'string' && act === '*',
          );
          const hasWildcardResource = resources.some(
            (res) => typeof res === 'string' && res === '*',
          );

          if (hasWildcardAction || hasWildcardResource) {
            warnings.push({
              ruleId: this.id,
              nodeId: policy.id,
              severity: this.severity,
              message: `IAM Policy "${policy.data.label || policy.id}" contains broad wildcard (*) actions or resources.`,
              suggestion:
                'Enforce least-privilege by restricting the policy to specific AWS actions and resource ARNs.',
            });
          }
        }
      } catch {
        // Skip invalid JSON, caught by config validator
      }
    }

    return warnings;
  }
}
