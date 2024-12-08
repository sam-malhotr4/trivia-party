import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Specify the application type as NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for cross-origin requests
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from the frontend
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  // Serve static files (HTML, CSS, JS) from the 'public' directory
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Set the base views directory and view engine, if using templates
  app.setBaseViewsDir(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
