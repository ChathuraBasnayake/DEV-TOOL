import { BaseGuardrailRule } from './base.rule';
import type { CanvasNode, CanvasEdge, SecurityWarning, IAMPolicyConfig } from '@canvascloud/shared';

export class PublicLambdaRule extends BaseGuardrailRule {
  readonly id = 'overly-permissive-lambda-role';
  readonly name = 'Overly Permissive Lambda Role';
  readonly severity = 'warning' as const;
  readonly description = 'Lambda function associated with an IAM role that has wildcard or administrator policies';

  evaluate(nodes: CanvasNode[], edges: CanvasEdge[]): SecurityWarning[] {
    const warnings: SecurityWarning[] = [];
    const lambdaNodes = nodes.filter(n => n.data.resourceType === 'lambda');

    for (const lambda of lambdaNodes) {
      // Find the execution role connected to this lambda
      const roleEdge = edges.find(e => e.target === lambda.id && nodes.find(n => n.id === e.source)?.data.resourceType === 'iam-role');
      if (!roleEdge) continue;

      const roleNode = nodes.find(n => n.id === roleEdge.source);
      if (!roleNode) continue;

      // Find policies connected to this role
      const policyEdges = edges.filter(e => e.target === roleNode.id && nodes.find(n => n.id === e.source)?.data.resourceType === 'iam-policy');
      
      for (const pEdge of policyEdges) {
        const policyNode = nodes.find(n => n.id === pEdge.source);
        if (!policyNode) continue;

        const config = policyNode.data.config as IAMPolicyConfig;
        const name = config?.name || policyNode.data.label || '';
        const doc = config?.policy_document;

        const isBroadName = name.toLowerCase().includes('admin') || name.toLowerCase().includes('poweruser');
        let hasWildcard = false;

        if (doc) {
          try {
            const parsed = typeof doc === 'string' ? JSON.parse(doc) : doc;
            const statements = parsed.Statement || [];
            for (const stmt of Array.isArray(statements) ? statements : [statements]) {
              const actions = Array.isArray(stmt.Action) ? stmt.Action : [stmt.Action];
              const resources = Array.isArray(stmt.Resource) ? stmt.Resource : [stmt.Resource];
              
              if (actions.some((a: any) => a === '*') && resources.some((r: any) => r === '*')) {
                hasWildcard = true;
                break;
              }
            }
          } catch {
            // Ignore parse errors
          }
        }

        if (isBroadName || hasWildcard) {
          warnings.push({
            ruleId: this.id,
            nodeId: lambda.id,
            severity: this.severity,
            message: `Lambda function "${lambda.data.label || lambda.id}" uses an execution role "${roleNode.data.label || roleNode.id}" with administrative or wildcard permissions via policy "${name}".`,
            suggestion: 'Scope down the execution role permissions to only the AWS resources and APIs needed by the function.',
          });
          break;
        }
      }
    }

    return warnings;
  }
}
