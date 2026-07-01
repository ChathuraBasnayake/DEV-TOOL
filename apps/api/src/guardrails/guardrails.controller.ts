import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { GuardrailsService } from './guardrails.service';
import { ScanDto } from './dto/scan.dto';
import type { ScanResponse } from '@canvascloud/shared';

@Controller('scan')
@ApiTags('Guardrails')
export class GuardrailsController {
  constructor(private readonly guardrailsService: GuardrailsService) {}

  @Post()
  @ApiOperation({ summary: 'Evaluate canvas topology against security rules' })
  @ApiBody({ type: ScanDto })
  scan(@Body() dto: ScanDto): ScanResponse {
    return this.guardrailsService.scan(dto.nodes, dto.edges);
  }
}
export default GuardrailsController;
