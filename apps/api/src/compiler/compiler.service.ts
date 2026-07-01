import { Injectable } from '@nestjs/common';
import type {
  CanvasNode,
  CanvasEdge,
  TerraformOutput,
  TerraformFile,
  CompilerWarning,
} from '@canvascloud/shared';
import { sortNodes } from './topological-sort';
import { resolveReferences } from './reference-resolver';
import { formatHCL } from './hcl-formatter';
import { GENERATORS } from './generators';
import { SYNTHETIC_GENERATOR } from './generators/synthetic.generator';
import { PROVIDER_GENERATOR } from './generators/provider.generator';
import { VARIABLES_GENERATOR } from './generators/variables.generator';
import { OUTPUTS_GENERATOR } from './generators/outputs.generator';

@Injectable()
export class CompilerService {
  compile(nodes: CanvasNode[], edges: CanvasEdge[]): TerraformOutput {
    // 1. Topological sort nodes to handle resource dependencies
    const sortedNodes = sortNodes(nodes, edges);

    // 2. Resolve edge connections into Terraform logical references
    const references = resolveReferences(nodes, edges);

    const nodeHclBlocks: string[] = [];
    const warnings: CompilerWarning[] = [];

    // 3. Compile HCL for each individual canvas resource node
    for (const node of sortedNodes) {
      const generator = GENERATORS[node.data.resourceType];
      if (generator) {
        try {
          const hcl = generator.generate(node, references);
          if (hcl) {
            nodeHclBlocks.push(hcl);
          }
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : String(error);
          warnings.push({
            nodeId: node.id,
            field: 'config',
            message: `HCL generation failed: ${errMsg}`,
          });
        }
      } else {
        warnings.push({
          nodeId: node.id,
          field: 'type',
          message: `No HCL generator registered for resource type: ${node.data.resourceType}`,
        });
      }
    }

    // 4. Compile HCL for synthetic intermediate glue resources
    const syntheticResources = SYNTHETIC_GENERATOR.generate(nodes, edges);
    const syntheticHclBlocks = syntheticResources.map((r) => r.hcl);

    // 5. Combine and format main.tf
    const rawMainHcl = [...nodeHclBlocks, ...syntheticHclBlocks].join('\n\n');
    const mainHcl = formatHCL(rawMainHcl);

    // 6. Generate and format ancillary Terraform files
    const terraformHcl = formatHCL(
      PROVIDER_GENERATOR.generateRequiredProviders(),
    );
    const providerHcl = formatHCL(PROVIDER_GENERATOR.generateProvider());
    const variablesHcl = formatHCL(
      VARIABLES_GENERATOR.generateVariables(nodes),
    );
    const outputsHcl = formatHCL(OUTPUTS_GENERATOR.generateOutputs(nodes));

    // 7. Assemble final file bundle list
    const files: TerraformFile[] = [
      { filename: 'main.tf', content: mainHcl },
      { filename: 'variables.tf', content: variablesHcl },
      { filename: 'outputs.tf', content: outputsHcl },
      { filename: 'terraform.tf', content: terraformHcl },
      { filename: 'provider.tf', content: providerHcl },
    ];

    return {
      files,
      warnings,
      syntheticResources,
    };
  }
}
