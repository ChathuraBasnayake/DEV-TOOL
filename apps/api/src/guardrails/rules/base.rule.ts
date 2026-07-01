import type { CanvasNode, CanvasEdge, SecurityWarning, Severity } from '@canvascloud/shared';

export abstract class BaseGuardrailRule {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly severity: Severity;
  abstract readonly description: string;

  abstract evaluate(nodes: CanvasNode[], edges: CanvasEdge[]): SecurityWarning[];
}
