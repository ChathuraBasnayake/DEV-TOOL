import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { IncomingMessage } from 'http';
import JSZip from 'jszip';
import { CompilerModule } from './compiler.module';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import type { CanvasNode, CanvasEdge } from '@canvascloud/shared';

describe('CompilerController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CompilerModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Register transform interceptor to match the real application pipeline
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const payload = {
    nodes: [
      {
        id: 'node-vpc',
        type: 'awsNode',
        position: { x: 0, y: 0 },
        data: {
          resourceType: 'vpc',
          label: 'My VPC',
          config: {
            cidr_block: '10.0.0.0/16',
          },
          status: 'configured',
        },
      },
    ] as CanvasNode[],
    edges: [] as CanvasEdge[],
  };

  it('POST /compile - should compile and return HCL file structures in JSON', async () => {
    const res = await request(
      app.getHttpServer() as Parameters<typeof request>[0],
    )
      .post('/compile')
      .send(payload)
      .expect(201);

    const body = res.body as {
      success: boolean;
      data: { files: { filename: string; content: string }[] };
    };
    expect(body.success).toBe(true);
    const data = body.data;
    expect(data.files).toBeDefined();
    expect(data.files).toHaveLength(5);

    const mainFile = data.files.find((f) => f.filename === 'main.tf');
    expect(mainFile).toBeDefined();
    expect(mainFile?.content).toContain('resource "aws_vpc" "my_vpc"');
  });

  it('POST /compile/download - should compile and download files as a ZIP archive', async () => {
    const res = await request(
      app.getHttpServer() as Parameters<typeof request>[0],
    )
      .post('/compile/download')
      .send(payload)
      .parse(
        (
          response: IncomingMessage,
          callback: (err: Error | null, body: Buffer) => void,
        ) => {
          let data = Buffer.from([]);
          response.on('data', (chunk: Buffer) => {
            data = Buffer.concat([data, chunk]);
          });
          response.on('end', () => {
            callback(null, data);
          });
        },
      )
      .expect(201);

    // Verify headers
    expect(res.headers['content-type']).toBe('application/zip');
    expect(res.headers['content-disposition']).toContain(
      'attachment; filename="terraform.zip"',
    );

    // Parse ZIP buffer using JSZip to verify content integrity
    const buffer = res.body as Buffer;
    expect(Buffer.isBuffer(buffer)).toBe(true);

    const zip = await JSZip.loadAsync(buffer);
    const files = Object.keys(zip.files);

    expect(files).toContain('main.tf');
    expect(files).toContain('variables.tf');
    expect(files).toContain('outputs.tf');
    expect(files).toContain('terraform.tf');
    expect(files).toContain('provider.tf');

    const mainContent = await zip.files['main.tf'].async('string');
    expect(mainContent).toContain('resource "aws_vpc" "my_vpc"');
  });
});
