import { Injectable } from '@nestjs/common';
import type {
  CanvasNode,
  CanvasEdge,
  ScanResponse,
  SecurityWarning,
} from '@canvascloud/shared';
import { ALL_RULES } from './rules';

@Injectable()
export class GuardrailsService {
  scan(nodes: CanvasNode[], edges: CanvasEdge[]): ScanResponse {
    const warnings: SecurityWarning[] = [];

    // Run each security rule against the canvas topology
    for (const rule of ALL_RULES) {
      try {
        const ruleWarnings = rule.evaluate(nodes, edges);
        warnings.push(...ruleWarnings);
      } catch (error) {
        // Log the failure but don't let it crash the other checks
        console.error(`Rule evaluation error for rule "${rule.id}":`, error);
      }
    }

    // Aggregate severity summaries
    const summary = {
      critical: warnings.filter((w) => w.severity === 'critical').length,
      warning: warnings.filter((w) => w.severity === 'warning').length,
      info: warnings.filter((w) => w.severity === 'info').length,
    };

    return {
      warnings,
      summary,
    };
  }
}
