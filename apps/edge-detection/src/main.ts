// apps/edge-detection/src/main.ts
import { NestFactory } from '@nestjs/core';
import { EdgeDetectionModule } from './edge-detection.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EdgeDetectionModule, {
    transport: Transport.TCP,
    options: { host: '127.0.0.1', port: 4001 },
  });
  await app.listen();
  console.log('✅ Edge Detection Microservice is running on port 4001');
}
bootstrap();
