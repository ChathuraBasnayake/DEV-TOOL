import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { ValidateConfigRequest } from '@canvascloud/shared';
import type { AWSResourceType } from '@canvascloud/shared';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateConfigDto implements ValidateConfigRequest {
  @ApiProperty({ description: 'The AWS resource type', example: 'vpc' })
  @IsString()
  @IsNotEmpty()
  resourceType: AWSResourceType;

  @ApiProperty({ description: 'The configuration object to validate' })
  @IsObject()
  @IsNotEmpty()
  config: Record<string, unknown>;
}
