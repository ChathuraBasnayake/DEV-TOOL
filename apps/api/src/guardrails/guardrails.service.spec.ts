import { Test, TestingModule } from '@nestjs/testing';
import { GuardrailsService } from './guardrails.service';
import type { CanvasNode, CanvasEdge } from '@canvascloud/shared';

describe('GuardrailsService', () => {
  let service: GuardrailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuardrailsService],
    }).compile();

    service = module.get<GuardrailsService>(GuardrailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should scan clean configurations and return zero findings', () => {
    const output = service.scan([], []);
    expect(output.warnings).toHaveLength(0);
    expect(output.summary.critical).toBe(0);
    expect(output.summary.warning).toBe(0);
    expect(output.summary.info).toBe(0);
  });

  it('should scan and aggregate warnings across multiple rules', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'node-s3',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 's3',
          label: 'Insecure Bucket',
          config: {
            bucket: 'my-bucket',
            acl: 'public-read',
            // sse_algorithm: missing -> triggers NoEncryptionRule
            // acl = public-read -> triggers PublicS3Rule
          },
          status: 'configured',
        },
      },
    ];

    const output = service.scan(nodes, []);

    // Expect PublicS3Rule (critical) and NoEncryptionRule (warning) to fire
    expect(output.summary.critical).toBe(1);
    expect(output.summary.warning).toBe(1);
    expect(output.summary.info).toBe(0);

    const ruleIds = output.warnings.map(w => w.ruleId);
    expect(ruleIds).toContain('public-s3-bucket');
    expect(ruleIds).toContain('encryption-at-rest-disabled');
  });
});
