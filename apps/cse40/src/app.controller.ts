import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('images')
export class AppController {
  constructor(private readonly mainService: AppService) { }

  @Post('detect-edge')
  async detectEdge(@Body() body: { imageBase64: string }) {
    return this.mainService.sendToEdgeService(body.imageBase64);
  }

  @Post('resize')
  async resizeImage(@Body() body: { imageBase64: string; width: number; height: number }) {
    return this.mainService.sendToBasicProcessingResize(body.imageBase64, body.width, body.height);
  }

  @Post('greyscale')
  async convertGreyscale(@Body() body: { imageBase64: string }) {
    return this.mainService.sendToBasicProcessingGreyscale(body.imageBase64);
  }

  @Post('contrast')
  async adjustContrast(@Body() body: { imageBase64: string; factor: number }) {
    return this.mainService.sendToBasicProcessingContrast(body.imageBase64, body.factor);
  }

  @Post('negative')
  async createNegative(@Body() body: { imageBase64: string }) {
    return this.mainService.sendToBasicProcessingNegative(body.imageBase64);
  }
}