import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { ValidationModule } from './validation/validation.module';
import { MetadataModule } from './metadata/metadata.module';
import { CompilerModule } from './compiler/compiler.module';
import { GuardrailsModule } from './guardrails/guardrails.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProjectsModule,
    ValidationModule,
    MetadataModule,
    CompilerModule,
    GuardrailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
