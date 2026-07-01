import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { CanvasNode, CanvasEdge } from '@canvascloud/shared';

export class CompileDto {
  @ApiProperty({
    description: 'Array of canvas nodes representing AWS resources',
    type: 'array',
    items: { type: 'object' },
  })
  @IsArray()
  nodes: CanvasNode[];

  @ApiProperty({
    description:
      'Array of canvas edges representing connections between resources',
    type: 'array',
    items: { type: 'object' },
  })
  @IsArray()
  edges: CanvasEdge[];
}
