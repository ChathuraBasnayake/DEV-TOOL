import { Injectable } from '@nestjs/common';
import {
  isValidAWSConnection,
  getEdgeLabel,
  ValidateConnectionResponse,
  ValidateConfigResponse,
} from '@canvascloud/shared';
import type { AWSResourceType } from '@canvascloud/shared';

const REQUIRED_FIELDS: Record<AWSResourceType, { name: string; label: string }[]> = {
  'ec2':              [{ name: 'ami', label: 'AMI' }, { name: 'instance_type', label: 'Instance Type' }],
  'asg':              [{ name: 'name', label: 'Name' }, { name: 'min_size', label: 'Min Size' }, { name: 'max_size', label: 'Max Size' }],
  'launch-template':  [{ name: 'name', label: 'Name' }],
  'vpc':              [{ name: 'cidr_block', label: 'CIDR Block' }],
  'subnet':           [{ name: 'cidr_block', label: 'CIDR Block' }],
  'security-group':   [{ name: 'name', label: 'Name' }],
  'igw':              [],
  'nat-gw':           [],
  'route-table':      [],
  'eip':              [],
  'alb':              [{ name: 'name', label: 'Name' }],
  'target-group':     [{ name: 'name', label: 'Name' }, { name: 'port', label: 'Port' }, { name: 'protocol', label: 'Protocol' }],
  'rds':              [{ name: 'allocated_storage', label: 'Storage' }, { name: 'engine', label: 'Engine' }, { name: 'instance_class', label: 'Instance Class' }],
  'elasticache':      [{ name: 'cluster_id', label: 'Cluster ID' }, { name: 'engine', label: 'Engine' }, { name: 'node_type', label: 'Node Type' }],
  'dynamodb':         [{ name: 'name', label: 'Table Name' }, { name: 'billing_mode', label: 'Billing Mode' }, { name: 'hash_key', label: 'Hash Key' }],
  's3':               [{ name: 'bucket', label: 'Bucket Name' }],
  'iam-role':         [{ name: 'name', label: 'Name' }, { name: 'assume_role_policy', label: 'Assume Role Policy' }],
  'iam-policy':       [{ name: 'name', label: 'Name' }, { name: 'policy_document', label: 'Policy Document' }],
  'lambda':           [{ name: 'function_name', label: 'Function Name' }, { name: 'runtime', label: 'Runtime' }, { name: 'handler', label: 'Handler' }],
  'api-gateway':      [{ name: 'name', label: 'Name' }, { name: 'protocol_type', label: 'Protocol Type' }],
  'route53':          [{ name: 'name', label: 'Domain Name' }],
  'cloudfront':       [],
};

@Injectable()
export class ValidationService {
  validateConnection(
    sourceType: AWSResourceType,
    targetType: AWSResourceType,
  ): ValidateConnectionResponse {
    const valid = isValidAWSConnection(sourceType, targetType);
    const edgeInfo = getEdgeLabel(sourceType, targetType);

    return {
      valid,
      label: edgeInfo?.label,
      terraformEffect: edgeInfo?.terraformEffect,
    };
  }

  validateConfig(
    resourceType: AWSResourceType,
    config: Record<string, unknown>,
  ): ValidateConfigResponse {
    const requiredFields = REQUIRED_FIELDS[resourceType] || [];
    const errors = [];

    for (const field of requiredFields) {
      const value = config[field.name];
      if (value === undefined || value === null || value === '') {
        errors.push({
          field: field.name,
          message: `${field.label} is required`,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
