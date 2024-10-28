import { ModuleRef, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter, ValidationFilter } from './utils/response.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomValidationPipe } from './utils/customValidationPipe';
import { useContainer } from 'class-validator';
import { ValidatorsModule } from './module/validators.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with open settings
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,POST,PUT,DELETE', // Allow specific methods
  });
  
  // Global Pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Global Filters
  app.useGlobalFilters(new AllExceptionsFilter());
  
  app.useGlobalFilters(new ValidationFilter());
  
  // Use the custom validation pipe globally
  app.useGlobalPipes(new CustomValidationPipe(app.get(ModuleRef)));
  
  // Global Prefix
  app.setGlobalPrefix('api');

  //define useContainer in main.ts file
  useContainer(app.select(ValidatorsModule), { fallbackOnErrors: true });

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('API Sistem Informasi B3')
    .setDescription('List API yang telah di support SI B3')
    .setVersion('1.0')
    .addBearerAuth()  // If you use JWT or token-based authentication
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Swagger UI available at /api-docs

  await app.listen(3002);
}

bootstrap();
