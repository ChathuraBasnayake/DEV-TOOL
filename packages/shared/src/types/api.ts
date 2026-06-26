import type { CanvasNode, CanvasEdge, CanvasState, AWSResourceType } from './canvas';
import type { TerraformOutput } from './compiler';
import type { SecurityWarning } from './guardrails';

// Compile
export interface CompileRequest {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  projectName: string;
}

export interface CompileResponse extends TerraformOutput {}

// Guardrails
export interface ScanRequest {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export interface ScanResponse {
  warnings: SecurityWarning[];
  summary: {
    critical: number;
    warning: number;
    info: number;
  };
}

// Validation
export interface ValidateConnectionRequest {
  sourceType: AWSResourceType;
  targetType: AWSResourceType;
}

export interface ValidateConnectionResponse {
  valid: boolean;
  label?: string;
  terraformEffect?: string;
}

export interface ValidateConfigRequest {
  resourceType: AWSResourceType;
  config: Record<string, unknown>;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ValidateConfigResponse {
  valid: boolean;
  errors: FieldError[];
}

// Projects
export interface CreateProjectRequest {
  name: string;
  canvas: CanvasState;
}

export interface UpdateProjectRequest {
  name?: string;
  canvas?: CanvasState;
}
