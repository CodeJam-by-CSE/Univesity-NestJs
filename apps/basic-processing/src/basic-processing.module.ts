/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BasicProcessingController } from './basic-processing.controller';
import { BasicProcessingService } from './basic-processing.service';
import { ResizeService } from './services/resize';
import { GreyscaleService } from './services/greyscale';
import { ContrastService } from './services/contrast.service';
import { NegativeService } from './services/negative.service';
import { SharpenService } from './services/sharpen.service';
import { EmbossService } from './services/embossing.service';
import { RotateService } from './services/rotate.service';

@Module({
  imports: [],
  controllers: [BasicProcessingController],
  providers: [
    BasicProcessingService,
    ResizeService,
    GreyscaleService,
    ContrastService,
    NegativeService,
    SharpenService,
    EmbossService,
    RotateService,
  ],
})
export class BasicProcessingModule { }
