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
  async resizeImage(@Body() body: { imagePath: string; width: number; height: number }) {
    return this.mainService.sendToBasicProcessingResize(body.imagePath, body.width, body.height);
  }

  @Post('greyscale')
  async convertGreyscale(@Body() body: { imageBase64: string }) {
    return this.mainService.sendToBasicProcessingGreyscale(body.imageBase64);
  }

  @Post('contrast')
  async adjustContrast(@Body() body: { imagePath: string; factor: number }) {
    return this.mainService.sendToBasicProcessingContrast(body.imagePath, body.factor);
  }

  @Post('negative')
  async createNegative(@Body() body: { imagePath: string }) {
    return this.mainService.sendToBasicProcessingNegative(body.imagePath);
  }
  @Post('sharpen')
  async sharpenImage(@Body() body: { imagePath: string }) {
    return this.mainService.sendToBasicProcessingSharpen(body.imagePath);
  }
  @Post('emboss')
  async embossImage(@Body() body: { imagePath: string }) {
    return this.mainService.sendToBasicProcessingEmboss(body.imagePath);
  }
}