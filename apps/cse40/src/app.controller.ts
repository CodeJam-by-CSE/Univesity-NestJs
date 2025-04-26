import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('images')
export class AppController {
  constructor(private readonly mainService: AppService) { }

  @Post('resize')
  async resizeImage(@Body() body: { imagePath: string; width: number; height: number }) {
    return this.mainService.sendToBasicProcessingResize(body.imagePath, body.width, body.height);
  }

  @Post('greyscale')
  async convertGreyscale(@Body() body: { imagePath: string }) {
    return this.mainService.sendToBasicProcessingGreyscale(body.imagePath);
  }


  @Post('histogram_equalization_image')
  async histogramImageEnhancement(@Body() body: { imagePath: string }) {
    return this.mainService.sendToEnhancementHistogram(body.imagePath);
  }

  @Post('canny_edge_detection_image')
  async cannyEdgeDetection(@Body() body: { imagePath: string }) {
    return this.mainService.sendToFeatureDetectionCannyEdgeDetection(body.imagePath);
  }

  @Post('harris_sharp_image')
  async harrisSharp(@Body() body: { imagePath: string; k?: number; windowSize?: number; thresh?: number }) {
    return this.mainService.sendToFeatureDetectionHarrisSharp(body.imagePath, body.k, body.windowSize, body.thresh);
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