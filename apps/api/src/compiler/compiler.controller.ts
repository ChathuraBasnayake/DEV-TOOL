import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import JSZip from 'jszip';
import { CompilerService } from './compiler.service';
import { CompileDto } from './dto/compile.dto';
import type { TerraformOutput } from '@canvascloud/shared';

@Controller('compile')
@ApiTags('Compiler')
export class CompilerController {
  constructor(private readonly compilerService: CompilerService) {}

  @Post()
  @ApiOperation({ summary: 'Compile canvas state to Terraform configuration files' })
  @ApiBody({ type: CompileDto })
  async compile(@Body() dto: CompileDto): Promise<TerraformOutput> {
    return this.compilerService.compile(dto.nodes, dto.edges);
  }

  @Post('download')
  @ApiOperation({ summary: 'Compile canvas state and download HCL files as a zip package' })
  @ApiBody({ type: CompileDto })
  async download(
    @Body() dto: CompileDto,
    @Res() res: any,
  ): Promise<void> {
    const output = this.compilerService.compile(dto.nodes, dto.edges);

    const zip = new JSZip();
    for (const file of output.files) {
      zip.file(file.filename, file.content);
    }

    const archiveBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="terraform.zip"',
      'Content-Length': archiveBuffer.length,
    });

    res.end(archiveBuffer);
  }
}
export default CompilerController;
