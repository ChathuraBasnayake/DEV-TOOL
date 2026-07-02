import type { AWSResourceType } from '../types/canvas.js';

export const NODE_COLORS: Record<AWSResourceType, string> = {
  // Compute
  'ec2':              'hsl(25, 90%, 55%)',
  'asg':              'hsl(20, 85%, 50%)',
  'launch-template':  'hsl(30, 80%, 55%)',

  // Networking
  'vpc':              'hsl(210, 80%, 55%)',
  'subnet':           'hsl(200, 70%, 50%)',
  'security-group':   'hsl(350, 80%, 55%)',
  'igw':              'hsl(45, 85%, 55%)',
  'nat-gw':           'hsl(50, 75%, 50%)',
  'route-table':      'hsl(215, 65%, 50%)',
  'eip':              'hsl(40, 80%, 55%)',

  // Load Balancing
  'alb':              'hsl(180, 65%, 45%)',
  'target-group':     'hsl(185, 60%, 48%)',

  // Database
  'rds':              'hsl(270, 70%, 55%)',
  'elasticache':      'hsl(280, 60%, 50%)',
  'dynamodb':         'hsl(260, 65%, 55%)',

  // Storage
  's3':               'hsl(145, 65%, 45%)',

  // Security
  'iam-role':         'hsl(0, 70%, 50%)',
  'iam-policy':       'hsl(5, 65%, 48%)',

  // Serverless
  'lambda':           'hsl(35, 95%, 55%)',
  'api-gateway':      'hsl(320, 70%, 50%)',

  // DNS & CDN
  'route53':          'hsl(220, 75%, 50%)',
  'cloudfront':       'hsl(190, 70%, 45%)',
};
