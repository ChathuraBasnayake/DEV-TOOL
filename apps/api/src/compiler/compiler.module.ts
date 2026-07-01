import { Module } from '@nestjs/common';
import { CompilerService } from './compiler.service';
import { CompilerController } from './compiler.controller';

@Module({
  controllers: [CompilerController],
  providers: [CompilerService],
  exports: [CompilerService],
})
export class CompilerModule {}
