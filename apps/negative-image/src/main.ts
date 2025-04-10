import { NestFactory } from '@nestjs/core';
import { NegativeImageModule } from './negative-image.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NegativeImageModule,
    {
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 4002 },
    },
  );
  await app.listen();
  console.log('✅ Negative Image Microservice is running on port 4002');
}
bootstrap();