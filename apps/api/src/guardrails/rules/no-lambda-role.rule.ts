import { BaseGuardrailRule } from './base.rule';
import type {
  CanvasNode,
  CanvasEdge,
  SecurityWarning,
} from '@canvascloud/shared';

export class NoLambdaRoleRule extends BaseGuardrailRule {
  readonly id = 'missing-lambda-execution-role';
  readonly name = 'Missing Lambda Execution Role';
  readonly severity = 'warning' as const;
  readonly description =
    'Lambda function deployed without an associated IAM execution role';

  evaluate(nodes: CanvasNode[], edges: CanvasEdge[]): SecurityWarning[] {
    const warnings: SecurityWarning[] = [];
    const lambdaNodes = nodes.filter((n) => n.data.resourceType === 'lambda');

    for (const lambda of lambdaNodes) {
      // Check if there is an edge connecting an iam-role to this lambda
      const hasRole = edges.some((e) => {
        const sourceNode = nodes.find((n) => n.id === e.source);
        return (
          sourceNode &&
          sourceNode.data.resourceType === 'iam-role' &&
          e.target === lambda.id
        );
      });

      if (!hasRole) {
        warnings.push({
          ruleId: this.id,
          nodeId: lambda.id,
          severity: this.severity,
          message: `Lambda function "${lambda.data.label || lambda.id}" has no IAM Execution Role attached.`,
          suggestion:
            'Create an IAM Role and draw a connection to this Lambda function.',
        });
      }
    }

    return warnings;
  }
}
