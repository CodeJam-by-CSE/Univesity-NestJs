import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { 
  ResizeImageDto, 
  GreyscaleDto,
  ContrastDto,
  ImagePathDto,
  RotateImageDto,
  SharpenImageDto
} from './app.dto';

@ApiTags('images')
@Controller('images')
export class AppController {
  constructor(private readonly mainService: AppService) {}

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
  @ApiOperation({ summary: 'Resize an image to specific dimensions' })
  @ApiResponse({ status: 200, description: 'Image successfully resized' })
  @ApiResponse({ status: 400, description: 'Invalid input parameters' })
  async resizeImage(@Body() body: ResizeImageDto) {
    return this.mainService.sendToBasicProcessingResize(body.imagePath, body.width, body.height);
  }

  @Post('greyscale')
  @ApiOperation({ summary: 'Convert an image to greyscale' })
  @ApiResponse({ status: 200, description: 'Image successfully converted to greyscale' })
  async convertGreyscale(@Body() body: GreyscaleDto) {
    return this.mainService.sendToBasicProcessingGreyscale(body.imagePath);
  }

  @Post('negative')
  @ApiOperation({ summary: 'Create negative version of an image' })
  @ApiResponse({ status: 200, description: 'Negative image successfully created' })
  async createNegative(@Body() body: ImagePathDto) {
    return this.mainService.sendToBasicProcessingNegative(body.imagePath);
  }

  @Post('contrast')
  @ApiOperation({ summary: 'Adjust image contrast' })
  @ApiResponse({ status: 200, description: 'Image contrast successfully adjusted' })
  async adjustContrast(@Body() body: ContrastDto) {
    return this.mainService.sendToBasicProcessingContrast(body.imagePath, body.factor);
  }

  @Post('rotate')
  @ApiOperation({ summary: 'Rotate an image by specified angle' })
  @ApiResponse({ status: 200, description: 'Image successfully rotated' })
  async rotateImage(@Body() body: RotateImageDto) {
    return this.mainService.sendToBasicProcessingRotate(body.imagePath, body.angle);
  }

  @Post('sharpen')
  @ApiOperation({ summary: 'Sharpen an image' })
  @ApiResponse({ status: 200, description: 'Image successfully sharpened' })
  async sharpenImage(@Body() body: ImagePathDto) {
    return this.mainService.sendToBasicProcessingSharpen(body.imagePath);
  }
  @Post('emboss')
  @ApiOperation({ summary: 'Apply emboss effect to an image' })
  @ApiResponse({ status: 200, description: 'Emboss effect successfully applied' })
  async embossImage(@Body() body: ImagePathDto) {
    return this.mainService.sendToBasicProcessingEmboss(body.imagePath);
  }

  @Post('histogram_equalization_image')
  @ApiOperation({ summary: 'Enhance image using histogram equalization' })
  @ApiResponse({ status: 200, description: 'Image successfully enhanced' })
  async histogramImageEnhancement(@Body() body: ImagePathDto) {
    return this.mainService.sendToEnhancementHistogram(body.imagePath);
  }

  @Post('canny_edge_detection_image')
  @ApiOperation({ summary: 'Detect edges of a given image' })
  @ApiResponse({ status: 200, description: 'Edges successfully detected' })
  async cannyEdgeDetection(@Body() body: ImagePathDto) {
    return this.mainService.sendToFeatureDetectionCannyEdgeDetection(body.imagePath);
  }

  @Post('harris_sharp_image')
  @ApiOperation({ summary: 'Sharpen a given image' })
  @ApiResponse({ status: 200, description: 'Image successfully sharpened' })
  async harrisSharp(@Body() body: SharpenImageDto) {
    return this.mainService.sendToFeatureDetectionHarrisSharp(body.imagePath, body.k, body.windowSize, body.thresh);
  }
}