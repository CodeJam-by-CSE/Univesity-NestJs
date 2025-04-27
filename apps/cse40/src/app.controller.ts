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

/**
 * Controller for basic image processing operations.
 *
 * Handles fundamental image transformations such as:
 * - Resizing images
 * - Converting to greyscale
 * - Creating negative images
 * - Adjusting contrast
 * - Rotating images
 * - Sharpening images
 * - Applying emboss effects
 */
@ApiTags('basic-processing')
@Controller('basic-processing')
export class BasicProcessingController {
  constructor(private readonly mainService: AppService) {}

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
}

  /**
 * This microservice controller provides two image enhancement operations:
 * 
 * 1. POST /histogram_equalization_image:
 *    - Accepts an image path.
 *    - Sends a request to the enhancement service to apply histogram equalization,
 *      which improves the contrast of the image by redistributing pixel intensity values.
 * 
 * 2. POST /flood_fill_image:
 *    - Accepts an image path, starting coordinates (row and column), and a new RGB color.
 *    - Sends a request to the enhancement service to perform a flood fill operation,
 *      changing the connected area starting from the given point to the specified new color.
 * 
 * Both endpoints delegate the processing to the mainService, which handles communication 
 * with the underlying enhancement microservice.
 */

  @Post('histogram_equalization_image')
  async histogramImageEnhancement(@Body() body: { imagePath: string }) {
    return this.mainService.sendToEnhancementHistogram(body.imagePath);
  }
}

  @Post('flood_fill_image')
  async floodFillImage(@Body() body: { imagePath: string; sr: number; sc: number; newColor: [number, number, number] }) {
    return this.mainService.sendToEnhancementFloodFill(body.imagePath, body.sr, body.sc, body.newColor);
  }

  @Post('canny_edge_detection_image')
  async cannyEdgeDetection(@Body() body: { imagePath: string }) {
    return this.mainService.sendToFeatureDetectionCannyEdgeDetection(body.imagePath);
  }

  @Post('harris_corner_detection_image')
  async harrisSharp(@Body() body: { imagePath: string; k?: number; windowSize?: number; thresh?: number }) {
    return this.mainService.sendToFeatureDetectionHarrisSharp(body.imagePath, body.k, body.windowSize, body.thresh);
  }
}