/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ResizeService } from './services/resize.service';
import { GreyscaleService } from './services/greyscale.service';
import { ContrastService } from './services/contrast.service';
import { NegativeService } from './services/negative.service';
import { RotateService } from './services/rotate.service';

@Injectable()
export class BasicProcessingService {
  constructor(
    private readonly resizeService: ResizeService,
    private readonly greyscaleService: GreyscaleService,
    private readonly contrastService: ContrastService,
    private readonly negativeService: NegativeService,
    private readonly rotateService: RotateService,
  ) {}

  async resizeImage(data: { imagePath: string; width: number; height: number }) {
    return await this.resizeService.resize(data);
  }

  async convertToGreyscale(imagePath: string) {
    return await this.greyscaleService.convert(imagePath);
  }

  async adjustContrast(data: { imagePath: string; factor: number }) {
    return await this.contrastService.adjust(data);
  }

  async createNegative(imagePath: string) {
    return await this.negativeService.createNegative(imagePath);
  }

  async rotateImage(data: { imagePath: string; angle: number }) {
    return await this.rotateService.rotate(data);
  }
}