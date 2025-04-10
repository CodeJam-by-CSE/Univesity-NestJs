/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NegativeImageController } from './negative-image.controller';
import { NegativeImageService } from './negative-image.service';

@Module({
  imports: [],
  controllers: [NegativeImageController],
  providers: [NegativeImageService],
})
export class NegativeImageModule {}
