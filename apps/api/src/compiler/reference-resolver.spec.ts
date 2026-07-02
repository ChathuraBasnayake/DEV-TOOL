import { resolveReferences } from './reference-resolver';
import type { CanvasNode, CanvasEdge } from '@canvascloud/shared';

describe('ReferenceResolver', () => {
  it('should return empty list when there are no nodes or edges', () => {
    const results = resolveReferences([], []);
    expect(results).toEqual([]);
  });

  it('should successfully resolve standard networking and placement references', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-vpc-1',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: 'Main VPC',
          config: {},
        },
      },
      {
        id: 'node-subnet-1',
        type: 'awsNode',
        position: { x: 100, y: 100 },
        data: {
          resourceType: 'subnet',
          label: 'Public Subnet A',
          config: {},
        },
      },
      {
        id: 'node-ec2-1',
        type: 'awsNode',
        position: { x: 200, y: 200 },
        data: {
          resourceType: 'ec2',
          label: 'Web Server',
          config: {},
        },
      },
    ];

    const edges: CanvasEdge[] = [
      {
        id: 'edge-vpc-subnet',
        source: 'node-vpc-1',
        target: 'node-subnet-1',
      },
      {
        id: 'edge-subnet-ec2',
        source: 'node-subnet-1',
        target: 'node-ec2-1',
      },
    ];

    const refs = resolveReferences(nodes, edges);

    expect(refs).toHaveLength(2);

    // vpc -> subnet reference
    const vpcSubnetRef = refs.find(
      (r) =>
        r.sourceNodeId === 'node-vpc-1' && r.targetNodeId === 'node-subnet-1',
    );
    expect(vpcSubnetRef).toBeDefined();
    expect(vpcSubnetRef?.terraformField).toBe('vpc_id');
    expect(vpcSubnetRef?.terraformExpression).toBe('aws_vpc.main_vpc.id');
    expect(vpcSubnetRef?.isSynthetic).toBe(false);

    // subnet -> ec2 reference
    const subnetEc2Ref = refs.find(
      (r) =>
        r.sourceNodeId === 'node-subnet-1' && r.targetNodeId === 'node-ec2-1',
    );
    expect(subnetEc2Ref).toBeDefined();
    expect(subnetEc2Ref?.terraformField).toBe('subnet_id');
    expect(subnetEc2Ref?.terraformExpression).toBe(
      'aws_subnet.public_subnet_a.id',
    );
    expect(subnetEc2Ref?.isSynthetic).toBe(false);
  });

  it('should identify synthetic references correctly', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-rt-1',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'route-table',
          label: 'Public Route Table',
          config: {},
        },
      },
      {
        id: 'node-subnet-1',
        type: 'awsNode',
        position: { x: 100, y: 100 },
        data: {
          resourceType: 'subnet',
          label: 'Public Subnet',
          config: {},
        },
      },
    ];

    const edges: CanvasEdge[] = [
      {
        id: 'edge-rt-subnet',
        source: 'node-rt-1',
        target: 'node-subnet-1',
      },
    ];

    const refs = resolveReferences(nodes, edges);
    expect(refs).toHaveLength(1);
    expect(refs[0].terraformField).toBe('__synthetic__');
    expect(refs[0].isSynthetic).toBe(true);
    expect(refs[0].terraformExpression).toBe('aws_route_table_association');
  });

  it('should ignore edges that connect to non-existent nodes', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-vpc-1',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: 'Main VPC',
          config: {},
        },
      },
    ];

    const edges: CanvasEdge[] = [
      {
        id: 'edge-invalid',
        source: 'node-vpc-1',
        target: 'non-existent-node',
      },
    ];

    const refs = resolveReferences(nodes, edges);
    expect(refs).toHaveLength(0);
  });

  it('should ignore edges that do not have a defined ref map config', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-s3-1',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 's3',
          label: 'My Bucket',
          config: {},
        },
      },
      {
        id: 'node-vpc-1',
        type: 'awsNode',
        position: { x: 100, y: 100 },
        data: {
          resourceType: 'vpc',
          label: 'Main VPC',
          config: {},
        },
      },
    ];

    const edges: CanvasEdge[] = [
      {
        id: 'edge-s3-vpc', // Invalid AWS relationship
        source: 'node-s3-1',
        target: 'node-vpc-1',
      },
    ];

    const refs = resolveReferences(nodes, edges);
    expect(refs).toHaveLength(0);
  });
});
