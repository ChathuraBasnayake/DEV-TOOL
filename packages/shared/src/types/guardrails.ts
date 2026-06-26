export type Severity = 'critical' | 'warning' | 'info';

export interface SecurityWarning {
  ruleId: string;
  nodeId: string;
  severity: Severity;
  message: string;
  suggestion: string;
}

export interface GuardrailRule {
  id: string;
  name: string;
  severity: Severity;
  description: string;
}
