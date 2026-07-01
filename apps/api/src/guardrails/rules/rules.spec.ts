import { ALL_RULES } from './index';
import { OpenSGRule } from './open-sg.rule';
import { PublicRDSRule } from './public-rds.rule';
import { IAMWildcardRule } from './iam-wildcard.rule';
import { PublicS3Rule } from './public-s3.rule';
import { NoSGAttachedRule } from './no-sg-attached.rule';
import type { CanvasNode, CanvasEdge } from '@canvascloud/shared';

describe('Security Guardrails Rules', () => {
  it('should list all 14 rules in the registry', () => {
    expect(ALL_RULES).toHaveLength(14);
  });

  describe('OpenSGRule', () => {
    const rule = new OpenSGRule();

    it('should flag ingress rule exposing port 22 to 0.0.0.0/0', () => {
      const nodes: CanvasNode[] = [
        {
          id: 'sg-1',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 'security-group',
            label: 'Web SG',
            config: {
              name: 'web-sg',
              ingressRules: [
                {
                  from_port: 22,
                  to_port: 22,
                  protocol: 'tcp',
                  cidr_blocks: ['0.0.0.0/0'],
                },
              ],
            },
            status: 'configured',
          },
        },
      ];

      const warnings = rule.evaluate(nodes, []);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe('critical');
      expect(warnings[0].message).toContain('exposes sensitive port(s) [22]');
    });

    it('should not flag ingress rule exposing port 80 to 0.0.0.0/0', () => {
      const nodes: CanvasNode[] = [
        {
          id: 'sg-1',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 'security-group',
            label: 'Web SG',
            config: {
              name: 'web-sg',
              ingressRules: [
                {
                  from_port: 80,
                  to_port: 80,
                  protocol: 'tcp',
                  cidr_blocks: ['0.0.0.0/0'],
                },
              ],
            },
            status: 'configured',
          },
        },
      ];

      const warnings = rule.evaluate(nodes, []);
      expect(warnings).toHaveLength(0);
    });
  });

  describe('PublicRDSRule', () => {
    const rule = new PublicRDSRule();

    it('should flag RDS node set to publicly accessible', () => {
      const nodes: CanvasNode[] = [
        {
          id: 'rds-1',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 'rds',
            label: 'My Database',
            config: {
              allocated_storage: 20,
              engine: 'postgres',
              instance_class: 'db.t3.micro',
              publicly_accessible: true,
            },
            status: 'configured',
          },
        },
      ];

      const warnings = rule.evaluate(nodes, []);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe('critical');
      expect(warnings[0].message).toContain('publicly_accessible enabled');
    });
  });

  describe('IAMWildcardRule', () => {
    const rule = new IAMWildcardRule();

    it('should flag policy document with wildcard resource', () => {
      const nodes: CanvasNode[] = [
        {
          id: 'policy-1',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 'iam-policy',
            label: 'Admin Policy',
            config: {
              name: 'admin-policy',
              policy_document: JSON.stringify({
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: 's3:GetObject',
                    Resource: '*',
                  },
                ],
              }),
            },
            status: 'configured',
          },
        },
      ];

      const warnings = rule.evaluate(nodes, []);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe('critical');
      expect(warnings[0].message).toContain('broad wildcard (*) actions or resources');
    });
  });

  describe('PublicS3Rule', () => {
    const rule = new PublicS3Rule();

    it('should flag bucket with public read ACL', () => {
      const nodes: CanvasNode[] = [
        {
          id: 's3-1',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 's3',
            label: 'Public Bucket',
            config: {
              bucket: 'my-public-bucket',
              acl: 'public-read',
            },
            status: 'configured',
          },
        },
      ];

      const warnings = rule.evaluate(nodes, []);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe('critical');
      expect(warnings[0].message).toContain('public read permissions');
    });
  });

  describe('NoSGAttachedRule', () => {
    const rule = new NoSGAttachedRule();

    it('should flag EC2 node that has no connected security group', () => {
      const nodes: CanvasNode[] = [
        {
          id: 'ec2-1',
          type: 'awsNode',
          position: { x: 0, y: 0 },
          data: {
            resourceType: 'ec2',
            label: 'Isolated Server',
            config: {
              ami: 'ami-123',
              instance_type: 't3.micro',
            },
            status: 'configured',
          },
        },
      ];

      const warnings = rule.evaluate(nodes, []);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe('warning');
      expect(warnings[0].message).toContain('has no Security Group attached');
    });
  });
});
