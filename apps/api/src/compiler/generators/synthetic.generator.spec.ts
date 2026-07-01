import { SyntheticGenerator } from './synthetic.generator';
import { EC2Generator } from './ec2.generator';
import type { CanvasNode, CanvasEdge, TerraformReference } from '@canvascloud/shared';

describe('Synthetic Resource Generator', () => {
  let generator: SyntheticGenerator;

  beforeEach(() => {
    generator = new SyntheticGenerator();
  });

  it('should generate empty array if no edges are provided', () => {
    expect(generator.generate([], [])).toEqual([]);
  });

  it('should generate aws_route_table_association for route-table->subnet connection', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-rt',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'route-table',
          label: 'Public RT',
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
    ];

    const edges: CanvasEdge[] = [
      {
        id: 'edge-rt-subnet',
        source: 'node-rt',
        target: 'node-subnet',
      },
    ];

    const synthetic = generator.generate(nodes, edges);
    expect(synthetic).toHaveLength(1);
    expect(synthetic[0].type).toBe('aws_route_table_association');
    expect(synthetic[0].name).toBe('rt_assoc_public_rt_subnet_a');
    expect(synthetic[0].hcl).toContain('subnet_id      = aws_subnet.subnet_a.id');
    expect(synthetic[0].hcl).toContain('route_table_id = aws_route_table.public_rt.id');
  });

  it('should generate aws_apigatewayv2_integration, route, and permission for api-gateway->lambda connection', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-api',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'api-gateway',
          label: 'My API',
          config: {},
          status: 'configured',
        },
      },
      {
        id: 'node-lambda',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'lambda',
          label: 'My Lambda',
          config: {},
          status: 'configured',
        },
      },
    ];

    const edges: CanvasEdge[] = [
      {
        id: 'edge-api-lambda',
        source: 'node-api',
        target: 'node-lambda',
      },
    ];

    const synthetic = generator.generate(nodes, edges);
    expect(synthetic).toHaveLength(3);

    const integration = synthetic.find(r => r.type === 'aws_apigatewayv2_integration');
    expect(integration).toBeDefined();
    expect(integration?.hcl).toContain('integration_uri  = aws_lambda_function.my_lambda.arn');

    const route = synthetic.find(r => r.type === 'aws_apigatewayv2_route');
    expect(route).toBeDefined();
    expect(route?.hcl).toContain('route_key = "ANY /{proxy+}"');

    const permission = synthetic.find(r => r.type === 'aws_lambda_permission');
    expect(permission).toBeDefined();
    expect(permission?.hcl).toContain('principal     = "apigateway.amazonaws.com"');
  });

  it('should generate aws_iam_instance_profile for iam-role->ec2 connection', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-role',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'iam-role',
          label: 'App Role',
          config: {},
          status: 'configured',
        },
      },
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
    ];

    const edges: CanvasEdge[] = [
      {
        id: 'edge-role-ec2',
        source: 'node-role',
        target: 'node-ec2',
      },
    ];

    const synthetic = generator.generate(nodes, edges);
    expect(synthetic).toHaveLength(1);
    expect(synthetic[0].type).toBe('aws_iam_instance_profile');
    expect(synthetic[0].name).toBe('web_server_profile');
    expect(synthetic[0].hcl).toContain('role = aws_iam_role.app_role.name');

    // Verify EC2 Generator links it
    const ec2Gen = new EC2Generator();
    const refs: TerraformReference[] = [
      {
        sourceNodeId: 'node-role',
        targetNodeId: 'node-ec2',
        terraformField: '__synthetic__',
        terraformExpression: 'aws_iam_instance_profile',
        isSynthetic: true,
      },
    ];
    const ec2Hcl = ec2Gen.generate(nodes[1], refs);
    expect(ec2Hcl).toContain('iam_instance_profile = aws_iam_instance_profile.web_server_profile.name');
  });
});
