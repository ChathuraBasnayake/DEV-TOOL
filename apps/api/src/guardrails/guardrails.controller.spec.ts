import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { GuardrailsModule } from './guardrails.module';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import type { CanvasNode, CanvasEdge } from '@canvascloud/shared';

describe('GuardrailsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GuardrailsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /scan - should evaluate canvas and return structured warning summary', async () => {
    const payload = {
      nodes: [
        {
          id: 'node-rds',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 'rds',
            label: 'Public DB',
            config: {
              allocated_storage: 20,
              engine: 'mysql',
              instance_class: 'db.t3.micro',
              publicly_accessible: true,
            },
            status: 'configured',
          },
        },
      ] as CanvasNode[],
      edges: [] as CanvasEdge[],
    };

    const res = await request(app.getHttpServer())
      .post('/scan')
      .send(payload)
      .expect(201);

    expect(res.body.success).toBe(true);
    const data = res.body.data;
    
    expect(data.warnings).toBeDefined();
    expect(data.summary).toBeDefined();
    
    // Critical publicly accessible database warning should trigger
    expect(data.summary.critical).toBeGreaterThanOrEqual(1);

    const publicRDSWarning = data.warnings.find((w: any) => w.ruleId === 'public-rds-instance');
    expect(publicRDSWarning).toBeDefined();
    expect(publicRDSWarning.severity).toBe('critical');
  });
});
