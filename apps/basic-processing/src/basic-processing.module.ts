/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BasicProcessingController } from './basic-processing.controller';
import { BasicProcessingService } from './basic-processing.service';
import { ResizeService } from './services/resize.service';
import { GreyscaleService } from './services/greyscale.service';
import { ContrastService } from './services/contrast.service';
import { NegativeService } from './services/negative.service';

@Module({
  imports: [],
  controllers: [BasicProcessingController],
  providers: [
    BasicProcessingService,
    ResizeService,
    GreyscaleService,
    ContrastService,
    NegativeService,
  ],
})
export class BasicProcessingModule {}
