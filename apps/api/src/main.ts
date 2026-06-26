import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Configure CORS to allow frontend connections
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Register global structured validation pipe
  app.useGlobalPipes(new CustomValidationPipe());

  // Register global formatted exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Register global response transform wrapper
  app.useGlobalInterceptors(new TransformInterceptor());

  // Set up Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('CanvasCloud API')
    .setDescription('Terraform compilation, security scanning, and project management')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 CanvasCloud API running on http://localhost:${port}`);
  console.log(`📖 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
