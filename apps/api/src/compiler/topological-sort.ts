import { toTerraformName } from '@canvascloud/shared';
import type {
  CanvasNode,
  CanvasEdge,
  AWSResourceType,
} from '@canvascloud/shared';

export const RESOURCE_TIERS: Record<AWSResourceType, number> = {
  // Tier 0 — No Dependencies (Foundation)
  vpc: 0,
  'iam-policy': 0,
  eip: 0,
  s3: 0,
  route53: 0,
  dynamodb: 0,

  // Tier 1 — Depends on Tier 0
  igw: 1,
  subnet: 1,
  'security-group': 1,
  'route-table': 1,
  'iam-role': 1,

  // Tier 2 — Depends on Tier 1
  'nat-gw': 2,
  'launch-template': 2,
  lambda: 2,

  // Tier 3 — Depends on Tier 2
  ec2: 3,
  rds: 3,
  elasticache: 3,
  alb: 3,
  asg: 3,
  'api-gateway': 3,

  // Tier 4 — Depends on Tier 3
  'target-group': 4,
  cloudfront: 4,
};

export function sortNodes(
  nodes: CanvasNode[],
  _edges?: CanvasEdge[],
): CanvasNode[] {
  void _edges;
  // Clone the array to avoid mutating the original input
  const sortedNodes = [...nodes];

  sortedNodes.sort((a, b) => {
    const tierA = RESOURCE_TIERS[a.data.resourceType] ?? 99;
    const tierB = RESOURCE_TIERS[b.data.resourceType] ?? 99;

    if (tierA !== tierB) {
      return tierA - tierB;
    }

    // Stable sorting tie-breaker: alphabetical by Terraform name
    const nameA = toTerraformName(a.data.label || a.id);
    const nameB = toTerraformName(b.data.label || b.id);

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  return sortedNodes;
}
