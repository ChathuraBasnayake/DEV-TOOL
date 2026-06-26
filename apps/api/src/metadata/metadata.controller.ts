import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  AWS_REGIONS,
  EC2_INSTANCE_TYPES,
  RDS_DB_ENGINES,
  RDS_INSTANCE_CLASSES,
  ELASTICACHE_NODE_TYPES,
  LAMBDA_RUNTIMES,
  EBS_VOLUME_TYPES,
  AVAILABILITY_ZONES,
  COMMON_AMIS,
} from '@canvascloud/shared';

@Controller('metadata')
@ApiTags('Metadata')
export class MetadataController {
  @Get('aws')
  @ApiOperation({ summary: 'Get AWS resource dropdown configuration metadata' })
  getAwsMetadata() {
    return {
      regions: AWS_REGIONS,
      instanceTypes: EC2_INSTANCE_TYPES,
      dbEngines: RDS_DB_ENGINES,
      dbInstanceClasses: RDS_INSTANCE_CLASSES,
      elasticacheNodeTypes: ELASTICACHE_NODE_TYPES,
      lambdaRuntimes: LAMBDA_RUNTIMES,
      ebsVolumeTypes: EBS_VOLUME_TYPES,
      availabilityZones: AVAILABILITY_ZONES,
      commonAmis: COMMON_AMIS,
    };
  }
}
