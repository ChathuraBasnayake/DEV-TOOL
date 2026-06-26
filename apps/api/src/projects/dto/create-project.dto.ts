import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { CreateProjectRequest } from '@canvascloud/shared';
import type { CanvasState } from '@canvascloud/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto implements CreateProjectRequest {
  @ApiProperty({ description: 'Name of the project', example: 'My AWS Stack' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The current state of the react-flow canvas' })
  @IsObject()
  @IsNotEmpty()
  canvas: CanvasState;
}
