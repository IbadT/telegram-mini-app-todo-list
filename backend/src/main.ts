import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: [
      'https://*.telegram.org',
      'https://t.me',
      'https://*.t.me',
      'http://localhost:5173', // For local development
      'http://localhost:3000', // For local development
      'https://telegram-mini-app-todo-list.onrender.com',
      'https://ibadt-telegram-mini-app-todo-list-66c9.twc1.net', // Ваш фронтенд
      'https://telegram-web-app-url.com' // Домен Telegram WebApp
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'tg-init-data',
      'tg-user-id',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Credentials',
      'X-Telegram-Init-Data',
    ],
    exposedHeaders: ['tg-init-data'],
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Telegram Mini App API')
    .setDescription('API documentation for the Telegram Mini App Task Manager')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
