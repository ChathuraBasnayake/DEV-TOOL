import { Test, TestingModule } from '@nestjs/testing';
import { CompilerService } from './compiler.service';
import type { CanvasNode, CanvasEdge } from '@canvascloud/shared';

describe('CompilerService', () => {
  let service: CompilerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompilerService],
    }).compile();

    service = module.get<CompilerService>(CompilerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should compile an empty canvas into default structural HCL files', () => {
    const output = service.compile([], []);
    expect(output.files).toHaveLength(5);

    const filenames = output.files.map((f) => f.filename);
    expect(filenames).toContain('main.tf');
    expect(filenames).toContain('variables.tf');
    expect(filenames).toContain('outputs.tf');
    expect(filenames).toContain('terraform.tf');
    expect(filenames).toContain('provider.tf');

    const mainFile = output.files.find((f) => f.filename === 'main.tf');
    expect(mainFile?.content.trim()).toBe('');

    const terraformFile = output.files.find(
      (f) => f.filename === 'terraform.tf',
    );
    expect(terraformFile?.content).toContain('required_providers {');
  });

  it('should compile visual nodes and resolve inter-resource references', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-vpc',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: 'Main VPC',
          config: {
            cidr_block: '10.0.0.0/16',
          },
          status: 'configured',
        },
      },
      {
        id: 'node-subnet',
        type: 'awsNode',
        position: { x: 100, y: 100 },
        data: {
          resourceType: 'subnet',
          label: 'App Subnet',
          config: {
            cidr_block: '10.0.1.0/24',
          },
          status: 'configured',
        },
      },
      {
        id: 'node-ec2',
        type: 'awsNode',
        position: { x: 200, y: 200 },
        data: {
          resourceType: 'ec2',
          label: 'Web Host',
          config: {
            ami: 'ami-12345678',
            instance_type: 't3.micro',
          },
          status: 'configured',
        },
      },
    ];

    const edges: CanvasEdge[] = [
      {
        id: 'edge-vpc-subnet',
        source: 'node-vpc',
        target: 'node-subnet',
      },
      {
        id: 'edge-subnet-ec2',
        source: 'node-subnet',
        target: 'node-ec2',
      },
    ];

    const output = service.compile(nodes, edges);

    expect(output.warnings).toHaveLength(0);
    expect(output.syntheticResources).toHaveLength(0);

    const mainFile = output.files.find((f) => f.filename === 'main.tf');
    expect(mainFile).toBeDefined();

    const content = mainFile?.content;

    // Check vpc is defined first (due to topological sort!)
    expect(content).toContain('resource "aws_vpc" "main_vpc" {');

    // Check subnet references VPC
    expect(content).toContain('resource "aws_subnet" "app_subnet" {');
    expect(content).toContain('vpc_id            = aws_vpc.main_vpc.id');

    // Check ec2 references subnet
    expect(content).toContain('resource "aws_instance" "web_host" {');
    expect(content).toContain('subnet_id     = aws_subnet.app_subnet.id');
  });
});
