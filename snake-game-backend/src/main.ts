import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with more restrictive settings
  app.enableCors({
    origin: ['https://next-snake-dirag.lab.sspcloud.fr', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  
  // Global prefix for all routes (optional)
  app.setGlobalPrefix('api');
  
  // Start the server
  await app.listen(3001); // Change this to 3001 or any other available port
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
