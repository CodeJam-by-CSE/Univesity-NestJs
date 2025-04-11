/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ResizeService } from './services/resize.service';
import { GreyscaleService } from './services/greyscale.service';
import { ContrastService } from './services/contrast.service';
import { NegativeService } from './services/negative.service';

@Injectable()
export class BasicProcessingService {
  constructor(
    private readonly resizeService: ResizeService,
    private readonly greyscaleService: GreyscaleService,
    private readonly contrastService: ContrastService,
    private readonly negativeService: NegativeService,
  ) {}

  async resizeImage(data: { image: string; width: number; height: number }) {
    return await this.resizeService.resize(data);
  }

  async convertToGreyscale(image: string) {
    return await this.greyscaleService.convert(image);
  }

  async adjustContrast(data: { image: string; factor: number }) {
    return await this.contrastService.adjust(data);
  }

  async createNegative(image: string) {
    return await this.negativeService.createNegative(image);
  }
}