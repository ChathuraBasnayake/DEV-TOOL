import { sortNodes } from './topological-sort';
import type { CanvasNode } from '@canvascloud/shared';

describe('TopologicalSort', () => {
  it('should handle empty lists', () => {
    expect(sortNodes([])).toEqual([]);
  });

  it('should preserve ordering for a single node', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-vpc',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: 'VPC',
          config: {},
          status: 'configured',
        },
      },
    ];
    expect(sortNodes(nodes)).toEqual(nodes);
  });

  it('should correctly sort nodes by their tiers', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-ec2',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'ec2',
          label: 'Web Server',
          config: {},
          status: 'configured',
        },
      },
      {
        id: 'node-subnet',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'subnet',
          label: 'Subnet A',
          config: {},
          status: 'configured',
        },
      },
      {
        id: 'node-vpc',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: 'VPC',
          config: {},
          status: 'configured',
        },
      },
      {
        id: 'node-tg',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'target-group',
          label: 'Target Group',
          config: {},
          status: 'configured',
        },
      },
    ];

    const sorted = sortNodes(nodes);

    expect(sorted.map((n) => n.data.resourceType)).toEqual([
      'vpc', // Tier 0
      'subnet', // Tier 1
      'ec2', // Tier 3
      'target-group', // Tier 4
    ]);
  });

  it('should break ties alphabetically within the same tier', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-vpc-b',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: 'Beta VPC',
          config: {},
          status: 'configured',
        },
      },
      {
        id: 'node-vpc-c',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: 'Charlie VPC',
          config: {},
          status: 'configured',
        },
      },
      {
        id: 'node-vpc-a',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: 'Alpha VPC',
          config: {},
          status: 'configured',
        },
      },
    ];

    const sorted = sortNodes(nodes);

    expect(sorted.map((n) => n.data.label)).toEqual([
      'Alpha VPC',
      'Beta VPC',
      'Charlie VPC',
    ]);
  });

  it('should fall back to node ID for alphabetical tie-breaking if label is missing', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'vpc-z',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: '',
          config: {},
          status: 'configured',
        },
      },
      {
        id: 'vpc-x',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: '',
          config: {},
          status: 'configured',
        },
      },
      {
        id: 'vpc-y',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: '',
          config: {},
          status: 'configured',
        },
      },
    ];

    const sorted = sortNodes(nodes);

    expect(sorted.map((n) => n.id)).toEqual(['vpc-x', 'vpc-y', 'vpc-z']);
  });
});
