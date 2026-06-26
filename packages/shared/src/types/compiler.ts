export interface TerraformFile {
  filename: string;
  content: string;
}

export interface TerraformOutput {
  files: TerraformFile[];
  warnings: CompilerWarning[];
  syntheticResources: SyntheticResource[];
}

export interface TerraformReference {
  sourceNodeId: string;
  targetNodeId: string;
  terraformField: string;
  terraformExpression: string;
  isSynthetic: boolean;
}

export interface SyntheticResource {
  type: string;
  name: string;
  generatedFrom: string;
  hcl: string;
}

export interface CompilerWarning {
  nodeId: string;
  field: string;
  message: string;
}
