export const AWS_REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' },
  { value: 'eu-west-2', label: 'EU (London)' },
  { value: 'eu-central-1', label: 'EU (Frankfurt)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
  { value: 'sa-east-1', label: 'South America (São Paulo)' },
  { value: 'ca-central-1', label: 'Canada (Central)' },
] as const;

export const EC2_INSTANCE_TYPES = [
  // General Purpose
  { value: 't3.nano', label: 't3.nano (2 vCPU, 0.5 GB)', category: 'General Purpose' },
  { value: 't3.micro', label: 't3.micro (2 vCPU, 1 GB)', category: 'General Purpose' },
  { value: 't3.small', label: 't3.small (2 vCPU, 2 GB)', category: 'General Purpose' },
  { value: 't3.medium', label: 't3.medium (2 vCPU, 4 GB)', category: 'General Purpose' },
  { value: 't3.large', label: 't3.large (2 vCPU, 8 GB)', category: 'General Purpose' },
  { value: 't3.xlarge', label: 't3.xlarge (4 vCPU, 16 GB)', category: 'General Purpose' },
  { value: 't3.2xlarge', label: 't3.2xlarge (8 vCPU, 32 GB)', category: 'General Purpose' },
  { value: 'm5.large', label: 'm5.large (2 vCPU, 8 GB)', category: 'General Purpose' },
  { value: 'm5.xlarge', label: 'm5.xlarge (4 vCPU, 16 GB)', category: 'General Purpose' },
  { value: 'm5.2xlarge', label: 'm5.2xlarge (8 vCPU, 32 GB)', category: 'General Purpose' },
  // Compute Optimized
  { value: 'c5.large', label: 'c5.large (2 vCPU, 4 GB)', category: 'Compute Optimized' },
  { value: 'c5.xlarge', label: 'c5.xlarge (4 vCPU, 8 GB)', category: 'Compute Optimized' },
  { value: 'c5.2xlarge', label: 'c5.2xlarge (8 vCPU, 16 GB)', category: 'Compute Optimized' },
  // Memory Optimized
  { value: 'r5.large', label: 'r5.large (2 vCPU, 16 GB)', category: 'Memory Optimized' },
  { value: 'r5.xlarge', label: 'r5.xlarge (4 vCPU, 32 GB)', category: 'Memory Optimized' },
  { value: 'r5.2xlarge', label: 'r5.2xlarge (8 vCPU, 64 GB)', category: 'Memory Optimized' },
] as const;

export const RDS_DB_ENGINES = [
  { value: 'mysql', label: 'MySQL', versions: ['8.0', '5.7'] },
  { value: 'postgres', label: 'PostgreSQL', versions: ['16', '15', '14', '13'] },
  { value: 'mariadb', label: 'MariaDB', versions: ['10.11', '10.6', '10.5'] },
] as const;

export const RDS_INSTANCE_CLASSES = [
  { value: 'db.t3.micro', label: 'db.t3.micro (2 vCPU, 1 GB)' },
  { value: 'db.t3.small', label: 'db.t3.small (2 vCPU, 2 GB)' },
  { value: 'db.t3.medium', label: 'db.t3.medium (2 vCPU, 4 GB)' },
  { value: 'db.r5.large', label: 'db.r5.large (2 vCPU, 16 GB)' },
  { value: 'db.r5.xlarge', label: 'db.r5.xlarge (4 vCPU, 32 GB)' },
] as const;

export const ELASTICACHE_NODE_TYPES = [
  { value: 'cache.t3.micro', label: 'cache.t3.micro' },
  { value: 'cache.t3.small', label: 'cache.t3.small' },
  { value: 'cache.t3.medium', label: 'cache.t3.medium' },
  { value: 'cache.r5.large', label: 'cache.r5.large' },
] as const;

export const LAMBDA_RUNTIMES = [
  { value: 'nodejs20.x', label: 'Node.js 20.x' },
  { value: 'nodejs18.x', label: 'Node.js 18.x' },
  { value: 'python3.12', label: 'Python 3.12' },
  { value: 'python3.11', label: 'Python 3.11' },
  { value: 'java21', label: 'Java 21' },
  { value: 'java17', label: 'Java 17' },
  { value: 'dotnet8', label: '.NET 8' },
  { value: 'go1.x', label: 'Go 1.x' },
  { value: 'ruby3.3', label: 'Ruby 3.3' },
] as const;

export const EBS_VOLUME_TYPES = [
  { value: 'gp3', label: 'gp3 (General Purpose SSD)' },
  { value: 'gp2', label: 'gp2 (General Purpose SSD)' },
  { value: 'io1', label: 'io1 (Provisioned IOPS SSD)' },
  { value: 'io2', label: 'io2 (Provisioned IOPS SSD)' },
  { value: 'st1', label: 'st1 (Throughput Optimized HDD)' },
  { value: 'sc1', label: 'sc1 (Cold HDD)' },
] as const;

export const AVAILABILITY_ZONES: Record<string, string[]> = {
  'us-east-1': ['us-east-1a', 'us-east-1b', 'us-east-1c', 'us-east-1d', 'us-east-1e', 'us-east-1f'],
  'us-east-2': ['us-east-2a', 'us-east-2b', 'us-east-2c'],
  'us-west-1': ['us-west-1a', 'us-west-1b'],
  'us-west-2': ['us-west-2a', 'us-west-2b', 'us-west-2c', 'us-west-2d'],
  'eu-west-1': ['eu-west-1a', 'eu-west-1b', 'eu-west-1c'],
  'eu-central-1': ['eu-central-1a', 'eu-central-1b', 'eu-central-1c'],
  'ap-southeast-1': ['ap-southeast-1a', 'ap-southeast-1b', 'ap-southeast-1c'],
  'ap-northeast-1': ['ap-northeast-1a', 'ap-northeast-1c', 'ap-northeast-1d'],
};

export const COMMON_AMIS: Record<string, { value: string; label: string }[]> = {
  'us-east-1': [
    { value: 'ami-0c55b159cbfafe1f0', label: 'Amazon Linux 2023' },
    { value: 'ami-0885b1f6bd170450c', label: 'Ubuntu 22.04 LTS' },
    { value: 'ami-0cff7528ff583bf9a', label: 'Amazon Linux 2' },
  ],
};
