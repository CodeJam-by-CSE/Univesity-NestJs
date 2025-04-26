import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('images')
export class AppController {
  constructor(private readonly mainService: AppService) { }

  /**
 * Controller Endpoints for Basic Image Processing Operations.
 *
 * Each endpoint handles a specific image processing task:
 * - resize: Resize an image to specified width and height.
 * - greyscale: Convert an image to greyscale.
 * - negative: Create a negative of the image.
 * - contrast: Adjust the image contrast by a given factor.
 * - rotate: Rotate an image by a given angle.
 * - sharpen: Sharpen the image to enhance details.
 * - emboss: Apply an emboss filter to the image for a 3D effect.
 *
 * All endpoints accept POST requests with necessary parameters in the request body,
 * and delegate the processing tasks to the corresponding methods in the MainService.
 */

  @Post('resize')
  async resizeImage(@Body() body: { imagePath: string; width: number; height: number }) {
    return this.mainService.sendToBasicProcessingResize(body.imagePath, body.width, body.height);
  }

  @Post('greyscale')
  async convertGreyscale(@Body() body: { imagePath: string }) {
    return this.mainService.sendToBasicProcessingGreyscale(body.imagePath);
  }

  @Post('negative')
  async createNegative(@Body() body: { imagePath: string }) {
    return this.mainService.sendToBasicProcessingNegative(body.imagePath);
  }

  @Post('contrast')
  async adjustContrast(@Body() body: { imagePath: string; factor: number }) {
    return this.mainService.sendToBasicProcessingContrast(body.imagePath, body.factor);
  }

  @Post('rotate')
  async rotateImage(@Body() body: { imagePath: string, angle: number }) {
    return this.mainService.sendToBasicProcessingRotate(body.imagePath, body.angle);
  }

  @Post('sharpen')
  async sharpenImage(@Body() body: { imagePath: string }) {
    return this.mainService.sendToBasicProcessingSharpen(body.imagePath);
  }
  @Post('emboss')
  async embossImage(@Body() body: { imagePath: string }) {
    return this.mainService.sendToBasicProcessingEmboss(body.imagePath);
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
}