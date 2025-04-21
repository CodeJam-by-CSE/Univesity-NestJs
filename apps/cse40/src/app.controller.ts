import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('images')
export class AppController {
  constructor(private readonly mainService: AppService) { }

  @Post('resize')
  async resizeImage(@Body() body: { imagePath: string; width: number; height: number }) {
    return this.mainService.sendToBasicProcessingResize(body.imagePath, body.width, body.height);
  }


  @Post('histogram_equalization_image')
  async histogramImageEnhancement(@Body() body: { imagePath: string }) {
    return this.mainService.sendToEnhancementHistogram(body.imagePath);
  }
  
  @Post('flood_fill_image')
  async floodFillImage(@Body() body: { imagePath: string; sr: number; sc: number; newColor: [number, number, number] }) {
    return this.mainService.sendToEnhancementFloodFill(body.imagePath, body.sr, body.sc, body.newColor);
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

  @Post('rotate')
  async rotateImage(@Body() body: { imagePath: string, angle: number }) {
    return this.mainService.sendToBasicProcessingRotate(body.imagePath, body.angle);
  }
}