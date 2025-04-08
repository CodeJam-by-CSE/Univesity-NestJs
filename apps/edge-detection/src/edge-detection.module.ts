import { Module } from '@nestjs/common';
import { EdgeDetectionController } from './edge-detection.controller';
import { EdgeDetectionService } from './edge-detection.service';

@Module({
  imports: [],
  controllers: [EdgeDetectionController],
  providers: [EdgeDetectionService],
})
export class EdgeDetectionModule { }
