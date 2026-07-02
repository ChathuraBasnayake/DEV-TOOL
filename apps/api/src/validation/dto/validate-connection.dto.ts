import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateConnectionRequest } from '@canvascloud/shared';
import type { AWSResourceType } from '@canvascloud/shared';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateConnectionDto implements ValidateConnectionRequest {
  @ApiProperty({
    description: 'The source node AWS resource type',
    example: 'vpc',
  })
  @IsString()
  @IsNotEmpty()
  sourceType: AWSResourceType;

  @ApiProperty({
    description: 'The target node AWS resource type',
    example: 'subnet',
  })
  @IsString()
  @IsNotEmpty()
  targetType: AWSResourceType;
}
