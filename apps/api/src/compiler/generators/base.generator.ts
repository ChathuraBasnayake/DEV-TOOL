import type { CanvasNode, TerraformReference } from '@canvascloud/shared';

export abstract class BaseGenerator {
  abstract readonly resourceType: string;

  abstract generate(node: CanvasNode, references: TerraformReference[]): string;

  // Find a reference targeting a specific config field on this node
  protected findReference(
    nodeId: string,
    field: string,
    references: TerraformReference[],
  ): TerraformReference | undefined {
    // Check incoming references (e.g. subnet -> ec2, field = subnet_id, target = ec2)
    const incoming = references.find(
      (r) => r.targetNodeId === nodeId && r.terraformField === field,
    );
    if (incoming) return incoming;

    // Check outgoing references (e.g. asg -> subnet, field = vpc_zone_identifier, source = asg)
    const outgoing = references.find(
      (r) => r.sourceNodeId === nodeId && r.terraformField === field,
    );
    return outgoing;
  }

  // Find multiple references targeting a specific field on this node (e.g. SGs or subnets arrays)
  protected findReferences(
    nodeId: string,
    field: string,
    references: TerraformReference[],
  ): TerraformReference[] {
    const incoming = references.filter(
      (r) => r.targetNodeId === nodeId && r.terraformField === field,
    );
    const outgoing = references.filter(
      (r) => r.sourceNodeId === nodeId && r.terraformField === field,
    );
    return [...incoming, ...outgoing];
  }

  // Format HCL tags block
  protected formatTags(
    tags?: Record<string, string>,
    defaultName?: string,
  ): string {
    const allTags = { ...tags };
    if (defaultName && !allTags.Name) {
      allTags.Name = defaultName;
    }
    if (Object.keys(allTags).length === 0) return '';
    const lines = Object.entries(allTags)
      .map(([k, v]) => `  ${k} = "${v}"`)
      .join('\n');
    return `tags = {\n${lines}\n}`;
  }

  // Helper to indent multi-line strings
  protected indent(str: string, spaces: number): string {
    const indentStr = ' '.repeat(spaces);
    return str
      .split('\n')
      .map((line) => (line ? indentStr + line : ''))
      .join('\n');
  }
}
