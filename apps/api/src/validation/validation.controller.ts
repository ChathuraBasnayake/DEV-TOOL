import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ValidationService } from './validation.service';
import { ValidateConnectionDto } from './dto/validate-connection.dto';
import { ValidateConfigDto } from './dto/validate-config.dto';
import type {
  ValidateConnectionResponse,
  ValidateConfigResponse,
} from '@canvascloud/shared';

@Controller('validate')
@ApiTags('Validation')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  @Post('connection')
  @ApiOperation({
    summary:
      'Validate if a canvas edge between two AWS resource types is valid',
  })
  @ApiBody({ type: ValidateConnectionDto })
  validateConnection(
    @Body() dto: ValidateConnectionDto,
  ): ValidateConnectionResponse {
    return this.validationService.validateConnection(
      dto.sourceType,
      dto.targetType,
    );
  }

  @Post('config')
  @ApiOperation({
    summary:
      'Validate if required configuration parameters for an AWS resource type are provided',
  })
  @ApiBody({ type: ValidateConfigDto })
  validateConfig(@Body() dto: ValidateConfigDto): ValidateConfigResponse {
    return this.validationService.validateConfig(dto.resourceType, dto.config);
  }
}
