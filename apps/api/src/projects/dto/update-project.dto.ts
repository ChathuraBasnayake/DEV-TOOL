import { IsString, IsOptional, IsObject } from 'class-validator';
import { UpdateProjectRequest } from '@canvascloud/shared';
import type { CanvasState } from '@canvascloud/shared';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto implements UpdateProjectRequest {
  @ApiProperty({
    description: 'Updated name of the project',
    required: false,
    example: 'My Production AWS Stack',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Updated state of the react-flow canvas',
    required: false,
  })
  @IsObject()
  @IsOptional()
  canvas?: CanvasState;
}
