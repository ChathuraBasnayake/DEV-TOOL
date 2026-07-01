import { BaseGuardrailRule } from './base.rule';
import type { CanvasNode, CanvasEdge, SecurityWarning, IAMPolicyConfig } from '@canvascloud/shared';

export class IAMWildcardRule extends BaseGuardrailRule {
  readonly id = 'iam-wildcard-permissions';
  readonly name = 'IAM Wildcard Permissions';
  readonly severity = 'critical' as const;
  readonly description = 'IAM policy document grants wildcard (*) permissions';

  evaluate(nodes: CanvasNode[], edges: CanvasEdge[]): SecurityWarning[] {
    const warnings: SecurityWarning[] = [];
    const policyNodes = nodes.filter(n => n.data.resourceType === 'iam-policy');

    for (const policy of policyNodes) {
      const config = policy.data.config as IAMPolicyConfig;
      const doc = config?.policy_document;
      if (!doc) continue;

      try {
        const parsed = typeof doc === 'string' ? JSON.parse(doc) : doc;
        const statements = parsed.Statement || [];
        
        for (const stmt of Array.isArray(statements) ? statements : [statements]) {
          const actions = Array.isArray(stmt.Action) ? stmt.Action : [stmt.Action];
          const resources = Array.isArray(stmt.Resource) ? stmt.Resource : [stmt.Resource];

          const hasWildcardAction = actions.some((act: any) => act === '*');
          const hasWildcardResource = resources.some((res: any) => res === '*');

          if (hasWildcardAction || hasWildcardResource) {
            warnings.push({
              ruleId: this.id,
              nodeId: policy.id,
              severity: this.severity,
              message: `IAM Policy "${policy.data.label || policy.id}" contains broad wildcard (*) actions or resources.`,
              suggestion: 'Enforce least-privilege by restricting the policy to specific AWS actions and resource ARNs.',
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
